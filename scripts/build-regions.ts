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
import type { Feature, MultiPolygon, Polygon } from "geojson";
import { type AreaPoly, assignArea, bboxOfRings, ringsOf, slugify } from "./geo-assign.ts";

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

/**
 * Natural Earth carries some de-facto entities as separate polygons. Roman
 * road pages are a geography of antiquity, not a statement about present-day
 * sovereignty, so entities without broad recognition are folded into the
 * country they sit within rather than given a page of their own.
 */
const MERGE_INTO: Record<string, string> = {
	"Northern Cyprus": "Cyprus",
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

async function loadCountries(): Promise<AreaPoly[]> {
	const raw = JSON.parse(await readFile(NE_PATH, "utf8")) as {
		features: Feature<Polygon | MultiPolygon, Record<string, unknown>>[];
	};
	const out: AreaPoly[] = [];
	for (const f of raw.features) {
		const rings = ringsOf(f.geometry);
		if (rings.length === 0) continue;
		// NAME abbreviates ("Bosnia and Herz."); NAME_LONG spells it out, which is
		// what both a page title and a search query want.
		const rawName = String(f.properties.NAME_LONG ?? f.properties.NAME ?? "").trim();
		const name = MERGE_INTO[rawName] ?? rawName;
		if (!name) continue;
		out.push({ name, bbox: bboxOfRings(rings), rings });
	}
	return out;
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
			const country = assignArea(f.geometry, countries);
			if (country) assignment.set(id, country);
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
