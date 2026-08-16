/**
 * Deciding whether an Itiner-e `itinerary` token is a road name.
 *
 * The field is a comma-separated list of the ancient sources a segment appears
 * in, and those sources are a mix of three things: bibliographic catalogues
 * (the Antonine Itinerary, the Peutinger Table), named ancient authors and
 * inscriptions (Procopius, the Stadiasmus Patarensis, Eusebius), and genuine
 * road names (Via Appia, Watling Street, Limesweg).
 *
 * `roadKey` in roads.ts filters only the first group, which is right for
 * grouping segments — a token that isn't a catalogue still identifies the same
 * road consistently. But a *displayed* list of "the named roads of Italy" must
 * not include "Procopius De Aedificiis" or "Stadiasmus Patarensis 58", so this
 * applies the stricter test: reject known source patterns, then require the
 * token to actually look like a road name.
 */

/** Ancient authors, inscriptions and catalogues that are never road names. */
const SOURCE_PATTERN =
	/^(itinerarium|tabula|stadiasmus|notitia|procopius|eusebius|ptolem|strabo|plinius|pliny|geographus|ravenna)/i;

/**
 * Road-name shapes across the dataset's languages: Latin `Via …` and `Strata
 * …`, English street/way/road/dyke/causeway/highway, Dutch and German `-weg`
 * compounds (Limesweg), Welsh `Sarn`, Greek `Hodos`, Arabic `Darb`.
 */
const ROAD_LIKE_PATTERN =
	/^(via|strata)\s|\b(street|way|road|dyke|causeway|highway|hodos|darb|sarn)\b|weg$/i;

export function isDisplayableRoadName(name: string): boolean {
	const n = name.trim();
	if (n.length < 3) return false;
	if (SOURCE_PATTERN.test(n)) return false;
	return ROAD_LIKE_PATTERN.test(n);
}

/**
 * Grouping key that folds the classical/medieval spelling of Latin names
 * together. Classical Latin had no letter J, so the dataset carries both
 * "Via Iulia Augusta" and "Via Julia Augusta" for one road; without this they
 * list as two separate roads on the France page. Applied only to `Via …` and
 * `Strata …` names, so an English road called "Jubilee Way" is untouched.
 */
export function canonicalRoadNameKey(name: string): string {
	const n = name.trim().toLowerCase();
	if (!/^(via|strata)\s/.test(n)) return n;
	return n.replace(/j/g, "i");
}
