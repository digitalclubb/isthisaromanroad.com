<script lang="ts">
import FaqList from "./FaqList.svelte";

/**
 * Static, always-rendered prose beneath the homepage fold.
 *
 * The cold load is still wordmark + rule + one CTA — this sits a full
 * viewport below it and is only reached by scrolling, so "the answer is the
 * page" holds. It exists because the homepage otherwise carried about twenty
 * words of indexable text, and because it puts a crawlable link to all 22
 * road pages on the site's only page with any inbound authority.
 */
type Props = {
	roads: { key: string; name: string }[];
	faq: { q: string; a: string }[];
};
let { roads, faq }: Props = $props();
</script>

<section class="about" aria-label="About Roman roads">
	<h2 class="title">What counts as a Roman road?</h2>
	<div class="prose">
		<p>
			A Roman road is one surveyed and built by the Roman state. The oldest, the <em>Via Appia</em>
			out of Rome, was begun in 312 BC; in Britain they belong to the years after the invasion of
			AD 43. Margary's standard catalogue of Roman Britain runs to some ten thousand miles of road
			of every class, of which perhaps three thousand kilometres were paved trunk route. Most of
			it was laid by the army, to move soldiers and supplies rather than to serve towns that
			already existed.
		</p>
		<p>
			The popular test is straightness, and it is a decent one. Roman surveyors worked between
			fixed sighting points and drove the line through whatever lay between, which is why a Roman
			road takes a hill head on where a medieval road contours patiently around it. But straight
			is not proof: enclosure roads and turnpikes are straight too, and plenty of Roman roads
			bend where the ground forced it.
		</p>
		<p>
			The reliable test is the record. This site checks your position against
			<em>Itiner-e</em>, the academic survey of the empire's road network, and tells you how far
			you are from the nearest mapped line.
		</p>
	</div>

	<h2 class="title">How this works</h2>
	<div class="prose">
		<p>
			Tap the button, allow location, and the site compares your coordinates against every Roman
			road mapped near you. If you are within a few metres of a line it says so. If not, it tells
			you how far the nearest one is and which way to look.
		</p>
		<p>
			Your exact coordinates never leave your phone: the site downloads the road data for the
			square of ground around you and does the comparison in the browser. Searching by name
			instead sends that place name to OpenStreetMap's geocoder, and the map itself is drawn from
			OpenFreeMap's tiles.
		</p>
		<p>
			Coverage is empire-wide, from Scotland to Syria, because the underlying survey is. The
			hand-written histories are Britain-only for now; everywhere else falls back to the survey's
			own record of the road.
		</p>
	</div>

	<h2 class="title">The named roads of Britain</h2>
	<div class="prose">
		<p>
			Britain's Roman roads mostly reach us under English names, not Roman ones. Watling Street
			and Ermine Street are named for Anglo-Saxon peoples, the Wæclingas and the Earningas, and
			were christened centuries after the last legion left by people who used the roads without
			knowing who built them. The Fosse Way is the half-exception: an English name built on the
			Latin <em>fossa</em>, a ditch.
		</p>
	</div>
	<ul class="road-list" role="list">
		{#each roads as road (road.key)}
			<li><a href="/road/{road.key}">{road.name}</a></li>
		{/each}
	</ul>
	<p class="more-link"><a href="/roads">All the roads, with maps and figures →</a></p>

	<h2 class="title">Common questions</h2>
	<FaqList items={faq} />
</section>

<style>
	.about {
		max-width: 720px;
		margin: 0 auto;
		padding: clamp(2rem, 8vh, 4rem) clamp(1rem, 3vw, 1.75rem) clamp(1rem, 4vh, 2rem);
		border-top: 1px solid color-mix(in srgb, var(--gold) 30%, transparent);
	}

	.title {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(1.6rem, 5vw, 2.2rem);
		line-height: 1.1;
		letter-spacing: -0.025em;
		color: var(--ink);
		margin: clamp(2rem, 6vh, 3rem) 0 0.7rem;
	}
	.title:first-child {
		margin-top: 0;
	}

	.prose {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: clamp(1.05rem, 2.8vw, 1.15rem);
		line-height: 1.65;
		color: var(--ink);
		max-width: 62ch;
		margin-top: clamp(1rem, 3vh, 1.4rem);
		font-feature-settings: "onum";
	}
	.prose p {
		margin: 0;
	}
	.prose p + p {
		margin-top: 0.9rem;
	}
	.prose em {
		font-style: italic;
	}

	.road-list {
		list-style: none;
		margin: 1.2rem 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 0.5rem;
	}
	.road-list a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0.5rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--gold) 70%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--gold) 10%, transparent);
		color: var(--ink);
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 1rem;
		text-decoration: none;
		transition: border-color 200ms var(--ease), color 200ms var(--ease);
	}
	.road-list a:hover {
		border-color: var(--gold);
		color: var(--brand);
	}

	.more-link {
		margin: 1.3rem 0 0;
		font-family: var(--font-display);
		font-size: 1.1rem;
	}
	.more-link a {
		color: var(--brand);
		text-decoration: none;
		border-bottom: 1px solid var(--gold);
		padding-bottom: 1px;
	}
	.more-link a:hover {
		color: var(--brand-deep);
	}

</style>
