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
