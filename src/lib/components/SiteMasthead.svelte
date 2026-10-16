<script lang="ts">
import type { Crumb } from "$lib/breadcrumbs.js";
import Breadcrumbs from "./Breadcrumbs.svelte";

/**
 * The breadcrumb trail at the top of every page except the homepage, which
 * renders the full wordmark as its hero. The trail's first crumb is the site
 * name and the link home, so there is no separate wordmark: showing both
 * printed "Is this a Roman road?" twice.
 */
type Props = { crumbs: Crumb[] };
let { crumbs }: Props = $props();
</script>

<header class="masthead">
	<Breadcrumbs items={crumbs} />
</header>

<style>
	.masthead {
		padding-top: clamp(0.5rem, 3vh, 1.5rem);
	}
</style>
