<script lang="ts">
/**
 * Visible breadcrumb trail. Pages must build their BreadcrumbList JSON-LD from
 * the same `items` array via `breadcrumbSchema` — Google's structured-data
 * policy requires the markup to describe the breadcrumb the user actually
 * sees, and one source for both is the only way to stop them drifting.
 */
import type { Crumb } from "$lib/breadcrumbs.js";

type Props = { items: Crumb[] };
let { items }: Props = $props();
</script>

<nav class="crumbs" aria-label="Breadcrumb">
	<ol>
		{#each items as item, i (item.name)}
			<li>
				{#if item.href && i < items.length - 1}
					<a href={item.href}>{item.name}</a>
				{:else}
					<span aria-current="page">{item.name}</span>
				{/if}
				{#if i < items.length - 1}
					<span class="sep" aria-hidden="true">·</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style>
	/* Cut capitals in the serif, tracked wide like an inscription. Inter caps
	   here read as app chrome. */
	.crumbs {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: var(--ink-soft);
		padding-block: 0.2rem;
	}
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		column-gap: 0.5rem;
	}
	li {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
	a {
		color: inherit;
		text-decoration: none;
		transition: color 200ms var(--ease);
		/* A real 44px box rather than a pseudo-element hit area: the trail is
		   the only way home at the top of the page and wraps on a phone, where
		   expanded hit areas on the second row overlapped the first. */
		display: inline-flex;
		align-items: center;
		min-height: 44px;
	}
	a:hover {
		color: var(--ink);
	}
	.sep {
		color: var(--gold);
	}
</style>
