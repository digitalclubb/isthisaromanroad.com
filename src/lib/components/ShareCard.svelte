<script lang="ts">
import { type AnswerTier, bearingToWords, formatDistance, roadDisplayName } from "$lib/format.js";
import type { RoadFeature } from "$lib/roads.js";
import type { LookupResult } from "$lib/roads.js";
import { PALETTE } from "$lib/theme.js";

type Props = {
	result: LookupResult;
	tier: AnswerTier;
	roadSegments: RoadFeature[];
	userPoint: [number, number] | null;
};
let { result, tier, roadSegments, userPoint }: Props = $props();

const CARD_W = 1200;
const CARD_H = 630;
const SKETCH_W = 480;
const SKETCH_H = 280;

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
		width: ${CARD_W}px;
		height: ${CARD_H}px;
	`;

const name = $derived(roadDisplayName(result.road));
const dist = $derived(formatDistance(result.distanceMeters));
const dir = $derived(bearingToWords(result.bearingFromUser));
const word = $derived(
	tier === "out"
		? "Out of reach."
		: tier === "walking" || tier === "on"
			? "Yes."
			: tier === "close"
				? "Nearly."
				: "Probably not.",
);
const subPrefix = $derived(
	tier === "out"
		? "The nearest known line is"
		: tier === "walking"
			? "And you're walking the line of"
			: tier === "on"
				? "You stand on the line of"
				: tier === "close"
					? "Close to"
					: "The nearest is",
);
// Closing punctuation: tiers that show distance get a comma so the sub-line
// can continue with "..., 320m east of here."; tiers that don't (walking/on)
// end with a full stop after the road name.
const showsDistance = $derived(tier === "out" || tier === "close" || tier === "far");

const coords = $derived(userPoint ? `${formatLat(userPoint[1])} · ${formatLng(userPoint[0])}` : "");

function formatLat(lat: number) {
	const h = lat >= 0 ? "N" : "S";
	return `${Math.abs(lat).toFixed(4)}° ${h}`;
}
function formatLng(lng: number) {
	const h = lng >= 0 ? "E" : "W";
	return `${Math.abs(lng).toFixed(4)}° ${h}`;
}

// Project the full road (every segment that shares its name) plus the user
// point into the share-card SVG. One pass: compute the bbox of all coords
// across all segments + user point, fit to the sketch viewport, project,
// then emit one SVG path with multiple sub-paths (one M per segment).
const pathD = $derived(buildPath(roadSegments, userPoint, SKETCH_W, SKETCH_H));
const pointMarker = $derived(
	userPoint ? projectPoint(roadSegments, userPoint, SKETCH_W, SKETCH_H) : null,
);

function gatherLines(segments: RoadFeature[]): number[][][] {
	const lines: number[][][] = [];
	for (const seg of segments) {
		const g = seg.geometry;
		if (g.type === "LineString") {
			lines.push(g.coordinates as number[][]);
		} else if (g.type === "MultiLineString") {
			for (const line of g.coordinates) lines.push(line as number[][]);
		}
	}
	return lines;
}

function bboxOf(lines: number[][][], extra: [number, number] | null) {
	const flat = lines.flat();
	if (extra) flat.push(extra);
	let minLng = Number.POSITIVE_INFINITY;
	let maxLng = Number.NEGATIVE_INFINITY;
	let minLat = Number.POSITIVE_INFINITY;
	let maxLat = Number.NEGATIVE_INFINITY;
	for (const [lng, lat] of flat) {
		if (lng < minLng) minLng = lng;
		if (lng > maxLng) maxLng = lng;
		if (lat < minLat) minLat = lat;
		if (lat > maxLat) maxLat = lat;
	}
	return { minLng, maxLng, minLat, maxLat };
}

function projector(
	bbox: { minLng: number; maxLng: number; minLat: number; maxLat: number },
	sketchW: number,
	sketchH: number,
) {
	const pad = 30;
	const dLng = Math.max(bbox.maxLng - bbox.minLng, 0.001);
	const dLat = Math.max(bbox.maxLat - bbox.minLat, 0.001);
	const s = Math.min((sketchW - 2 * pad) / dLng, (sketchH - 2 * pad) / dLat);
	const offX = (sketchW - dLng * s) / 2;
	const offY = (sketchH - dLat * s) / 2;
	return (lng: number, lat: number): [number, number] => [
		offX + (lng - bbox.minLng) * s,
		offY + (bbox.maxLat - lat) * s,
	];
}

function buildPath(
	segments: RoadFeature[],
	user: [number, number] | null,
	sketchW: number,
	sketchH: number,
) {
	const lines = gatherLines(segments);
	if (lines.length === 0) return "";
	const project = projector(bboxOf(lines, user), sketchW, sketchH);

	const parts: string[] = [];
	for (const line of lines) {
		if (line.length === 0) continue;
		const pts = line.map(([lng, lat]) => project(lng, lat));
		parts.push(`M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`);
		for (let i = 1; i < pts.length; i++) {
			parts.push(`L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`);
		}
	}
	return parts.join(" ");
}

function projectPoint(
	segments: RoadFeature[],
	user: [number, number],
	sketchW: number,
	sketchH: number,
): [number, number] | null {
	const lines = gatherLines(segments);
	if (lines.length === 0) return null;
	const project = projector(bboxOf(lines, user), sketchW, sketchH);
	return project(user[0], user[1]);
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
			<em class="roman">{name ?? "an unnamed Roman road"}</em>{#if showsDistance}, {dist} {dir}.{:else}.{/if}
		</p>

		<svg
			class="sketch"
			viewBox="0 0 {SKETCH_W} {SKETCH_H}"
			preserveAspectRatio="xMidYMid meet"
			aria-hidden="true"
		>
			<path
				d={pathD}
				stroke={p.brand}
				stroke-width="3"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			{#if pointMarker}
				<!-- Dark ink fill with gold ring matches the live map's
				     point-on-road treatment for visual consistency. -->
				<circle cx={pointMarker[0]} cy={pointMarker[1]} r="9" fill={p.gold} opacity="0.35" />
				<circle
					cx={pointMarker[0]}
					cy={pointMarker[1]}
					r="5"
					fill={p.ink}
					stroke={p.gold}
					stroke-width="2"
				/>
			{/if}
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
	.row.top {
		display: flex;
		align-items: center;
		gap: 16px;
		grid-column: 1 / -1;
	}
	.rule {
		width: 64px;
		height: 4px;
		background: linear-gradient(90deg, var(--p-gold), var(--p-gold-soft));
		border-radius: 2px;
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
		max-width: 18ch;
		color: var(--p-ink-soft);
		margin: 0;
	}
	.roman {
		font-style: italic;
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
