import { loadCounties } from "$lib/server/counties.js";
import type { PageServerLoad } from "./$types.js";

export const prerender = true;

/**
 * Exists so /roads/britain is a page rather than a 404. Crawlers and users both
 * truncate URLs, and the county breadcrumb names this level, so it has to
 * resolve to something.
 */
export const load: PageServerLoad = async () => {
	const counties = await loadCounties();
	return {
		counties: counties.map((c) => ({
			slug: c.slug,
			name: c.name,
			segmentCount: c.segmentCount,
			lengthKm: c.lengthKm,
			roadCount: c.roads.length,
		})),
		totalSegments: counties.reduce((sum, c) => sum + c.segmentCount, 0),
	};
};
