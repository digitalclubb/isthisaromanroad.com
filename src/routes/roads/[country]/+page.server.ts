import { toOverviewFeatures } from "$lib/geometry.js";
import { REGION_EXTRA, REGION_NOTES } from "$lib/region-notes.js";
import { featuresForRegion, findRegion, loadRegions } from "$lib/server/regions.js";
import { STORIES } from "$lib/stories.js";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

export const prerender = true;

/** One page per country in data/regions.json, minus the exclusions in regions.ts. */
export const entries = async () => (await loadRegions()).map((r) => ({ country: r.slug }));

export const load: PageServerLoad = async ({ params }) => {
	const region = await findRegion(params.country);
	if (!region) error(404, "Unknown country");

	// Eight siblings, chosen as a rotating window rather than "the eight
	// largest". Listing all 25 on every page was ~960 identical links and a
	// third of the visible text on the smallest page; always listing the same
	// eight would instead leave the other seventeen with one inbound link each,
	// from the hub. A window gives every page exactly eight inbound links and
	// keeps the set fully connected.
	const all = await loadRegions();
	const index = all.findIndex((r) => r.slug === region.slug);
	const others = Array.from({ length: 8 }, (_, i) => all[(index + 1 + i) % all.length])
		.filter((r) => r && r.slug !== region.slug)
		.map((r) => ({ slug: r.slug, name: r.name }));

	// Named roads with a history page, keyed by the name the list shows. Only
	// stories that list this country, so the Via Traiana near Aachen does not
	// link to the Italian one.
	const storyKeys: Record<string, string> = {};
	for (const road of region.namedRoads) {
		const story = STORIES.find(
			(s) =>
				s.countries?.includes(region.slug) &&
				s.match.some((m) => m.toLowerCase() === road.name.toLowerCase()),
		);
		if (story) storyKeys[road.name] = story.key;
	}

	return {
		region,
		storyKeys,
		note: REGION_NOTES[region.slug] ?? null,
		extra: REGION_EXTRA[region.slug] ?? null,
		// Geometry only, simplified: the raw features would inline megabytes of
		// unused properties and vertices into the prerendered HTML.
		segments: toOverviewFeatures(await featuresForRegion(region.slug)),
		others,
	};
};
