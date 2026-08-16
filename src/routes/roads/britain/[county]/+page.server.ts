import { toOverviewFeatures } from "$lib/geometry.js";
import { featuresForCounty, findCounty, loadCounties } from "$lib/server/counties.js";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

export const prerender = true;

export const entries = async () => (await loadCounties()).map((c) => ({ county: c.slug }));

export const load: PageServerLoad = async ({ params }) => {
	const county = await findCounty(params.county);
	if (!county) error(404, "Unknown county");

	// Eight siblings as a rotating window, for the reason given in the country
	// page's load: a fixed "top eight" would leave every other county with a
	// single inbound link, from the hub.
	const all = await loadCounties();
	const index = all.findIndex((c) => c.slug === county.slug);
	const others = Array.from({ length: 8 }, (_, i) => all[(index + 1 + i) % all.length])
		.filter((c) => c && c.slug !== county.slug)
		.map((c) => ({ slug: c.slug, name: c.name }));

	return {
		county,
		// Simplified as on the country pages, but at 100 m rather than the 500 m
		// default: a county map is zoomable to 11, where a tile pixel is about
		// 47 m, so 500 m would show as roughly ten pixels of error on the pages
		// whose whole job is showing where the roads actually run. Page weight
		// is not the constraint here — Kent is 15 KB raw.
		segments: toOverviewFeatures(await featuresForCounty(county.slug), 100),
		roads: county.roads,
		others,
	};
};
