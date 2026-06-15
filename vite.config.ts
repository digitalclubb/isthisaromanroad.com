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
			workbox: {
				globPatterns: ["client/**/*.{js,css,html,svg,png,webp,woff2}", "prerendered/**/*.html"],
				// Worldwide road names span the `latin` + `latin-ext` subsets
				// (ž, ć, š, ğ, ș, ț, … across Central/Eastern Europe, Turkey and
				// the Balkans), so both are precached. The dataset has no Greek,
				// Cyrillic or Vietnamese glyphs — verified via
				// `grep -oP '[^\x00-\x7F]' static/roads/cells/*.json | sort -u` —
				// so those subsets stay excluded to save precache storage.
				globIgnores: [
					"**/cormorant-garamond-cyrillic-*.woff2",
					"**/cormorant-garamond-vietnamese-*.woff2",
					"**/inter-cyrillic*.woff2",
					"**/inter-greek*.woff2",
					"**/inter-vietnamese*.woff2",
				],
				runtimeCaching: [
					{
						// The partitioned road data: manifest.json, road-cells.json
						// and the lazily-fetched per-location cell files. CacheFirst so
						// once a region is loaded the answer works offline. maxEntries
						// caps how many cells we retain (the data is immutable per
						// build, so staleness isn't a concern within the 30-day window).
						urlPattern: ({ url }) => url.pathname.startsWith("/roads/"),
						handler: "CacheFirst",
						options: {
							cacheName: "roads-data",
							expiration: {
								maxEntries: 300,
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
