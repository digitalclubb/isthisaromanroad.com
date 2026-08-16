import { toOverviewFeatures } from "$lib/geometry.js";
import { REGION_EXTRA, REGION_NOTES } from "$lib/region-notes.js";
import { featuresForRegion, findRegion, loadRegions } from "$lib/server/regions.js";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

export const prerender = true;

/** One page per country in data/regions.json, minus the exclusions in regions.ts. */
export const entries = async () => (await loadRegions()).map((r) => ({ country: r.slug }));

export const load: PageServerLoad = async ({ params }) => {
	const region = await findRegion(params.country);
	if (!region) error(404, "Unknown country");

	// The eight largest other networks, not all 30. Repeating the full list on
	// every page put ~960 identical links across the set and made the shared
	// navigation a third of the visible text on the smallest pages.
	const all = await loadRegions();
	const others = all
		.filter((r) => r.slug !== region.slug)
		.slice(0, 8)
		.map((r) => ({ slug: r.slug, name: r.name }));

	return {
		region,
		note: REGION_NOTES[region.slug] ?? null,
		extra: REGION_EXTRA[region.slug] ?? null,
		// Geometry only, simplified: the raw features would inline megabytes of
		// unused properties and vertices into the prerendered HTML.
		segments: toOverviewFeatures(await featuresForRegion(region.slug)),
		others,
	};
};
