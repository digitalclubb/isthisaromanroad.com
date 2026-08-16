import { MODERN_ROADS } from "$lib/modern-roads.js";
import type { PageServerLoad } from "./$types.js";

export const prerender = true;

/**
 * Server load so MODERN_ROADS stays out of the client bundle: the page is
 * fully static, so the content is inlined into the prerendered HTML and none
 * of it needs to ship as JavaScript.
 */
export const load: PageServerLoad = async () => ({ roads: MODERN_ROADS });
