/**
 * Rasterises a DOM node to a PNG and shares it via the Web Share API,
 * falling back to download on platforms without share support (most desktop
 * browsers). Waits for fonts to load before capturing so the serif headline
 * renders rather than the fallback.
 */

import { PALETTE } from "$lib/theme.js";

const SHARE_TITLE = "Is this a Roman road?";
const SHARE_TEXT = "I asked the road. isthisaromanroad.com";

export type ShareOutcome = "shared" | "downloaded" | "cancelled" | "failed";

export async function rasterise(node: HTMLElement, width: number, height: number): Promise<Blob> {
	// Dynamic import keeps html-to-image (~30 KB gzipped) out of the initial
	// bundle — it's only loaded the first time the user taps Share.
	const { toBlob } = await import("html-to-image");

	if (document.fonts?.ready) {
		try {
			await document.fonts.ready;
		} catch {
			/* ignore — proceed with fallback fonts */
		}
	}

	// The share-host wrapper sits at `position: fixed; left: -20000px` so the
	// card renders with real fonts/layout without ever being visible on the
	// page. html-to-image clones the node into a <foreignObject> at (0, 0) but
	// preserves those styles on the clone — so the card paints 20,000px to the
	// left of the capture viewport and we get a blank PNG. Reset position on
	// the clone (inline styles win over the .share-host CSS rule).
	const blob = await toBlob(node, {
		width,
		height,
		pixelRatio: 2,
		cacheBust: true,
		backgroundColor: PALETTE.parchment.bg,
		style: {
			position: "static",
			left: "0",
			top: "0",
			transform: "none",
		},
	});
	if (!blob) throw new Error("Couldn't rasterise the share card.");
	return blob;
}

export async function shareOrDownload(blob: Blob, filename: string): Promise<ShareOutcome> {
	const file = new File([blob], filename, { type: "image/png" });

	if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
		try {
			await navigator.share({
				title: SHARE_TITLE,
				text: SHARE_TEXT,
				files: [file],
			});
			return "shared";
		} catch (e) {
			if (e instanceof Error && e.name === "AbortError") return "cancelled";
			// Fall through to download
		}
	}

	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 5000);
	return "downloaded";
}
