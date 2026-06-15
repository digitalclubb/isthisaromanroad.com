/**
 * Server-only loader that reassembles the full feature set from the
 * partitioned cell files (static/roads/cells/*.json). Used at build time by
 * the prerendered /road/[slug] pages, which need to scan every feature to find
 * a story's segments. Memoised so the 700-odd cell files are read just once
 * across all prerenders. Never shipped to the client — the live app loads cells
 * lazily by location instead (see src/lib/roads.ts).
 */
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import type { RoadFeature } from "$lib/roads.js";

const CELLS_DIR = "static/roads/cells";

let cache: Promise<RoadFeature[]> | null = null;

export function loadAllFeatures(): Promise<RoadFeature[]> {
	if (!cache) cache = read();
	return cache;
}

async function read(): Promise<RoadFeature[]> {
	const dir = resolve(CELLS_DIR);
	const files = await readdir(dir);
	// A feature spanning a cell boundary appears in more than one file; dedupe
	// by id so each road segment is returned once.
	const byId = new Map<string | number, RoadFeature>();
	for (const file of files) {
		if (!file.endsWith(".json")) continue;
		const raw = await readFile(resolve(dir, file), "utf8");
		const fc = JSON.parse(raw) as { features: RoadFeature[] };
		for (const f of fc.features) {
			const id = f.id ?? `${file}:${byId.size}`;
			if (!byId.has(id)) byId.set(id, f);
		}
	}
	return [...byId.values()];
}
