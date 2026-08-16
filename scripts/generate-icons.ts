/**
 * Renders the PWA icon set and the Open Graph card from inline SVG. Colours
 * mirror the design tokens in src/app.css. Run via `pnpm icons:build`.
 *
 * Icon: terracotta wax-seal feel — vermilion gradient, parchment "RR",
 * gold mile-marker rule.
 * OG card: walnut/midnight ground with parchment serif headline, gold
 * eyebrow rule + VIA ROMANA mark.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
// The published region set, not data/regions.json: the publish rule (a named
// road, or 100+ segments) lives in the server module, so reading it here is
// what keeps the card set and the page set from drifting apart.
import { loadCounties } from "../src/lib/server/counties.ts";
import { loadRegions } from "../src/lib/server/regions.ts";
import { STORIES } from "../src/lib/stories.ts";
import { PALETTE } from "../src/lib/theme.ts";

// Use the canonical palette as the source of truth.
const TERRACOTTA = PALETTE.parchment.brand;
const OXBLOOD = PALETTE.parchment.brandDeep;
const PARCHMENT = PALETTE.parchment.bg;
const WALNUT = PALETTE.walnut.bg;
const WALNUT_DEEP = "#100a07"; // Derived: a slightly deeper walnut for the OG gradient end
const BRONZE = PALETTE.parchment.gold;
const GOLD_SOFT = PALETTE.parchment.goldSoft;

function iconSvg(size: number, maskable = false) {
	const inset = maskable ? size * 0.18 : 0;
	const radius = maskable ? 0 : size * 0.22;
	const inner = size - inset * 2;
	const fontSize = inner * 0.42;
	const cx = size / 2;
	const textY = size / 2 + fontSize * 0.34;
	const ruleY = size / 2 + fontSize * 0.62;
	const ruleW = inner * 0.5;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
		<defs>
			<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="${TERRACOTTA}"/>
				<stop offset="1" stop-color="${OXBLOOD}"/>
			</linearGradient>
		</defs>
		<rect width="${size}" height="${size}" rx="${radius}" fill="url(#bg)"/>
		<text x="${cx}" y="${textY}" text-anchor="middle"
			font-family="Georgia, 'Times New Roman', serif" font-weight="700"
			font-size="${fontSize}" fill="${PARCHMENT}" letter-spacing="-1">RR</text>
		<rect x="${cx - ruleW / 2}" y="${ruleY}"
			width="${ruleW}" height="${Math.max(2, inner * 0.035)}"
			rx="${inner * 0.02}" fill="${GOLD_SOFT}"/>
	</svg>`;
}

function ogSvg() {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
		<defs>
			<radialGradient id="bg" cx="20%" cy="30%" r="90%">
				<stop offset="0" stop-color="${WALNUT}"/>
				<stop offset="1" stop-color="${WALNUT_DEEP}"/>
			</radialGradient>
			<linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0" stop-color="${BRONZE}"/>
				<stop offset="1" stop-color="${GOLD_SOFT}"/>
			</linearGradient>
		</defs>
		<rect width="1200" height="630" fill="url(#bg)"/>
		<!-- Eyebrow: gold rule + Latin caps -->
		<rect x="80" y="118" width="64" height="3" rx="1.5" fill="url(#rule)"/>
		<text x="80" y="170" font-family="Georgia, serif" font-style="italic"
			font-size="28" letter-spacing="6" fill="${BRONZE}">VIA ROMANA</text>
		<!-- Headline -->
		<g fill="${PARCHMENT}">
			<text x="80" y="320" font-family="Georgia, serif" font-weight="700"
				font-size="108" letter-spacing="-3">Is this a</text>
			<text x="80" y="440" font-family="Georgia, serif" font-weight="700"
				font-size="128" letter-spacing="-4">Roman road?</text>
		</g>
		<!-- Tagline -->
		<text x="80" y="540" font-family="Georgia, serif" font-style="italic"
			font-size="36" fill="${PARCHMENT}" opacity="0.78">
			A small oracle for the road ahead.
		</text>
		<text x="80" y="600" font-family="-apple-system, sans-serif"
			font-size="22" fill="${PARCHMENT}" opacity="0.5" letter-spacing="2">
			ISTHISAROMANROAD.COM
		</text>
	</svg>`;
}

/** XML-escape a value going into SVG text content. */
function esc(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

/**
 * Per-page Open Graph card: same walnut ground and gold eyebrow as the site
 * card, with the page's own name as the headline. Every road and country page
 * previously shared one generic og.png, so every share of every page looked
 * identical in the feed.
 *
 * The headline size steps down with length so "The Devil's Causeway" and
 * "Bosnia and Herzegovina" fit the same 1040px measure as "Fosse Way" without
 * wrapping — resvg has no text layout engine, so wrapping is not available and
 * the fit has to be arithmetic.
 */
function pageOgSvg(headline: string, subtitle: string | null, eyebrow: string) {
	// Georgia bold averages ~0.52em per character, and the measure is 1040px,
	// so the maximum headline width at a given size is roughly 2000/size
	// characters. These steps stay inside that with a margin.
	const len = headline.length;
	const size = len <= 12 ? 128 : len <= 18 ? 104 : len <= 23 ? 82 : len <= 30 ? 66 : 54;
	const baseline = 330 + size * 0.34;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
		<defs>
			<radialGradient id="bg" cx="20%" cy="30%" r="90%">
				<stop offset="0" stop-color="${WALNUT}"/>
				<stop offset="1" stop-color="${WALNUT_DEEP}"/>
			</radialGradient>
			<linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0" stop-color="${BRONZE}"/>
				<stop offset="1" stop-color="${GOLD_SOFT}"/>
			</linearGradient>
		</defs>
		<rect width="1200" height="630" fill="url(#bg)"/>
		<rect x="80" y="118" width="64" height="3" rx="1.5" fill="url(#rule)"/>
		<text x="80" y="170" font-family="Georgia, serif" font-style="italic"
			font-size="28" letter-spacing="6" fill="${BRONZE}">${esc(eyebrow)}</text>
		<text x="80" y="${baseline}" font-family="Georgia, serif" font-weight="700"
			font-size="${size}" letter-spacing="-3" fill="${PARCHMENT}">${esc(headline)}</text>
		${
			subtitle
				? `<text x="80" y="450" font-family="Georgia, serif" font-style="italic"
			font-size="38" fill="${PARCHMENT}" opacity="0.78">${esc(subtitle)}</text>`
				: ""
		}
		<text x="80" y="600" font-family="-apple-system, sans-serif"
			font-size="22" fill="${PARCHMENT}" opacity="0.5" letter-spacing="2">
			ISTHISAROMANROAD.COM
		</text>
	</svg>`;
}

function render(svg: string, outPath: string) {
	const resvg = new Resvg(svg, { fitTo: { mode: "original" } });
	const png = resvg.render().asPng();
	writeFileSync(outPath, png);
	console.log(`  wrote ${outPath} (${(png.byteLength / 1024).toFixed(1)} KB)`);
}

/** As `render`, but returns the byte count instead of logging each file. */
function renderQuiet(svg: string, outPath: string): number {
	const png = new Resvg(svg, { fitTo: { mode: "original" } }).render().asPng();
	writeFileSync(outPath, png);
	return png.byteLength;
}

mkdirSync("static/icons", { recursive: true });
console.log("Rendering icons…");
render(iconSvg(192, true), "static/icons/icon-192.png");
render(iconSvg(512, true), "static/icons/icon-512.png");
render(iconSvg(180), "static/apple-touch-icon.png");
console.log("Rendering Open Graph card…");
render(ogSvg(), "static/og.png");

// Per-page cards live under static/og/ and are excluded from the PWA precache
// in vite.config.ts: they are fetched only by crawlers and social scrapers, so
// precaching 50-odd 80 KB PNGs would cost every visitor 4 MB for nothing.
mkdirSync("static/og", { recursive: true });
console.log("Rendering per-road Open Graph cards…");
let bytes = 0;
for (const story of STORIES) {
	const subtitle = story.from && story.to ? `${story.from} to ${story.to}` : null;
	bytes += renderQuiet(
		pageOgSvg(story.name, subtitle, "VIA ROMANA"),
		`static/og/road-${story.key}.png`,
	);
}
console.log(`  ${STORIES.length} road cards, ${(bytes / 1e6).toFixed(2)} MB`);

const regions = await loadRegions();
console.log("Rendering per-country Open Graph cards…");
bytes = 0;
for (const region of regions) {
	bytes += renderQuiet(
		// "Roman roads in" is the eyebrow rather than part of the headline: as one
		// line, "Roman roads in Bosnia and Herzegovina" ran off the card.
		pageOgSvg(region.name, null, "ROMAN ROADS IN"),
		`static/og/country-${region.slug}.png`,
	);
}
console.log(`  ${regions.length} country cards, ${(bytes / 1e6).toFixed(2)} MB`);

const counties = await loadCounties();
console.log("Rendering per-county Open Graph cards…");
bytes = 0;
for (const county of counties) {
	bytes += renderQuiet(
		pageOgSvg(county.name, null, "ROMAN ROADS IN"),
		`static/og/county-${county.slug}.png`,
	);
}
console.log(`  ${counties.length} county cards, ${(bytes / 1e6).toFixed(2)} MB`);
console.log("Done.");
