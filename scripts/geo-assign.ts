/**
 * Shared machinery for assigning road segments to an area polygon.
 *
 * Used by build-regions.ts (modern countries, Natural Earth admin_0) and
 * build-counties.ts (historic British counties, Natural Earth admin_1). The
 * two differ only in which boundary set they load and how they name the
 * result, so everything else lives here.
 */
import type { Feature, MultiPolygon, Polygon, Position } from "geojson";

/** Points sampled along each road before taking the majority area. */
export const SAMPLES_PER_FEATURE = 5;

const EARTH_RADIUS_M = 6_371_008.8;

export type AreaPoly = {
	name: string;
	bbox: [number, number, number, number];
	rings: Position[][][];
};

/** Great-circle distance in metres. Mirrors src/lib/geometry.ts. */
export function haversineMeters(a: Position, b: Position): number {
	const toRad = (d: number) => (d * Math.PI) / 180;
	const lat1 = toRad(a[1]);
	const lat2 = toRad(b[1]);
	const h =
		Math.sin((lat2 - lat1) / 2) ** 2 +
		Math.cos(lat1) * Math.cos(lat2) * Math.sin(toRad(b[0] - a[0]) / 2) ** 2;
	return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function bboxOfRings(rings: Position[][][]): [number, number, number, number] {
	let minX = Number.POSITIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;
	for (const poly of rings) {
		for (const [x, y] of poly[0]) {
			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
		}
	}
	return [minX, minY, maxX, maxY];
}

/** Polygon or MultiPolygon coordinates as a uniform list of polygons. */
export function ringsOf(
	geometry: Feature<Polygon | MultiPolygon>["geometry"] | null,
): Position[][][] {
	if (!geometry) return [];
	if (geometry.type === "Polygon") return [geometry.coordinates];
	if (geometry.type === "MultiPolygon") return geometry.coordinates;
	return [];
}

/** Ray-casting point-in-ring test. `ring` is a closed linear ring. */
export function pointInRing(x: number, y: number, ring: Position[]): boolean {
	let inside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const [xi, yi] = ring[i];
		const [xj, yj] = ring[j];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}

/** Inside the outer ring of any polygon and outside all of that polygon's holes. */
export function pointInArea(x: number, y: number, area: AreaPoly): boolean {
	const [minX, minY, maxX, maxY] = area.bbox;
	if (x < minX || x > maxX || y < minY || y > maxY) return false;
	for (const poly of area.rings) {
		if (!pointInRing(x, y, poly[0])) continue;
		let inHole = false;
		for (let h = 1; h < poly.length; h++) {
			if (pointInRing(x, y, poly[h])) {
				inHole = true;
				break;
			}
		}
		if (!inHole) return true;
	}
	return false;
}

/**
 * SAMPLES_PER_FEATURE points spaced evenly along the feature by ARC LENGTH.
 *
 * Sampling by vertex index instead would defeat the purpose. Itiner-e's
 * vertices cluster where a line curves, so index-spaced samples bunch in the
 * wiggly parts and under-sample the long straight runs that are the Roman-road
 * signature — measured over the full dataset, 44% of features had at least one
 * sample displaced by more than 10% of road length, the worst by 68%. Since
 * the whole point is deciding which side of a border a road sits on, the
 * samples have to be where they claim to be.
 */
export function samplePoints(geometry: { type: string; coordinates: unknown }): Position[] {
	const lines: Position[][] =
		geometry.type === "LineString"
			? [geometry.coordinates as Position[]]
			: (geometry.coordinates as Position[][]);
	const all: Position[] = [];
	for (const line of lines) all.push(...line);
	if (all.length === 0) return [];
	if (all.length <= 2 || SAMPLES_PER_FEATURE <= 1) return all.slice(0, SAMPLES_PER_FEATURE);

	const cumulative: number[] = [0];
	for (let i = 1; i < all.length; i++) {
		cumulative.push(cumulative[i - 1] + haversineMeters(all[i - 1], all[i]));
	}
	const total = cumulative[cumulative.length - 1];
	if (total === 0) return [all[0]];

	const out: Position[] = [];
	let cursor = 0;
	for (let i = 0; i < SAMPLES_PER_FEATURE; i++) {
		const target = (i * total) / (SAMPLES_PER_FEATURE - 1);
		while (cursor < cumulative.length - 1 && cumulative[cursor + 1] < target) cursor++;
		const spanStart = cumulative[cursor];
		const spanEnd = cumulative[cursor + 1] ?? spanStart;
		const span = spanEnd - spanStart;
		const t = span > 0 ? (target - spanStart) / span : 0;
		const a = all[cursor];
		const b = all[cursor + 1] ?? a;
		out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
	}
	return out;
}

/** The area holding most of a feature's samples, or null if none match. */
export function assignArea(
	geometry: { type: string; coordinates: unknown },
	areas: AreaPoly[],
): string | null {
	const votes = new Map<string, number>();
	for (const [x, y] of samplePoints(geometry)) {
		for (const area of areas) {
			if (pointInArea(x, y, area)) {
				votes.set(area.name, (votes.get(area.name) ?? 0) + 1);
				break;
			}
		}
	}
	let best: [string, number] | null = null;
	for (const entry of votes) if (!best || entry[1] > best[1]) best = entry;
	return best ? best[0] : null;
}

export function slugify(name: string): string {
	return (
		name
			.toLowerCase()
			.normalize("NFD")
			// Strip the combining diacritical marks NFD just split off, so
			// "Türkiye" slugs to "turkiye" rather than "t-rkiye".
			.replace(/\p{Diacritic}/gu, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "")
	);
}
