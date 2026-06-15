/**
 * Smoke test the partitioned road index against known locations across the
 * Roman world. Drives the same lazy, cell-based RoadIndex the browser uses,
 * but backed by a filesystem `fetch` shim that reads static/roads/.
 * Usage: node --experimental-strip-types scripts/smoke-test.ts
 */
import { readFile } from "node:fs/promises";
import { answerTierFor, bearingToCompass } from "../src/lib/format.ts";
import { type CellFetch, loadRoadIndex } from "../src/lib/roads.ts";

// Map the index's request URLs (`<baseUrl>/...`) onto files on disk.
const fsFetch: CellFetch = async (url) => {
	try {
		const body = await readFile(url, "utf8");
		return { ok: true, status: 200, json: async () => JSON.parse(body) };
	} catch {
		return { ok: false, status: 404, json: async () => null };
	}
};

const idx = await loadRoadIndex(fsFetch, "static/roads");

const cases: Array<{ name: string; lng: number; lat: number }> = [
	// Watling Street (now A2) somewhere east of London
	{ name: "A2 near Bexley (Watling St)", lng: 0.1487, lat: 51.4416 },
	// Fosse Way near Cirencester
	{ name: "Cirencester (Corinium)", lng: -1.9684, lat: 51.7194 },
	// Ermine Street near Lincoln
	{ name: "Lincoln (Lindum)", lng: -0.5406, lat: 53.2307 },
	// Edinburgh — way north of Roman Britain proper
	{ name: "Edinburgh", lng: -3.1883, lat: 55.9533 },
	// Rome — the hub of every road
	{ name: "Rome (Via Appia)", lng: 12.4922, lat: 41.8902 },
	// Pompeii
	{ name: "Pompeii", lng: 14.4849, lat: 40.7497 },
	// Carthage, North Africa
	{ name: "Carthage (Tunis)", lng: 10.3233, lat: 36.8528 },
	// Antioch, Roman East
	{ name: "Antakya (Antioch)", lng: 36.1611, lat: 36.2 },
	// Mid-Atlantic — nowhere near a road
	{ name: "Mid-Atlantic (no road)", lng: -40, lat: 35 },
];

console.log(`Loaded manifest. Probing ${cases.length} locations…\n`);

for (const { name, lng, lat } of cases) {
	const r = await idx.findNearest(lng, lat);
	if (!r) {
		console.log(`${name}: no road found`);
		continue;
	}
	const tier = answerTierFor(r.distanceMeters, r.road.properties.certainty);
	const segs = await idx.segmentsOfRoad(r.road);
	console.log(
		`${name}: ${tier.padEnd(8)} ${r.distanceMeters.toFixed(0).padStart(7)}m ${bearingToCompass(r.bearingFromUser)} | ${r.road.properties.itinerary ?? r.road.properties.name ?? "(unnamed)"} | ${segs.length} segs | ${r.road.properties.certainty ?? "?"}`,
	);
}

console.log(`\nFeatures pulled into memory: ${idx.loadedFeatureCount}`);
