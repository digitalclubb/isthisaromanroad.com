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
	.crumbs {
		margin-top: 0.35rem;
		font-family: var(--font-body);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--ink-soft);
	}
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}
	li {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
	a {
		color: inherit;
		text-decoration: none;
		position: relative;
		transition: color 200ms var(--ease);
	}
	/* At 0.7rem the text box is ~14px tall. Rather than pad the link (which
	   would stretch the header), expand the hit area with a pseudo-element to
	   clear the project's 44px floor without moving anything. */
	a::after {
		content: "";
		position: absolute;
		inset: -15px -6px;
	}
	a:hover {
		color: var(--ink);
	}
	.sep {
		color: var(--gold);
	}
</style>
