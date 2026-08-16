<script lang="ts">
/**
 * Disclosure list of question and answer pairs.
 *
 * Callers must build their FAQPage JSON-LD from the same array they pass here
 * — Google treats structured FAQ data that doesn't match the visible text as a
 * violation, and one source for both makes that impossible.
 */
export type FaqItem = { q: string; a: string };

type Props = { items: FaqItem[] };
let { items }: Props = $props();
</script>

<div class="faq">
	{#each items as item (item.q)}
		<details>
			<summary>{item.q}</summary>
			<p>{item.a}</p>
		</details>
	{/each}
</div>

<style>
	.faq {
		margin-top: clamp(1rem, 3vh, 1.4rem);
		max-width: 62ch;
		border-top: 1px solid color-mix(in srgb, var(--gold) 38%, transparent);
	}
	details {
		border-bottom: 1px solid color-mix(in srgb, var(--gold) 38%, transparent);
	}
	summary {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.15rem;
		color: var(--ink);
		cursor: pointer;
		list-style: none;
		padding: 1rem 2rem 1rem 0;
		min-height: 44px;
		display: flex;
		align-items: center;
		position: relative;
		transition: color 200ms var(--ease);
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary::after {
		content: "+";
		position: absolute;
		right: 0.25rem;
		font-size: 1.3rem;
		line-height: 1;
		color: var(--gold);
		transition: transform 240ms var(--ease);
	}
	details[open] summary::after {
		transform: rotate(45deg);
	}
	summary:hover {
		color: var(--brand);
	}
	details p {
		margin: 0;
		padding: 0 0 1.1rem;
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--ink);
	}
</style>
