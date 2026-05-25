/**
 * Renders the PWA icon set and the Open Graph card from inline SVG. Colours
 * mirror the design tokens in src/app.css. Run via `pnpm icons:build`.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

// Roman palette — keep in sync with src/app.css
const VERMILION = "#c8312b"; // Pompeii red
const VERMILION_DEEP = "#9d2620";
const CREAM = "#fcf8ec"; // Travertine surface
const GOLD = "#d4a437"; // Imperial gold

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
				<stop offset="0" stop-color="${VERMILION}"/>
				<stop offset="1" stop-color="${VERMILION_DEEP}"/>
			</linearGradient>
		</defs>
		<rect width="${size}" height="${size}" rx="${radius}" fill="url(#bg)"/>
		<text x="${cx}" y="${textY}" text-anchor="middle"
			font-family="Georgia, 'Times New Roman', serif" font-weight="700"
			font-size="${fontSize}" fill="${CREAM}" letter-spacing="-1">RR</text>
		<rect x="${cx - ruleW / 2}" y="${ruleY}" width="${ruleW}" height="${Math.max(2, inner * 0.04)}" rx="${inner * 0.02}" fill="${GOLD}"/>
	</svg>`;
}

function ogSvg() {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
		<defs>
			<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stop-color="${VERMILION}"/>
				<stop offset="1" stop-color="${VERMILION_DEEP}"/>
			</linearGradient>
		</defs>
		<rect width="1200" height="630" fill="url(#bg)"/>
		<rect x="80" y="120" width="80" height="6" rx="3" fill="${GOLD}"/>
		<g fill="${CREAM}">
			<text x="80" y="225" font-family="Georgia, serif" font-style="italic" font-size="40" opacity="0.85" letter-spacing="4">VIA ROMANA</text>
			<text x="80" y="345" font-family="Georgia, serif" font-weight="700" font-size="96" letter-spacing="-2">Is this a</text>
			<text x="80" y="450" font-family="Georgia, serif" font-weight="700" font-size="120" letter-spacing="-3">Roman road?</text>
			<text x="80" y="545" font-family="-apple-system, system-ui, sans-serif" font-size="38" opacity="0.9">Tap. Find out. Stand on history.</text>
			<text x="80" y="600" font-family="-apple-system, system-ui, sans-serif" font-size="26" opacity="0.7">isthisaromanroad.com</text>
		</g>
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
