import type { RequestHandler } from "./$types.js";

export const prerender = true;

const SITE = "https://isthisaromanroad.com";

export const GET: RequestHandler = () => {
	const today = new Date().toISOString().slice(0, 10);
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${SITE}/</loc>
		<lastmod>${today}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>1.0</priority>
	</url>
</urlset>`;
	return new Response(xml, {
		headers: { "Content-Type": "application/xml" },
	});
};
