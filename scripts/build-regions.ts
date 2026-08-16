/**
 * Tags every Itiner-e road segment with the modern country it lies in, so the
 * site can publish a landing page per country ("Roman roads in Italy").
 *
 * The Itiner-e properties carry no country field, so this is derived
 * geometrically: each feature is sampled at several points along its line and
 * assigned to whichever country polygon contains the most samples. Sampling
 * rather than testing a single midpoint keeps a road that clips a border from
 * being filed under the wrong country.
 *
 * Boundaries come from Natural Earth 1:110m Admin 0 (public domain). At that
 * resolution borders are good to roughly a kilometre, which is ample for
 * deciding whether a road is in France or Spain and far cheaper than carrying
 * a high-resolution boundary set through the build.
 *
 * Output: `data/regions.json`, committed to the repo and read at build time by
 * src/lib/server/regions.ts. Deliberately NOT written to `static/` — nothing
 * fetches it at runtime, and putting it there would add it to the PWA
 * precache for no reason.
 *
 * Run with: pnpm data:regions   (needs static/roads/cells to exist already)
 */
import { existsSync, mkdirSync } from "node:fs";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Feature, MultiPolygon, Polygon, Position } from "geojson";

// Pinned to a release tag, not `master`. data/regions.json is a committed
// artefact and the raw download is gitignored, so an unpinned URL would mean a
// rebuild next year silently picks up whatever borders and ISO codes master
// happens to carry that day.
const NE_VERSION = "v5.1.2";
const NE_URL = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/${NE_VERSION}/geojson/ne_110m_admin_0_countries.geojson`;
const NE_PATH = "data/raw/ne_110m_admin_0_countries.geojson";
const CELLS_DIR = "static/roads/cells";
const OUT_PATH = "data/regions.json";

/** Below this many segments a country page would be too thin to be worth publishing. */
const MIN_SEGMENTS = 25;

/** Points sampled along each road before taking the majority country. */
const SAMPLES_PER_FEATURE = 5;

/**
 * Natural Earth carries some de-facto entities as separate polygons. Roman
 * road pages are a geography of antiquity, not a statement about present-day
 * sovereignty, so entities without broad recognition are folded into the
 * country they sit within rather than given a page of their own.
 */
const MERGE_INTO: Record<string, string> = {
	"Northern Cyprus": "Cyprus",
};

type CountryPoly = {
	name: string;
	iso: string;
	bbox: [number, number, number, number];
	rings: Position[][][];
};

async function downloadBoundaries(): Promise<void> {
	if (existsSync(NE_PATH)) {
		const s = await stat(NE_PATH);
		console.log(`Cached boundaries at ${NE_PATH} (${(s.size / 1e6).toFixed(1)} MB)`);
		return;
	}
	mkdirSync("data/raw", { recursive: true });
	console.log("Downloading Natural Earth 110m country boundaries…");
	const res = await fetch(NE_URL);
	if (!res.ok) throw new Error(`Boundary download failed: ${res.status} ${res.statusText}`);
	await writeFile(NE_PATH, await res.text());
}

function bboxOfRings(rings: Position[][][]): [number, number, number, number] {
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

async function loadCountries(): Promise<CountryPoly[]> {
	const raw = JSON.parse(await readFile(NE_PATH, "utf8")) as {
		features: Feature<Polygon | MultiPolygon, Record<string, unknown>>[];
	};
	const out: CountryPoly[] = [];
	for (const f of raw.features) {
		const g = f.geometry;
		if (!g) continue;
		const rings: Position[][][] =
			g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
		if (rings.length === 0) continue;
		// NAME abbreviates ("Bosnia and Herz."); NAME_LONG spells it out, which is
		// what both a page title and a search query want.
		const rawName = String(f.properties.NAME_LONG ?? f.properties.NAME ?? "").trim();
		const name = MERGE_INTO[rawName] ?? rawName;
		const iso = String(f.properties.ISO_A2_EH ?? f.properties.ISO_A2 ?? "").trim();
		if (!name) continue;
		out.push({ name, iso, bbox: bboxOfRings(rings), rings });
	}
	return out;
}

/** Ray-casting point-in-ring test. `ring` is a closed linear ring. */
function pointInRing(x: number, y: number, ring: Position[]): boolean {
	let inside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const [xi, yi] = ring[i];
		const [xj, yj] = ring[j];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}

/** Inside the outer ring of any polygon and outside all of that polygon's holes. */
function pointInCountry(x: number, y: number, c: CountryPoly): boolean {
	const [minX, minY, maxX, maxY] = c.bbox;
	if (x < minX || x > maxX || y < minY || y > maxY) return false;
	for (const poly of c.rings) {
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
function samplePoints(geometry: { type: string; coordinates: unknown }): Position[] {
	const lines: Position[][] =
		geometry.type === "LineString"
			? [geometry.coordinates as Position[]]
			: (geometry.coordinates as Position[][]);
	const all: Position[] = [];
	for (const line of lines) all.push(...line);
	if (all.length === 0) return [];
	if (all.length <= 2 || SAMPLES_PER_FEATURE <= 1) return all.slice(0, SAMPLES_PER_FEATURE);

	// Cumulative distance to each vertex.
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

const EARTH_RADIUS_M = 6_371_008.8;

/** Great-circle distance in metres. Mirrors src/lib/geometry.ts. */
function haversineMeters(a: Position, b: Position): number {
	const toRad = (d: number) => (d * Math.PI) / 180;
	const lat1 = toRad(a[1]);
	const lat2 = toRad(b[1]);
	const h =
		Math.sin((lat2 - lat1) / 2) ** 2 +
		Math.cos(lat1) * Math.cos(lat2) * Math.sin(toRad(b[0] - a[0]) / 2) ** 2;
	return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
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

async function main() {
	await downloadBoundaries();
	const countries = await loadCountries();
	console.log(`Loaded ${countries.length} country polygons.`);

	const dir = resolve(CELLS_DIR);
	if (!existsSync(dir)) {
		throw new Error(`${CELLS_DIR} not found. Run pnpm data:build first.`);
	}
	const files = (await readdir(dir)).filter((f) => f.endsWith(".json"));

	// Dedupe by id: a feature spanning a cell boundary appears in several files.
	const assignment = new Map<string, string>();
	let scanned = 0;
	let unassigned = 0;

	for (const file of files) {
		const fc = JSON.parse(await readFile(resolve(dir, file), "utf8")) as {
			features: { id?: string | number; geometry: { type: string; coordinates: unknown } }[];
		};
		for (const f of fc.features) {
			const id = String(f.id ?? "");
			if (!id || assignment.has(id)) continue;
			scanned++;
			const votes = new Map<string, number>();
			for (const [x, y] of samplePoints(f.geometry)) {
				for (const c of countries) {
					if (pointInCountry(x, y, c)) {
						votes.set(c.name, (votes.get(c.name) ?? 0) + 1);
						break;
					}
				}
			}
			let best: [string, number] | null = null;
			for (const v of votes) if (!best || v[1] > best[1]) best = v;
			if (best) assignment.set(id, best[0]);
			else unassigned++;
		}
	}

	console.log(
		`Assigned ${assignment.size} of ${scanned} features (${unassigned} off-shore/unmatched).`,
	);

	const byCountry = new Map<string, string[]>();
	for (const [id, name] of assignment) {
		const list = byCountry.get(name);
		if (list) list.push(id);
		else byCountry.set(name, [id]);
	}

	const regions = [...byCountry.entries()]
		.filter(([, ids]) => ids.length >= MIN_SEGMENTS)
		.map(([name, ids]) => ({
			slug: slugify(name),
			name,
			featureIds: ids.sort(),
		}))
		.sort((a, b) => b.featureIds.length - a.featureIds.length);

	const dropped = [...byCountry.entries()].filter(([, ids]) => ids.length < MIN_SEGMENTS);

	mkdirSync("data", { recursive: true });
	// Record the boundary version the assignment was derived from, so a future
	// reader can tell what produced these ids.
	await writeFile(OUT_PATH, JSON.stringify({ boundaries: `naturalearth ${NE_VERSION}`, regions }));

	console.log(
		`\nWrote ${OUT_PATH}: ${regions.length} countries above the ${MIN_SEGMENTS}-segment floor.`,
	);
	for (const r of regions.slice(0, 40)) {
		console.log(`  ${r.slug.padEnd(24)} ${String(r.featureIds.length).padStart(6)}`);
	}
	if (dropped.length > 0) {
		console.log(
			`\nBelow the floor, no page generated: ${dropped
				.map(([n, ids]) => `${n} (${ids.length})`)
				.join(", ")}`,
		);
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
