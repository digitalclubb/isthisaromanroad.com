<script lang="ts">
import { roadDisplayName } from "$lib/format.js";
import type { LookupResult } from "$lib/roads.js";
import { PALETTE } from "$lib/theme.js";

type Props = {
	result: LookupResult;
	onRoad: boolean;
	veryClose: boolean;
	userPoint: [number, number] | null;
};
let { result, onRoad, veryClose, userPoint }: Props = $props();

const W = 1200;
const H = 630;

// The share card always renders in parchment, regardless of the user's
// system theme — atmospheric on social regardless of where it's posted.
const p = PALETTE.parchment;
const cardStyle = `
		--p-bg: ${p.bg};
		--p-ink: ${p.ink};
		--p-ink-soft: ${p.inkSoft};
		--p-brand: ${p.brand};
		--p-brand-deep: ${p.brandDeep};
		--p-gold: ${p.gold};
		--p-gold-soft: ${p.goldSoft};
		--p-surface-deep: ${p.surfaceDeep};
		width: ${W}px;
		height: ${H}px;
	`;

const tooFar = $derived(result.distanceMeters > 50_000);
const name = $derived(roadDisplayName(result.road));
const word = $derived(
	tooFar ? "Out of reach." : onRoad && veryClose ? "Yes." : onRoad ? "Yes." : "Probably not.",
);
const subPrefix = $derived(
	tooFar
		? "The nearest known line is"
		: onRoad && veryClose
			? "And you're walking it —"
			: onRoad
				? "You stand on the line of"
				: "The nearest is",
);

const coords = $derived(userPoint ? `${formatLat(userPoint[1])} · ${formatLng(userPoint[0])}` : "");

function formatLat(lat: number) {
	const h = lat >= 0 ? "N" : "S";
	return `${Math.abs(lat).toFixed(4)}° ${h}`;
}
function formatLng(lng: number) {
	const h = lng >= 0 ? "E" : "W";
	return `${Math.abs(lng).toFixed(4)}° ${h}`;
}

// Project the road's LineString (or MultiLineString) into the share-card
// SVG so we have a small "this is the road we mean" sketch in the corner.
const pathD = $derived(buildPath(result));

function buildPath(r: LookupResult) {
	const g = r.road.geometry;
	if (g.type !== "LineString" && g.type !== "MultiLineString") return "";
	const lines: number[][][] =
		g.type === "LineString" ? [g.coordinates as number[][]] : (g.coordinates as number[][][]);

	const all = lines.flat();
	if (userPoint) all.push(userPoint);
	let minLng = Number.POSITIVE_INFINITY;
	let maxLng = Number.NEGATIVE_INFINITY;
	let minLat = Number.POSITIVE_INFINITY;
	let maxLat = Number.NEGATIVE_INFINITY;
	for (const [lng, lat] of all) {
		if (lng < minLng) minLng = lng;
		if (lng > maxLng) maxLng = lng;
		if (lat < minLat) minLat = lat;
		if (lat > maxLat) maxLat = lat;
	}
	const sketchW = 480;
	const sketchH = 280;
	const pad = 30;
	const dLng = Math.max(maxLng - minLng, 0.001);
	const dLat = Math.max(maxLat - minLat, 0.001);
	const s = Math.min((sketchW - 2 * pad) / dLng, (sketchH - 2 * pad) / dLat);
	const offX = (sketchW - dLng * s) / 2;
	const offY = (sketchH - dLat * s) / 2;

	const project = (lng: number, lat: number): [number, number] => [
		offX + (lng - minLng) * s,
		offY + (maxLat - lat) * s,
	];

	const parts: string[] = [];
	for (const line of lines) {
		const pts = line.map(([lng, lat]) => project(lng, lat));
		if (pts.length === 0) continue;
		parts.push(`M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`);
		for (let i = 1; i < pts.length; i++) {
			parts.push(`L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`);
		}
	}
	return parts.join(" ");
}
</script>

<div class="card" style={cardStyle}>
	<div class="frame">
		<div class="row top">
			<div class="rule"></div>
			<span class="eyebrow">VIA ROMANA</span>
		</div>

		<p class="word">{word}</p>
		<div class="rule-big"></div>
		<p class="sub">
			{subPrefix}
			<em class="roman">{name ?? "an unnamed Roman road"}</em>.
		</p>

		<svg class="sketch" viewBox="0 0 480 280" aria-hidden="true">
			<path
				d={pathD}
				stroke={p.brand}
				stroke-width="3"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>

		<div class="footer">
			{#if coords}<span class="coords">{coords}</span>{/if}
			<span class="url">isthisaromanroad.com</span>
		</div>
	</div>
</div>

<style>
	.card {
		background: var(--p-bg);
		color: var(--p-ink);
		font-family: var(--font-display);
		font-feature-settings: "kern", "liga", "onum";
		position: relative;
		overflow: hidden;
	}
	.frame {
		position: absolute;
		inset: 60px;
		display: grid;
		grid-template-columns: 1fr 480px;
		grid-template-rows: auto 1fr auto;
		gap: 24px 60px;
		align-items: start;
	}
	.row.top {
		grid-column: 1 / -1;
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.rule {
		width: 64px;
		height: 4px;
		background: linear-gradient(90deg, var(--p-gold), var(--p-gold-soft));
		border-radius: 2px;
	}
	.eyebrow {
		font-family: var(--font-display);
		font-style: italic;
		font-size: 28px;
		letter-spacing: 8px;
		color: var(--p-brand-deep);
	}
	.word {
		grid-column: 1;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 160px;
		line-height: 0.95;
		letter-spacing: -0.04em;
		color: var(--p-ink);
		margin: 0;
		align-self: end;
	}
	.rule-big {
		grid-column: 1;
		width: 80px;
		height: 4px;
		background: linear-gradient(90deg, var(--p-gold), var(--p-gold-soft));
		border-radius: 2px;
	}
	.sub {
		grid-column: 1;
		font-family: var(--font-display);
		font-style: italic;
		font-size: 34px;
		line-height: 1.35;
		color: var(--p-ink-soft);
		margin: 0;
		max-width: 18ch;
	}
	.roman {
		font-style: italic;
		/* See Answer.svelte — explicit smcp via font-feature-settings would
		   block browser synthesis since Cormorant Garamond doesn't ship the
		   small-caps feature. font-variant-caps alone lets synthesis run. */
		font-variant-caps: small-caps;
		color: var(--p-ink);
		font-weight: 500;
		letter-spacing: 0.04em;
		border-bottom: 2px solid var(--p-gold);
		padding-bottom: 2px;
		white-space: nowrap;
	}
	.sketch {
		grid-column: 2;
		grid-row: 2 / 4;
		width: 480px;
		height: 280px;
		align-self: end;
	}
	.footer {
		grid-column: 1 / -1;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-family: var(--font-body);
		font-size: 22px;
		letter-spacing: 3px;
		text-transform: uppercase;
		color: var(--p-ink-soft);
		border-top: 1px solid var(--p-surface-deep);
		padding-top: 18px;
	}
	.coords {
		font-variant-numeric: oldstyle-nums tabular-nums;
	}
</style>
