import { dateRangeOf, dominantCertainty, totalLengthKm } from "$lib/geometry.js";
import { ROAD_DETAIL } from "$lib/road-detail.js";
import type { RoadFeature } from "$lib/roads.js";
import { countiesForRoad } from "$lib/server/counties.js";
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

	// Every other road, so each page links to all 21 siblings. Before this the
	// only inbound link to /road/* sat behind a geolocation prompt, leaving the
	// set uncrawlable — Search Console reported them "unknown to Google".
	const siblings = STORIES.filter((s) => s.key !== story.key).map((s) => ({
		key: s.key,
		name: s.name,
	}));

	return {
		story,
		segments,
		siblings,
		// Long-form sections live in a server-only module so the ~14,000 words
		// are inlined into these 22 prerendered pages rather than shipped in
		// the client bundle the way stories.ts is.
		detail: ROAD_DETAIL[story.key] ?? null,
		counties: await countiesForRoad(story.key),
		lengthKm: totalLengthKm(segments),
		segmentCount: segments.length,
		certainty: dominantCertainty(segments),
		dates: dateRangeOf(segments),
	};
};
