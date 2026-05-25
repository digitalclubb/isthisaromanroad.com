import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: "autoUpdate",
			injectRegister: "auto",
			strategies: "generateSW",
			manifest: {
				name: "Is this a Roman Road?",
				short_name: "RomanRoad?",
				description:
					"A small oracle for the road ahead. Find out if you stand on (or near) a Roman road in Britain.",
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
			workbox: {
				globPatterns: ["client/**/*.{js,css,html,svg,png,webp,woff2}", "prerendered/**/*.html"],
				// Site is UK-only. The road dataset's non-ASCII content is just
				// `é` (Latin-1, in the `latin` subset) and a smart quote (general
				// punctuation, always in latin). No Welsh ŵ, no Gaelic accents.
				// Verified via `grep -oE '[^\x00-\x7F]+' static/roads.geojson`.
				// Skipping the other subsets saves ~260 KiB of precache storage.
				globIgnores: [
					"**/cormorant-garamond-cyrillic-*.woff2",
					"**/cormorant-garamond-vietnamese-*.woff2",
					"**/cormorant-garamond-latin-ext-*.woff2",
					"**/inter-cyrillic*.woff2",
					"**/inter-greek*.woff2",
					"**/inter-vietnamese*.woff2",
					"**/inter-latin-ext-*.woff2",
				],
				runtimeCaching: [
					{
						urlPattern: ({ url }) => url.pathname === "/roads.geojson",
						handler: "CacheFirst",
						options: {
							cacheName: "roads-data",
							expiration: {
								maxEntries: 1,
								maxAgeSeconds: 60 * 60 * 24 * 30,
							},
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
		}),
	],
	build: {
		target: "es2022",
	},
});
