/**
 * Renders the PWA icon set and the Open Graph card from SVG sources.
 * Run via `pnpm icons:build`.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const BRAND = "#8b1e2a";
const BRAND_DEEP = "#5e1119";
const CREAM = "#fbf6ef";

function iconSvg(size: number, maskable = false) {
	const inset = maskable ? size * 0.1 : 0;
	const radius = maskable ? 0 : size * 0.22;
	const inner = size - inset * 2;
	const fontSize = inner * 0.45;
	const textY = size / 2 + fontSize * 0.36;
	const lineY = size / 2 + fontSize * 0.6;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
		<rect width="${size}" height="${size}" rx="${radius}" fill="${BRAND}"/>
		<text x="${size / 2}" y="${textY}" text-anchor="middle"
			font-family="Georgia, 'Times New Roman', serif" font-weight="700"
			font-size="${fontSize}" fill="${CREAM}" letter-spacing="-1">RR</text>
		<rect x="${inset + inner * 0.18}" y="${lineY}" width="${inner * 0.64}" height="${Math.max(2, inner * 0.05)}" rx="${inner * 0.025}" fill="${CREAM}" opacity="0.75"/>
	</svg>`;
}

function ogSvg() {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
		<defs>
			<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stop-color="${BRAND}"/>
				<stop offset="1" stop-color="${BRAND_DEEP}"/>
			</linearGradient>
		</defs>
		<rect width="1200" height="630" fill="url(#bg)"/>
		<g fill="${CREAM}">
			<text x="80" y="290" font-family="Georgia, serif" font-weight="700" font-size="96" letter-spacing="-2">Is this a</text>
			<text x="80" y="395" font-family="Georgia, serif" font-weight="700" font-size="120" letter-spacing="-3">Roman road?</text>
			<text x="80" y="490" font-family="-apple-system, system-ui, sans-serif" font-size="34" opacity="0.85">Tap your phone — find out in a second.</text>
			<rect x="80" y="540" width="220" height="6" rx="3" opacity="0.7"/>
			<text x="80" y="600" font-family="-apple-system, system-ui, sans-serif" font-size="22" opacity="0.7">isthisaromanroad.com</text>
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
