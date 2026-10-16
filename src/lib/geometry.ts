/**
 * Small geometry helpers over the Itiner-e road features.
 *
 * Deliberately dependency-free haversine maths rather than another Turf
 * import: these run at build time over the whole 14,769-feature set for the
 * /roads hub and the 22 road pages, where Turf's per-call Feature wrapping is
 * pure overhead. Accuracy is ample — we render "≈ 380 km", not survey data.
 */
import type { Position } from "geojson";
import type { RoadFeature } from "./roads.js";

const EARTH_RADIUS_M = 6_371_008.8;

function toRadians(deg: number): number {
	return (deg * Math.PI) / 180;
}

/** Great-circle distance between two [lng, lat] positions, in metres. */
export function haversineMeters(a: Position, b: Position): number {
	const lat1 = toRadians(a[1]);
	const lat2 = toRadians(b[1]);
	const dLat = lat2 - lat1;
	const dLng = toRadians(b[0] - a[0]);
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
	return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Every constituent line of a feature, whether LineString or MultiLineString. */
export function linesOf(road: RoadFeature): Position[][] {
	const g = road.geometry;
	return g.type === "LineString" ? [g.coordinates] : g.coordinates;
}

/** Total surveyed length of one feature, in metres. */
export function featureLengthMeters(road: RoadFeature): number {
	let total = 0;
	for (const line of linesOf(road)) {
		for (let i = 0; i < line.length - 1; i++) {
			total += haversineMeters(line[i], line[i + 1]);
		}
	}
	return total;
}

/** Combined length of a set of segments, in metres. Zero for an empty set. */
export function totalLengthMeters(roads: RoadFeature[]): number {
	return roads.reduce((sum, r) => sum + featureLengthMeters(r), 0);
}

/**
 * Combined length in kilometres, rounded to the nearest 10 km above 100 km and
 * the nearest km below — the dataset's segments are reconstructions with gaps,
 * so a figure to the metre would imply a precision that isn't there.
 *
 * Returns null, not 0, for an empty set. Every story matches segments today,
 * but one that stopped matching (a data rebuild, a renamed segment) must not
 * publish "0 km surveyed" as though it were a measurement
 * rather than an absence. Callers must render the null case as missing data.
 */
export function totalLengthKm(roads: RoadFeature[]): number | null {
	if (roads.length === 0) return null;
	const km = totalLengthMeters(roads) / 1000;
	return km >= 100 ? Math.round(km / 10) * 10 : Math.round(km);
}

/**
 * Perpendicular distance from `p` to the segment `a`-`b`, in degrees, with
 * longitude scaled by cos(latitude) so the measure is roughly isotropic. Only
 * used to rank vertices for removal, so an approximation is fine.
 */
function perpendicularDistance(p: Position, a: Position, b: Position): number {
	const k = Math.cos((p[1] * Math.PI) / 180) || 1e-6;
	const px = p[0] * k;
	const ax = a[0] * k;
	const bx = b[0] * k;
	const dx = bx - ax;
	const dy = b[1] - a[1];
	const lenSq = dx * dx + dy * dy;
	if (lenSq === 0) return Math.hypot(px - ax, p[1] - a[1]);
	const t = Math.max(0, Math.min(1, ((px - ax) * dx + (p[1] - a[1]) * dy) / lenSq));
	return Math.hypot(px - (ax + t * dx), p[1] - (a[1] + t * dy));
}

/** Douglas-Peucker, tolerance in degrees. */
function simplifyLine(line: Position[], tolerance: number): Position[] {
	if (line.length <= 2) return line;
	let maxDist = 0;
	let index = 0;
	for (let i = 1; i < line.length - 1; i++) {
		const d = perpendicularDistance(line[i], line[0], line[line.length - 1]);
		if (d > maxDist) {
			maxDist = d;
			index = i;
		}
	}
	if (maxDist <= tolerance) return [line[0], line[line.length - 1]];
	return [
		...simplifyLine(line.slice(0, index + 1), tolerance).slice(0, -1),
		...simplifyLine(line.slice(index), tolerance),
	];
}

/** Geometry-only feature: what Map.svelte actually draws. */
export type OverviewFeature = {
	type: "Feature";
	properties: Record<string, never>;
	geometry: { type: "MultiLineString"; coordinates: Position[][] };
};

/**
 * Strips a set of features down to what a country-scale overview map needs:
 * geometry only, simplified and coordinate-rounded.
 *
 * Prerendering the raw features inlines every vertex and every description,
 * citation and bibliography string into the HTML. For Turkey's 2,028 segments
 * that produced a 4.4 MB page — worse for both users and Core Web Vitals than
 * having no map at all. Map.svelte reads nothing but geometry, so the
 * properties go, and at a whole-country zoom a ~500 m tolerance and 3-decimal
 * coordinates (~110 m) are both well below one screen pixel.
 */
export function toOverviewFeatures(roads: RoadFeature[], toleranceMeters = 500): OverviewFeature[] {
	const tolerance = toleranceMeters / METRES_PER_DEGREE;
	const out: OverviewFeature[] = [];
	for (const road of roads) {
		const coordinates: Position[][] = [];
		for (const line of linesOf(road)) {
			if (line.length < 2) continue;
			const simplified = simplifyLine(line, tolerance).map(
				([lng, lat]) => [round3(lng), round3(lat)] as Position,
			);
			// Count DISTINCT points, not array entries. A line shorter than the
			// rounding grid simplifies to [first, last] and then rounds both to
			// the same coordinate, which would emit a zero-length line MapLibre
			// draws as nothing. 337 of these appeared before this check.
			if (distinctPointCount(simplified) >= 2) coordinates.push(simplified);
		}
		if (coordinates.length > 0) {
			out.push({
				type: "Feature",
				properties: {},
				geometry: { type: "MultiLineString", coordinates },
			});
		}
	}
	return out;
}

const METRES_PER_DEGREE = 111_320;

function distinctPointCount(line: Position[]): number {
	const seen = new Set<string>();
	for (const [lng, lat] of line) seen.add(`${lng},${lat}`);
	return seen.size;
}

function round3(n: number): number {
	return Math.round(n * 1000) / 1000;
}

/**
 * The dataset's own date range across a set of segments, as whole years.
 * Itiner-e uses negative years for BC. Returns null when no segment carries
 * a usable date.
 */
export function dateRangeOf(roads: RoadFeature[]): { from: number; to: number } | null {
	let from = Number.POSITIVE_INFINITY;
	let to = Number.NEGATIVE_INFINITY;
	for (const r of roads) {
		const lower = r.properties.lowerDate;
		const upper = r.properties.upperDate;
		if (typeof lower === "number") from = Math.min(from, lower);
		if (typeof upper === "number") to = Math.max(to, upper);
	}
	if (!Number.isFinite(from) || !Number.isFinite(to)) return null;
	// `from` and `to` can come from different segments, so a set where one
	// feature carries only an upper date and another only a lower can invert.
	// Suppress rather than render "AD 200 – AD 123".
	return from <= to ? { from, to } : null;
}

/** "43 BC" / "AD 410" label. There is no year zero: astronomers' 0 is 1 BC. */
export function formatYear(year: number): string {
	if (year < 0) return `${Math.abs(year)} BC`;
	if (year === 0) return "1 BC";
	return `AD ${year}`;
}

/**
 * The certainty class covering most of a road's length, with that share as a
 * percentage. Weighted by length so a short hypothetical spur doesn't
 * outvote a well-evidenced trunk road the way a segment count would.
 *
 * Note this describes how precisely the *line* is known, not whether the road
 * existed: across the shipped dataset Itiner-e marks 1,040 of 14,769 segments
 * "Certain" against 12,952 "Conjectured", so a bare "% certain" figure would
 * read as doubt about Watling Street itself. Hence the dominant label rather
 * than a lone percentage.
 */
export function dominantCertainty(roads: RoadFeature[]): { label: string; percent: number } | null {
	const byClass = new Map<string, number>();
	let total = 0;
	for (const r of roads) {
		const cls = (r.properties.certainty ?? "").trim();
		if (!cls) continue;
		const len = featureLengthMeters(r);
		total += len;
		byClass.set(cls, (byClass.get(cls) ?? 0) + len);
	}
	if (total === 0) return null;
	let best: [string, number] | null = null;
	for (const entry of byClass) {
		if (!best || entry[1] > best[1]) best = entry;
	}
	return best ? { label: best[0], percent: Math.round((best[1] / total) * 100) } : null;
}
