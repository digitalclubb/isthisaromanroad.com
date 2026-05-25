<script lang="ts">
import { bearingToWords, formatDistance, roadDisplayName } from "$lib/format.js";
import type { LookupResult } from "$lib/roads.js";
import RuleGold from "./RuleGold.svelte";

type Props = {
	result: LookupResult;
	onRoad: boolean;
	veryClose: boolean;
};
let { result, onRoad, veryClose }: Props = $props();

const tooFar = $derived(result.distanceMeters > 50_000);
const name = $derived(roadDisplayName(result.road));
const dist = $derived(formatDistance(result.distanceMeters));
const dir = $derived(bearingToWords(result.bearingFromUser));
</script>

<div class="answer" aria-live="polite" aria-atomic="true">
	{#if tooFar}
		<h2 class="word">Out of reach.</h2>
		<RuleGold animated />
		<p class="sub">
			The Romans didn't build this far.
			The nearest known line is
			{#if name}
				<em class="roman">{name}</em>,
			{:else}
				an unnamed Roman road,
			{/if}
			{dist} {dir}.
		</p>
	{:else if onRoad && veryClose}
		<h2 class="word">Yes.</h2>
		<RuleGold animated />
		<p class="sub">
			And you're <em class="emph">walking it</em> —
			{#if name}you're on the line of <em class="roman">{name}</em>.{:else}you're on the line of an unnamed Roman road.{/if}
		</p>
	{:else if onRoad}
		<h2 class="word">Yes.</h2>
		<RuleGold animated />
		<p class="sub">
			You stand on the line of
			{#if name}<em class="roman">{name}</em>.{:else}an unnamed Roman road.{/if}
		</p>
	{:else}
		<h2 class="word">Probably not.</h2>
		<RuleGold animated />
		<p class="sub">
			The nearest is
			{#if name}<em class="roman">{name}</em>,{:else}an unnamed Roman road,{/if}
			{dist} {dir}.
		</p>
	{/if}
</div>

<style>
	.answer {
		text-align: left;
		padding: clamp(1rem, 3vh, 1.5rem) 0 0;
	}
	.word {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(4rem, 18vw, 8.5rem);
		line-height: 0.92;
		letter-spacing: -0.04em;
		color: var(--ink);
		margin: 0 0 0.7rem;
		transform-origin: left center;
		animation: inscribe 720ms var(--ease-out) both;
	}
	.sub {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 500;
		font-size: clamp(1.1rem, 3.8vw, 1.4rem);
		line-height: 1.5;
		color: var(--ink-soft);
		margin: 1.1rem 0 0;
		max-width: 32ch;
		animation: fadeUp 700ms var(--ease-out) 600ms both;
	}
	.roman {
		font-style: italic;
		/* Cormorant Garamond doesn't ship the `smcp` feature; leave
		   font-feature-settings off so the browser can synthesize small caps
		   from the loaded glyphs. (Listing "smcp" would *block* synthesis.) */
		font-variant-caps: small-caps;
		font-weight: 500;
		color: var(--ink);
		letter-spacing: 0.04em;
		border-bottom: 1px solid var(--gold);
		padding-bottom: 1px;
		white-space: nowrap;
	}
	.emph {
		font-style: italic;
		color: var(--brand);
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	/*
	 * Inscribe is transform-only (scaleX) — visually approximates the
	 * "settling from looser to tighter" effect of the previous
	 * letter-spacing animation without triggering layout each frame.
	 * scaleX is compositor-only; letter-spacing isn't.
	 */
	@keyframes inscribe {
		from {
			opacity: 0;
			transform: scaleX(1.018);
		}
		to {
			opacity: 1;
			transform: scaleX(1);
		}
	}
</style>
