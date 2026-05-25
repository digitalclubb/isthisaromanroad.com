import type { RoadFeature } from "./roads.js";

const UNNAMED = "an unnamed Roman road";
const MAX_DESCRIPTION_CHARS = 280;

export function bearingToCompass(deg: number): string {
	const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
	return dirs[Math.round(deg / 45) % 8];
}

/**
 * Translates a compass bearing into a phrase suited to a sub-line beneath an
 * answer headline. 16-wind rose, written in conversational English so a
 * driver-passenger pairing can act on it ("just north" lands faster than
 * "352°").
 */
export function bearingToWords(deg: number): string {
	const d = ((deg % 360) + 360) % 360;
	const sectors: Array<[number, number, string]> = [
		[348.75, 360.0, "due north"],
		[0.0, 11.25, "due north"],
		[11.25, 33.75, "just east of north"],
		[33.75, 56.25, "north-east of here"],
		[56.25, 78.75, "just north of east"],
		[78.75, 101.25, "due east"],
		[101.25, 123.75, "just south of east"],
		[123.75, 146.25, "south-east of here"],
		[146.25, 168.75, "just east of south"],
		[168.75, 191.25, "due south"],
		[191.25, 213.75, "just west of south"],
		[213.75, 236.25, "south-west of here"],
		[236.25, 258.75, "just south of west"],
		[258.75, 281.25, "due west"],
		[281.25, 303.75, "just north of west"],
		[303.75, 326.25, "north-west of here"],
		[326.25, 348.75, "just west of north"],
	];
	for (const [from, to, name] of sectors) {
		if (d >= from && d < to) return name;
	}
	return "due north";
}

export function formatDistance(m: number): string {
	if (m < 10) return `${m.toFixed(1)} m`;
	if (m < 1000) return `${Math.round(m)} m`;
	if (m < 10_000) return `${(m / 1000).toFixed(1)} km`;
	return `${Math.round(m / 1000)} km`;
}

export function roadDisplayName(r: RoadFeature): string | null {
	const p = r.properties;
	if (p.itinerary && p.name && p.itinerary !== p.name) {
		return p.itinerary;
	}
	return p.itinerary || p.name || null;
}

export function roadDisplayNameOrUnnamed(r: RoadFeature): string {
	return roadDisplayName(r) ?? UNNAMED;
}

export function roadSubtitle(r: RoadFeature): string | null {
	const p = r.properties;
	const parts: string[] = [];
	if (p.type) parts.push(p.type);
	if (p.certainty) parts.push(`${p.certainty.toLowerCase()} route`);
	return parts.length > 0 ? parts.join(" · ") : null;
}

function trim(s: string, max: number): string {
	if (s.length <= max) return s;
	return `${s.slice(0, max - 1).replace(/[\s,;:.\-]+$/, "")}…`;
}

export function roadNarrative(r: RoadFeature): string {
	const p = r.properties;
	const name = roadDisplayNameOrUnnamed(r);
	const verb = name === UNNAMED ? "It is" : `${name} is`;

	const pieces: string[] = [];
	const type = p.type ? p.type.toLowerCase() : "road";
	const certainty = p.certainty ? p.certainty.toLowerCase() : "";
	if (certainty === "certain") {
		pieces.push(`${verb} a confirmed Roman ${type}.`);
	} else if (certainty === "conjectured") {
		pieces.push(
			`${verb} a conjectured Roman ${type} — the general line is well-supported by evidence but the exact route here is inferred.`,
		);
	} else if (certainty === "hypothetical") {
		pieces.push(
			`${verb} a hypothesised Roman ${type} — scholars suggest this line, but it remains unproven.`,
		);
	} else {
		pieces.push(`${verb} a Roman ${type}.`);
	}

	if (p.name && p.itinerary && p.name !== p.itinerary) {
		pieces.push(`The segment is known as ${p.name}.`);
	}
	if (p.description) {
		const clean = trim(p.description.replace(/\.$/, ""), MAX_DESCRIPTION_CHARS);
		pieces.push(`${clean}.`);
	}
	if (p.constructionPeriod) {
		pieces.push(`Built in the ${p.constructionPeriod} period.`);
	}
	return pieces.join(" ");
}
