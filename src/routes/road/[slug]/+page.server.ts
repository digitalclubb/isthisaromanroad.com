import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { RoadCollection, RoadFeature } from "$lib/roads.js";
import { STORIES, segmentsForStory } from "$lib/stories.js";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

export const prerender = true;

/**
 * Enumerate every road slug at build time so SvelteKit can statically
 * generate one HTML file per famous road.
 */
export const entries = () => STORIES.map((s) => ({ slug: s.key }));

/**
 * Server-only load: reads the bundled roads.geojson from the static
 * folder via node:fs and returns ONLY the filtered subset. Using
 * `+page.server.ts` (rather than a universal `+page.ts` with `fetch`)
 * means SvelteKit doesn't have to serialise the full fetched response
 * into each prerendered HTML — the universal-fetch path was inlining
 * the entire 600 KB roads.geojson into every road page (15 MB total
 * across 22 pages). Filtered serialisation keeps each page lean.
 */
export const load: PageServerLoad = async ({ params }) => {
	const story = STORIES.find((s) => s.key === params.slug);
	if (!story) error(404, "Unknown road");

	const path = resolve("static/roads.geojson");
	const raw = await readFile(path, "utf-8");
	const fc = JSON.parse(raw) as RoadCollection;
	const segments: RoadFeature[] = segmentsForStory(story, fc.features);

	return { story, segments };
};
