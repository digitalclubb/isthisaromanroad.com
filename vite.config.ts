import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { withPwa } from "@vite-pwa/sveltekit";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		// withPwa wraps the sveltekit() plugin itself (v2 API); its first
		// argument is the SvelteKit config (Kit 3 has no svelte.config.js).
		...withPwa(
			{
				preprocess: vitePreprocess(),
				adapter: adapter({ runtime: "nodejs22.x" }),
				prerender: { handleHttpError: "warn" },
			},
			{
				// Registered by hand in +layout.svelte: the plugin can't inject into
				// SvelteKit's HTML, and its registerSW.js uses a page-relative
				// ./sw.js that breaks on nested routes. "prompt" (with no prompt UI)
				// means a new worker waits until the app's tabs close, so an open
				// tab never loses the old precached chunks it still lazy-loads
				// (Vercel stops serving them) and never reloads mid-question.
				registerType: "prompt",
				injectRegister: false,
				strategies: "generateSW",
				manifest: {
					name: "Is this a Roman Road?",
					short_name: "RomanRoad?",
					description:
						"A small oracle for the road ahead. Find out if you stand on (or near) a Roman road.",
					theme_color: "#a24b36",
					background_color: "#efe4cd",
					display: "standalone",
					start_url: "/",
					scope: "/",
					icons: [
						{
							src: "/icons/icon-192.png",
							sizes: "192x192",
							type: "image/png",
							purpose: "any maskable",
						},
						{
							src: "/icons/icon-512.png",
							sizes: "512x512",
							type: "image/png",
							purpose: "any maskable",
						},
					],
				},
				generateSW: {
					globPatterns: [
						"client/**/*.{js,mjs,css,html,svg,png,webp,woff2}",
						"prerendered/**/*.html",
					],
					// Worldwide road names span the `latin` + `latin-ext` subsets
					// (ž, ć, š, ğ, ș, ț, … across Central/Eastern Europe, Turkey and
					// the Balkans), so both are precached. The dataset has no Greek,
					// Cyrillic or Vietnamese glyphs — verified via
					// `grep -oP '[^\x00-\x7F]' static/roads/cells/*.json | sort -u` —
					// so those subsets stay excluded to save precache storage.
					// No SPA fallback. The plugin defaults it to the homepage, which
					// would answer every non-precached navigation (/roads/<country>,
					// sitemap.xml, …) with the home page, online included. Precached
					// pages still match navigations directly.
					navigateFallback: null,
					// Take control on first install so that visit's road cells and
					// tiles are cached too. Updates still wait (see registerType).
					clientsClaim: true,
					globIgnores: [
						// Per-page Open Graph cards: fetched only by crawlers and social
						// scrapers, never by the app. ~53 files at ~80 KB each would add
						// over 4 MB to every visitor's precache for no benefit.
						"**/og/*.png",

						// Country and county landing pages. They inline a whole area's
						// simplified road geometry — Turkey alone is 364 KB — and exist to
						// be crawled, not used offline. Neither pattern matches
						// pages/roads.html, the hub, which stays precached.
						"prerendered/pages/roads/*.html",
						"prerendered/pages/roads/britain/*.html",
						"**/cormorant-garamond-cyrillic-*.woff2",
						"**/cormorant-garamond-vietnamese-*.woff2",
						"**/inter-cyrillic*.woff2",
						"**/inter-greek*.woff2",
						"**/inter-vietnamese*.woff2",
					],
					runtimeCaching: [
						{
							// The partitioned road data: manifest.json, road-cells.json
							// and the lazily-fetched per-location cell files. Cached so
							// once a region is loaded the answer works offline. The URLs
							// carry no build hash, so StaleWhileRevalidate rather than
							// CacheFirst: a data rebuild reaches users on their next
							// lookup. Exact files only, so the /roads/<country> pages and
							// their __data.json stay out. maxEntries caps retained cells.
							// (String checks, not a regex: the SW generator can't serialise
							// regex literals inside urlPattern.)
							urlPattern: ({ url }) =>
								url.pathname === "/roads/manifest.json" ||
								url.pathname === "/roads/road-cells.json" ||
								(url.pathname.startsWith("/roads/cells/") && url.pathname.endsWith(".json")),
							handler: "StaleWhileRevalidate",
							options: {
								cacheName: "roads-data",
								expiration: {
									maxEntries: 300,
									maxAgeSeconds: 60 * 60 * 24 * 30,
									purgeOnQuotaError: true,
								},
							},
						},
						{
							// The TileJSON index points at dated tile paths that OpenFreeMap
							// retires, so prefer a fresh copy; the cache covers offline.
							urlPattern: ({ url }) =>
								url.hostname === "tiles.openfreemap.org" && url.pathname === "/planet",
							handler: "NetworkFirst",
							options: {
								cacheName: "map-index",
								networkTimeoutSeconds: 3,
								expiration: { maxEntries: 2, purgeOnQuotaError: true },
							},
						},
						{
							urlPattern: ({ url }) => url.hostname === "tiles.openfreemap.org",
							handler: "StaleWhileRevalidate",
							options: {
								cacheName: "map-tiles",
								expiration: {
									maxEntries: 500,
									maxAgeSeconds: 60 * 60 * 24 * 30,
									purgeOnQuotaError: true,
								},
							},
						},
						{
							urlPattern: ({ url }) => url.hostname === "nominatim.openstreetmap.org",
							handler: "NetworkFirst",
							options: {
								cacheName: "geocode",
								expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
							},
						},
					],
				},
				devOptions: {
					enabled: false,
				},
			},
		),
	],
	build: {
		target: "es2022",
	},
});
