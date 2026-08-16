import { loadCounties } from "$lib/server/counties.js";
import { loadRegions } from "$lib/server/regions.js";
import { STORIES } from "$lib/stories.js";
import type { RequestHandler } from "./$types.js";

export const prerender = true;

const SITE = "https://isthisaromanroad.com";

/**
 * Date the site's content last genuinely changed. Deliberately a hand-set
 * constant rather than the build date: stamping every URL with "today" on
 * every deploy tells Google every page changed each time, and a sitemap
 * whose lastmod is always now is one Google learns to discount. Bump this
 * when the roads, stories or page content actually change.
 */
const CONTENT_UPDATED = "2026-08-16";

type Entry = { loc: string; changefreq: string; priority: string };

export const GET: RequestHandler = async () => {
	const regions = await loadRegions();
	const counties = await loadCounties();
	const urls: Entry[] = [
		{ loc: `${SITE}/`, changefreq: "monthly", priority: "1.0" },
		{ loc: `${SITE}/roads`, changefreq: "monthly", priority: "0.9" },
		{ loc: `${SITE}/roads/britain`, changefreq: "monthly", priority: "0.8" },
		{ loc: `${SITE}/modern-roads`, changefreq: "monthly", priority: "0.8" },
		...STORIES.map((s) => ({
			loc: `${SITE}/road/${s.key}`,
			changefreq: "yearly",
			priority: "0.8",
		})),
		...counties.map((c) => ({
			loc: `${SITE}/roads/britain/${c.slug}`,
			changefreq: "yearly",
			priority: "0.7",
		})),
		...regions.map((r) => ({
			loc: `${SITE}/roads/${r.slug}`,
			changefreq: "yearly",
			priority: "0.7",
		})),
	];

	const entries = urls
		.map(
			(u) => `	<url>
		<loc>${u.loc}</loc>
		<lastmod>${CONTENT_UPDATED}</lastmod>
		<changefreq>${u.changefreq}</changefreq>
		<priority>${u.priority}</priority>
	</url>`,
		)
		.join("\n");
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
	return new Response(xml, {
		headers: { "Content-Type": "application/xml" },
	});
};
