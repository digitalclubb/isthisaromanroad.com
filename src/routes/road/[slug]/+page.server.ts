import type { RoadFeature } from "$lib/roads.js";
import { loadAllFeatures } from "$lib/server/roads-data.js";
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
 * Server-only load: reassembles the full feature set from the partitioned
 * cell files (memoised, build-time only) and returns ONLY the story's
 * matching segments. Using `+page.server.ts` (rather than a universal
 * `+page.ts` with `fetch`) means SvelteKit doesn't serialise the whole
 * dataset into each prerendered HTML — only the filtered subset ships.
 */
export const load: PageServerLoad = async ({ params }) => {
	const story = STORIES.find((s) => s.key === params.slug);
	if (!story) error(404, "Unknown road");

	const features = await loadAllFeatures();
	const segments: RoadFeature[] = segmentsForStory(story, features);

	return { story, segments };
};
