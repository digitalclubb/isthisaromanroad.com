export const SITE = "https://isthisaromanroad.com";

/** One step in a breadcrumb trail. The last item is the current page. */
export type Crumb = { name: string; href?: string };

/**
 * BreadcrumbList JSON-LD built from the same array the page renders visibly,
 * so the two can't drift. Google flags structured breadcrumbs that don't match
 * the visible trail, which on a site whose whole problem is discoverability
 * would be a self-inflicted wound.
 */
export function breadcrumbSchema(items: Crumb[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			...(item.href ? { item: `${SITE}${item.href}` } : {}),
		})),
	};
}

/**
 * Serialises JSON-LD for `{@html}` injection into <svelte:head>.
 *
 * `<` can only occur inside a JSON string literal (the structural characters
 * are {}[]:," and digits), and < is a valid JSON string escape that reads
 * back as "<". So this closes the `</script>` break-out without changing what
 * a parser sees.
 */
export function jsonLd(payload: unknown): string {
	return JSON.stringify(payload).replace(/</g, "\\u003c");
}
