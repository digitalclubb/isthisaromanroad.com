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

// Palette mirrors src/app.css
const TERRACOTTA = "#a24b36";
const OXBLOOD = "#6e2a22";
const PARCHMENT = "#efe4cd";
const VELLUM = "#f6ecd6";
const WALNUT = "#1b1410";
const WALNUT_DEEP = "#100a07";
const BRONZE = "#9e7b3f";
const GOLD_SOFT = "#c8a35a";

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

function render(svg: string, outPath: string) {
	const resvg = new Resvg(svg, { fitTo: { mode: "original" } });
	const png = resvg.render().asPng();
	writeFileSync(outPath, png);
	console.log(`  wrote ${outPath} (${(png.byteLength / 1024).toFixed(1)} KB)`);
}

mkdirSync("static/icons", { recursive: true });
console.log("Rendering icons…");
render(iconSvg(192, true), "static/icons/icon-192.png");
render(iconSvg(512, true), "static/icons/icon-512.png");
render(iconSvg(180), "static/apple-touch-icon.png");
console.log("Rendering Open Graph card…");
render(ogSvg(), "static/og.png");
console.log("Done.");
