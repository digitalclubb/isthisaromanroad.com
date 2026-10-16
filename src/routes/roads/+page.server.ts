import { firstSentence } from "$lib/format.js";
import { totalLengthKm, totalLengthMeters } from "$lib/geometry.js";
import { loadCounties } from "$lib/server/counties.js";
import { loadRegions } from "$lib/server/regions.js";
import { loadAllFeatures } from "$lib/server/roads-data.js";
import { STORIES, segmentsForStory } from "$lib/stories.js";
import type { PageServerLoad } from "./$types.js";

export const prerender = true;

export type RoadSummary = {
	key: string;
	name: string;
	from?: string;
	to?: string;
	/** First sentence of the story body, plain text. */
	teaser: string;
	/**
	 * Surveyed length across every matching Itiner-e segment, in km, or null
	 * when the dataset attributes no segment to this road by name. Null is not
	 * zero: the page must render it as absent data, never as "0 km".
	 */
	lengthKm: number | null;
	segmentCount: number;
	/** Present for roads beyond Britain; see Story.countries. */
	countries?: string[];
};

/**
 * Build-time only. Reassembles the dataset once (memoised across all
 * prerenders) and derives each road's real length and segment count.
 *
 * A story that matches nothing reports no length rather than "0 km"; see
 * `lengthKm`. The mapped totals cover Britain only, because the standfirst
 * they appear in is about Britain's roads.
 */
export const load: PageServerLoad = async () => {
	const features = await loadAllFeatures();

	let mappedMeters = 0;
	const roads: RoadSummary[] = STORIES.map((story) => {
		const segments = segmentsForStory(story, features);
		if (!story.countries) mappedMeters += totalLengthMeters(segments);
		return {
			key: story.key,
			name: story.name,
			from: story.from,
			to: story.to,
			teaser: firstSentence(story.body, story.name),
			lengthKm: totalLengthKm(segments),
			segmentCount: segments.length,
			countries: story.countries,
		};
	});

	const regions = (await loadRegions()).map((r) => ({
		slug: r.slug,
		name: r.name,
		segmentCount: r.segmentCount,
	}));

	const counties = (await loadCounties()).map((c) => ({ slug: c.slug, name: c.name }));

	const britain = roads.filter((r) => !r.countries);

	return {
		britain,
		empire: roads.filter((r) => r.countries),
		regions,
		counties,
		mappedRoadCount: britain.filter((r) => r.segmentCount > 0).length,
		// Summed from raw metres, not from the already-rounded per-road figures.
		mappedKm: Math.round(mappedMeters / 1000 / 100) * 100,
	};
};
