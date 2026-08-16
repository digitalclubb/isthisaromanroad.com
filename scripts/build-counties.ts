/**
 * Assigns British road segments to historic counties, so the site can publish
 * "Roman roads in Kent" alongside the country pages.
 *
 * Only the segments already assigned to the United Kingdom by
 * build-regions.ts are considered, so this depends on data/regions.json
 * existing. Boundaries are Natural Earth 1:10m Admin 1 — the 110m set has no
 * subdivisions at all — folded from current local-government areas into
 * historic counties by the table in uk-counties.ts, because nobody searches
 * "Roman roads in Central Bedfordshire".
 *
 * Output: `data/counties.json`, committed. As with regions.json this is NOT
 * written to static/: nothing fetches it at runtime.
 *
 * Run with: pnpm data:counties  (after pnpm data:build and pnpm data:regions)
 */
import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { readFile, readdir, rename, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { Feature, MultiPolygon, Polygon } from "geojson";
import { type AreaPoly, assignArea, bboxOfRings, ringsOf, slugify } from "./geo-assign.ts";
import { countyFor } from "./uk-counties.ts";

// Pinned to a release tag for the same reason as build-regions.ts: the output
// is committed while the download is gitignored, so an unpinned URL would make
// the artefact unreproducible.
const NE_VERSION = "v5.1.2";
const NE_URL = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/${NE_VERSION}/geojson/ne_10m_admin_1_states_provinces.geojson`;
const NE_PATH = "data/raw/ne_10m_admin_1_states_provinces.geojson";
const CELLS_DIR = "static/roads/cells";
const REGIONS_PATH = "data/regions.json";
const OUT_PATH = "data/counties.json";

/**
 * Purely a bound on the size of the committed artefact. The publish decision is
 * editorial and lives in src/lib/server/counties.ts, which requires an authored
 * note naming at least one road with a page on this site — so a county in this
 * file does not necessarily get a page, and the floor should not be tuned to
 * make a particular county qualify.
 */
const MIN_SEGMENTS = 15;

async function downloadBoundaries(): Promise<void> {
	if (existsSync(NE_PATH)) {
		const s = await stat(NE_PATH);
		console.log(`Cached boundaries at ${NE_PATH} (${(s.size / 1e6).toFixed(1)} MB)`);
		return;
	}
	mkdirSync("data/raw", { recursive: true });
	console.log("Downloading Natural Earth 10m admin-1 boundaries (~40 MB)…");
	const res = await fetch(NE_URL);
	if (!res.ok || !res.body) {
		throw new Error(`Boundary download failed: ${res.status} ${res.statusText}`);
	}
	// Stream to a temp path and rename, so an interrupted download is not cached
	// as a complete one by the existsSync check above.
	await pipeline(Readable.fromWeb(res.body as never), createWriteStream(`${NE_PATH}.tmp`));
	await rename(`${NE_PATH}.tmp`, NE_PATH);
}

async function loadCounties(): Promise<AreaPoly[]> {
	const raw = JSON.parse(await readFile(NE_PATH, "utf8")) as {
		features: Feature<Polygon | MultiPolygon, Record<string, unknown>>[];
	};
	// Merge every unit mapping to the same historic county into one area, so a
	// point test doesn't have to be repeated per borough.
	const byCounty = new Map<string, AreaPoly>();
	for (const f of raw.features) {
		const p = f.properties;
		if (p.iso_a2 !== "GB") continue;
		// Northern Ireland was never part of Roman Britain.
		if (p.region === "Northern Ireland") continue;
		const rings = ringsOf(f.geometry);
		if (rings.length === 0) continue;
		const name = countyFor(String(p.name ?? "").trim());
		if (!name) continue;
		const existing = byCounty.get(name);
		if (existing) for (const r of rings) existing.rings.push(r);
		else byCounty.set(name, { name, bbox: [0, 0, 0, 0], rings: [...rings] });
	}
	// bbox only after all a county's polygons are gathered.
	for (const area of byCounty.values()) area.bbox = bboxOfRings(area.rings);
	return [...byCounty.values()];
}

async function main() {
	await downloadBoundaries();
	const counties = await loadCounties();
	console.log(`Loaded ${counties.length} historic counties.`);

	const regions = JSON.parse(await readFile(REGIONS_PATH, "utf8")) as {
		regions: { slug: string; featureIds: string[] }[];
	};
	const uk = regions.regions.find((r) => r.slug === "united-kingdom");
	if (!uk) throw new Error("No united-kingdom region. Run pnpm data:regions first.");
	const ukIds = new Set(uk.featureIds);
	console.log(`${ukIds.size} British segments to place.`);

	const dir = resolve(CELLS_DIR);
	if (!existsSync(dir)) {
		throw new Error(`${CELLS_DIR} not found. Run pnpm data:build first.`);
	}
	const files = (await readdir(dir)).filter((f) => f.endsWith(".json"));
	const assignment = new Map<string, string>();
	let unassigned = 0;

	for (const file of files) {
		const fc = JSON.parse(await readFile(resolve(dir, file), "utf8")) as {
			features: { id?: string | number; geometry: { type: string; coordinates: unknown } }[];
		};
		for (const f of fc.features) {
			const id = String(f.id ?? "");
			if (!id || !ukIds.has(id) || assignment.has(id)) continue;
			const county = assignArea(f.geometry, counties);
			if (county) assignment.set(id, county);
			else unassigned++;
		}
	}

	const byCounty = new Map<string, string[]>();
	for (const [id, name] of assignment) {
		const list = byCounty.get(name);
		if (list) list.push(id);
		else byCounty.set(name, [id]);
	}

	const out = [...byCounty.entries()]
		.filter(([, ids]) => ids.length >= MIN_SEGMENTS)
		.map(([name, ids]) => ({ slug: slugify(name), name, featureIds: ids.sort() }))
		.sort((a, b) => b.featureIds.length - a.featureIds.length || a.name.localeCompare(b.name));

	mkdirSync("data", { recursive: true });
	await writeFile(
		OUT_PATH,
		JSON.stringify({ boundaries: `naturalearth ${NE_VERSION}`, counties: out }),
	);

	console.log(`\nAssigned ${assignment.size} of ${ukIds.size} (${unassigned} offshore/unmatched).`);
	console.log(`Wrote ${OUT_PATH}: ${out.length} counties above the ${MIN_SEGMENTS}-segment floor.`);
	for (const c of out) console.log(`  ${c.slug.padEnd(24)}${c.featureIds.length}`);
	const dropped = [...byCounty.entries()].filter(([, ids]) => ids.length < MIN_SEGMENTS);
	if (dropped.length > 0) {
		console.log(`\nBelow the floor: ${dropped.map(([n, i]) => `${n} (${i.length})`).join(", ")}`);
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
