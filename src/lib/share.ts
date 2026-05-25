/**
 * Rasterises a DOM node to a PNG and shares it via the Web Share API,
 * falling back to download on platforms without share support (most desktop
 * browsers). Waits for fonts to load before capturing so the serif headline
 * renders rather than the fallback.
 */

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

	const blob = await toBlob(node, {
		width,
		height,
		pixelRatio: 2,
		cacheBust: true,
		backgroundColor: getComputedStyle(node).backgroundColor || "#efe4cd",
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
