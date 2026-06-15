/**
 * Thin wrapper over Nominatim geocoding. Free, no API key. Usage policy
 * requires identifying the app via Referer (sent automatically by browsers
 * on production), no more than 1 req/sec, and no heavy parallel use.
 * https://operations.osmfoundation.org/policies/nominatim/
 *
 * If we ever exceed the free tier or want to set a User-Agent, this should
 * move behind a SvelteKit +server.ts route that proxies the request and adds
 * the header (User-Agent can't be set from the browser).
 */

const DEFAULT_TIMEOUT_MS = 10_000;
const ENDPOINT = "https://nominatim.openstreetmap.org/search";

export type GeocodeResult = {
	lat: number;
	lng: number;
	label: string;
};

export async function geocode(query: string, signal?: AbortSignal): Promise<GeocodeResult[]> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
	const merged = signal ? mergeSignals(signal, controller.signal) : controller.signal;

	try {
		const params = new URLSearchParams({
			q: query,
			format: "jsonv2",
			limit: "5",
			addressdetails: "0",
		});
		const res = await fetch(`${ENDPOINT}?${params}`, {
			headers: { Accept: "application/json" },
			signal: merged,
		});
		if (!res.ok) throw new Error(`Geocode failed: ${res.status}`);
		const data = (await res.json()) as Array<{
			lat: string;
			lon: string;
			display_name: string;
		}>;
		return data.map((d) => ({
			lat: Number.parseFloat(d.lat),
			lng: Number.parseFloat(d.lon),
			label: d.display_name,
		}));
	} catch (e) {
		if (controller.signal.aborted && !signal?.aborted) {
			throw new Error("Search timed out. Check your connection and try again.");
		}
		throw e;
	} finally {
		clearTimeout(timer);
	}
}

function mergeSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
	const c = new AbortController();
	const onAbort = () => c.abort();
	a.addEventListener("abort", onAbort, { once: true });
	b.addEventListener("abort", onAbort, { once: true });
	if (a.aborted || b.aborted) c.abort();
	return c.signal;
}
