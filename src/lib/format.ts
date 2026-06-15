import { type RoadFeature, itineraryRoadName } from "./roads.js";

const UNNAMED = "an unnamed Roman road";
const MAX_DESCRIPTION_CHARS = 280;

/**
 * Five-tier classifier for "how close is the user to a Roman road?".
 *
 * The bands honour the dataset's own uncertainty. Itiner-e tags every
 * segment as Certain, Conjectured or Hypothetical because the reconstructed
 * line may sit 20–200 m off the ground truth depending on how the route
 * was derived. We tighten the "on the line" band for Certain segments and
 * widen it for the others so the verdict matches what the data actually
 * claims to know.
 *
 *   walking  ≤ 10 m   "Yes. You're walking the line of X."
 *   on       ≤ 80 m (Certain) / ≤ 150 m (Conjectured / Hypothetical)
 *                    "Yes. You stand on the line of X."
 *   close    ≤ 500 m  "Nearly. Close to X, Ym Z."
 *   far      ≤ 50 km  "Probably not. The nearest is X, Ym Z."
 *   out      > 50 km  "Out of reach."
 */
export type AnswerTier = "walking" | "on" | "close" | "far" | "out";

const WALKING_M = 10;
const ON_CERTAIN_M = 80;
const ON_UNCERTAIN_M = 150;
const CLOSE_M = 500;
const OUT_OF_REACH_M = 50_000;

export function answerTierFor(distanceMeters: number, certainty: string | undefined): AnswerTier {
	if (distanceMeters > OUT_OF_REACH_M) return "out";
	if (distanceMeters <= WALKING_M) return "walking";
	// Only "Certain" gets the tighter 80 m band. Everything else (including
	// missing / unknown values from future dataset additions) defaults to
	// the wider 150 m band — the safer choice when we can't trust the line.
	const isCertain = (certainty ?? "").toLowerCase() === "certain";
	const onLimit = isCertain ? ON_CERTAIN_M : ON_UNCERTAIN_M;
	if (distanceMeters <= onLimit) return "on";
	if (distanceMeters <= CLOSE_M) return "close";
	return "far";
}

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
	// Prefer a real road name from the itinerary (e.g. "Via Appia") over the
	// bibliographic catalogues it also lists; fall back to the segment's own
	// "A-B" endpoint name (e.g. "Carthago-Ammaedara").
	return itineraryRoadName(p.itinerary) ?? p.name ?? null;
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
			`${verb} a conjectured Roman ${type}: the general line is well-supported by evidence but the exact route here is inferred.`,
		);
	} else if (certainty === "hypothetical") {
		pieces.push(
			`${verb} a hypothesised Roman ${type}: scholars suggest this line but it remains unproven.`,
		);
	} else {
		pieces.push(`${verb} a Roman ${type}.`);
	}

	if (p.name && p.name !== name) {
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
