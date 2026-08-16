<script lang="ts">
import type { Crumb } from "$lib/breadcrumbs.js";
import Breadcrumbs from "./Breadcrumbs.svelte";

/**
 * Small wordmark link back to the question, with an optional breadcrumb trail
 * beneath. Used by every page except the homepage, which renders the full
 * wordmark as its own hero.
 */
type Props = { crumbs?: Crumb[] };
let { crumbs }: Props = $props();
</script>

<header class="masthead">
	<a class="home" href="/" aria-label="Back to the main question">
		<span class="wordmark">Is this a Roman road?</span>
	</a>
	{#if crumbs && crumbs.length > 0}
		<Breadcrumbs items={crumbs} />
	{/if}
</header>

<style>
	.masthead {
		padding-top: clamp(0.5rem, 3vh, 1.5rem);
	}
	.home {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0 8px;
		margin: 0 -8px;
		text-decoration: none;
	}
	.wordmark {
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ink-soft);
		transition: color 200ms var(--ease);
	}
	.home:hover .wordmark {
		color: var(--ink);
	}
</style>
