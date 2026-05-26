import { STORIES } from "$lib/stories.js";
import type { RequestHandler } from "./$types.js";

export const prerender = true;

const SITE = "https://isthisaromanroad.com";

export const GET: RequestHandler = () => {
	const today = new Date().toISOString().slice(0, 10);
	const urls = [
		{ loc: `${SITE}/`, changefreq: "monthly", priority: "1.0" },
		...STORIES.map((s) => ({
			loc: `${SITE}/road/${s.key}`,
			changefreq: "monthly",
			priority: "0.8",
		})),
	];
	const entries = urls
		.map(
			(u) => `	<url>
		<loc>${u.loc}</loc>
		<lastmod>${today}</lastmod>
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
