<script lang="ts">
import "../app.css";

// Preload the three latin webfonts we actually paint with. Vite rewrites
// the `?url` imports to content-hashed asset paths matching the URLs the
// `@font-face` rules from Fontsource will request — so the browser fetches
// in parallel with the CSS instead of waiting for CSS parse to discover
// the @font-face. Eliminates the FOUT (parchment momentarily set in
// Georgia + system sans) that swap+no-preload would otherwise show.
import interWght from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import cormorant500i from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2?url";
import cormorant700 from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2?url";
import { onMount } from "svelte";

const { children } = $props();

// Vercel Analytics via the SvelteKit-specific entry. Dynamically
// imported on mount so the library doesn't land in the initial JS
// bundle. `mode: "auto"` reads process.env.NODE_ENV (Vite replaces it
// at build time): vite dev → console-debug, production build → real
// beacons via Vercel's edge-proxied /_vercel/insights/* endpoints.
onMount(() => {
	(async () => {
		const { injectAnalytics } = await import("@vercel/analytics/sveltekit");
		injectAnalytics({ mode: "auto" });
	})();
});
</script>

<svelte:head>
	<link rel="preload" href={cormorant700} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={cormorant500i} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={interWght} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{@render children()}
