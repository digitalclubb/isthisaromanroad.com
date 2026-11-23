<script lang="ts">
import "../app.css";

// Preload the three latin webfonts we actually paint with. Vite rewrites
// the `?url` imports to content-hashed asset paths matching the URLs the
// `@font-face` rules from Fontsource will request — so the browser fetches
// in parallel with the CSS instead of waiting for CSS parse to discover
// the @font-face. Eliminates the FOUT (parchment momentarily set in
// Georgia + system sans) that swap+no-preload would otherwise show.
import cormorant500i from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2?url";
import cormorant700 from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2?url";
import interWght from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import { onMount } from "svelte";
import { afterNavigate } from "$app/navigation";

const { children } = $props();

// Vercel Analytics. The package's SvelteKit entry imports `$app/stores`,
// which Kit 3 removed, so this replicates it on the generic entry:
// inject() with auto-tracking off, then one pageview per navigation with
// the route id. Dynamically imported on mount so the library doesn't land
// in the initial JS bundle. `mode: "auto"` reads process.env.NODE_ENV
// (Vite replaces it at build time): vite dev → console-debug, production
// build → real beacons via Vercel's edge-proxied /_vercel/insights/*.
let analytics: Promise<typeof import("@vercel/analytics")> | undefined;
onMount(() => {
	analytics = import("@vercel/analytics").then((m) => {
		m.inject(
			{
				mode: "auto",
				framework: "sveltekit",
				disableAutoTrack: true,
				basePath: import.meta.env.VITE_VERCEL_OBSERVABILITY_BASEPATH,
			},
			import.meta.env.VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG,
		);
		return m;
	});
});
afterNavigate(({ to }) => {
	const route = to?.route.id;
	if (route) analytics?.then((m) => m.pageview({ route, path: to.url.pathname }));
});
// The PWA service worker (see vite.config.ts for why this isn't injected).
// Absolute path so nested routes register the root-scoped worker. Not built
// in dev, so production only. Updates install in the background and wait;
// a waiting worker is only activated while the app is hidden, and the page
// then reloads before it's seen again, so an answer is never interrupted
// (an answer left open is lost, once per update).
// ponytail: activation covers every tab, so a second, visible tab can lose
// old lazy chunks before its deferred reload. Fix in the worker (skipWaiting
// only when all clients are hidden) if multi-tab use ever matters.
onMount(() => {
	if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
	const sw = navigator.serviceWorker;
	sw.register("/sw.js")
		.then((reg) => {
			// A worker already active means any controllerchange is an update,
			// even after a shift-reload left this page uncontrolled.
			if (reg.active) hadController = true;
			document.addEventListener("visibilitychange", () => {
				if (document.hidden) reg.waiting?.postMessage({ type: "SKIP_WAITING" });
			});
		})
		.catch(() => {});
	// First install claims the page (clientsClaim): nothing to reload.
	let hadController = Boolean(sw.controller);
	sw.addEventListener("controllerchange", () => {
		if (!hadController) {
			hadController = true;
			return;
		}
		if (document.hidden) location.reload();
		else document.addEventListener("visibilitychange", () => location.reload(), { once: true });
	});
});
</script>

<svelte:head>
	<link rel="preload" href={cormorant700} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={cormorant500i} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={interWght} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{@render children()}
