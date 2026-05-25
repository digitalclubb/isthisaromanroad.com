<script lang="ts">
import { type AnswerTier, bearingToWords, formatDistance, roadDisplayName } from "$lib/format.js";
import type { RoadFeature } from "$lib/roads.js";
import type { LookupResult } from "$lib/roads.js";
import { PALETTE } from "$lib/theme.js";

export type ShareVariant = "landscape" | "portrait";

type Props = {
	result: LookupResult;
	tier: AnswerTier;
	roadSegments: RoadFeature[];
	userPoint: [number, number] | null;
	variant?: ShareVariant;
};
let { result, tier, roadSegments, userPoint, variant = "landscape" }: Props = $props();

const dims = $derived(variant === "portrait" ? { w: 1080, h: 1350 } : { w: 1200, h: 630 });

// The share card always renders in parchment, regardless of the user's
// system theme — atmospheric on social regardless of where it's posted.
const p = PALETTE.parchment;
const cardStyle = $derived(`
		--p-bg: ${p.bg};
		--p-ink: ${p.ink};
		--p-ink-soft: ${p.inkSoft};
		--p-brand: ${p.brand};
		--p-brand-deep: ${p.brandDeep};
		--p-gold: ${p.gold};
		--p-gold-soft: ${p.goldSoft};
		--p-surface-deep: ${p.surfaceDeep};
		width: ${dims.w}px;
		height: ${dims.h}px;
	`);

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
const sketchSize = $derived(variant === "portrait" ? { w: 920, h: 420 } : { w: 480, h: 280 });
const pathD = $derived(buildPath(roadSegments, userPoint, sketchSize.w, sketchSize.h));
const pointMarker = $derived(
	userPoint ? projectPoint(roadSegments, userPoint, sketchSize.w, sketchSize.h) : null,
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

<div class="card {variant}" style={cardStyle}>
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
			viewBox="0 0 {sketchSize.w} {sketchSize.h}"
			preserveAspectRatio="xMidYMid meet"
			aria-hidden="true"
		>
			<path
				d={pathD}
				stroke={p.brand}
				stroke-width={variant === "portrait" ? 4 : 3}
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			{#if pointMarker}
				<!-- Dark ink fill with gold ring matches the live map's
				     point-on-road treatment for visual consistency. -->
				<circle
					cx={pointMarker[0]}
					cy={pointMarker[1]}
					r={variant === "portrait" ? 14 : 9}
					fill={p.gold}
					opacity="0.35"
				/>
				<circle
					cx={pointMarker[0]}
					cy={pointMarker[1]}
					r={variant === "portrait" ? 8 : 5}
					fill={p.ink}
					stroke={p.gold}
					stroke-width={variant === "portrait" ? 3 : 2}
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
	.eyebrow {
		font-family: var(--font-display);
		font-style: italic;
		letter-spacing: 8px;
		color: var(--p-brand-deep);
	}
	.word {
		font-family: var(--font-display);
		font-weight: 700;
		line-height: 0.95;
		letter-spacing: -0.04em;
		color: var(--p-ink);
		margin: 0;
	}
	.rule-big {
		width: 80px;
		height: 4px;
		background: linear-gradient(90deg, var(--p-gold), var(--p-gold-soft));
		border-radius: 2px;
	}
	.sub {
		font-family: var(--font-display);
		font-style: italic;
		line-height: 1.35;
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
	.footer {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-family: var(--font-body);
		letter-spacing: 3px;
		text-transform: uppercase;
		color: var(--p-ink-soft);
		border-top: 1px solid var(--p-surface-deep);
		padding-top: 18px;
		grid-column: 1 / -1;
	}
	.coords {
		font-variant-numeric: oldstyle-nums tabular-nums;
	}

	/* Landscape — 1200×630, classic OG / Twitter / FB / LinkedIn */
	.card.landscape .frame {
		position: absolute;
		inset: 60px;
		display: grid;
		grid-template-columns: 1fr 480px;
		grid-template-rows: auto 1fr auto;
		gap: 24px 60px;
		align-items: start;
	}
	.card.landscape .eyebrow {
		font-size: 28px;
	}
	.card.landscape .word {
		grid-column: 1;
		font-size: 160px;
		align-self: end;
	}
	.card.landscape .rule-big {
		grid-column: 1;
	}
	.card.landscape .sub {
		grid-column: 1;
		font-size: 34px;
		max-width: 18ch;
	}
	.card.landscape .sketch {
		grid-column: 2;
		grid-row: 2 / 4;
		width: 480px;
		height: 280px;
		align-self: end;
	}
	.card.landscape .footer {
		font-size: 22px;
	}

	/* Portrait — 1080×1350, Instagram / TikTok / phone wallpaper */
	.card.portrait .frame {
		position: absolute;
		inset: 80px;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto auto auto auto 1fr auto;
		gap: 32px 0;
	}
	.card.portrait .eyebrow {
		font-size: 36px;
		letter-spacing: 12px;
	}
	.card.portrait .word {
		font-size: 200px;
		line-height: 0.92;
	}
	.card.portrait .rule-big {
		width: 120px;
		height: 5px;
	}
	.card.portrait .sub {
		font-size: 48px;
		max-width: 20ch;
		line-height: 1.3;
	}
	.card.portrait .sketch {
		width: 100%;
		height: 100%;
		max-height: 420px;
		align-self: center;
		justify-self: center;
	}
	.card.portrait .footer {
		font-size: 28px;
		letter-spacing: 4px;
		padding-top: 28px;
	}
</style>
