<script lang="ts">
import { type Crumb, SITE, breadcrumbSchema, jsonLd } from "$lib/breadcrumbs.js";
import FaqList from "$lib/components/FaqList.svelte";
import RuleGold from "$lib/components/RuleGold.svelte";
import SiteFooter from "$lib/components/SiteFooter.svelte";
import SiteMasthead from "$lib/components/SiteMasthead.svelte";
import { FIDELITY_LABEL } from "$lib/modern-roads.js";
import type { PageData } from "./$types.js";

type Props = { data: PageData };
let { data }: Props = $props();

const { roads } = $derived(data);

const TITLE = "Which Modern Roads Are Roman Roads?";
// Answer first: the old description only repeated the question, and
// "is the a1 a roman road" sat on page one with no clicks.
const DESCRIPTION =
	"The A5, A2, A15, A38 and B2068 follow Roman roads closely. The A1 only in parts. Each British road on a Roman line, rated for how closely it follows.";
const CANONICAL = `${SITE}/modern-roads`;

const crumbs: Crumb[] = [
	{ name: "Is this a Roman road?", href: "/" },
	{ name: "The roads", href: "/roads" },
	{ name: "Modern roads" },
];

const FAQ = [
	{
		q: "Is the A5 a Roman road?",
		a: "Largely yes. From London to Shrewsbury the A5 follows Watling Street, in many places within a few metres of the original Roman surveying. Telford rebuilt it as the Holyhead mail road from 1815 and kept the Roman line because it was already the best available.",
	},
	{
		q: "Is the A1 a Roman road?",
		a: "Only in parts, despite the common claim. The A1 descends from the medieval Great North Road, which used Ermine Street where convenient and left it where it was not. The A15 north of Lincoln and the A1198 near Royston are far truer survivals of the Roman line.",
	},
	{
		q: "Is the A15 a Roman road?",
		a: "Yes. North of Lincoln the A15 follows Ermine Street almost dead straight towards the Humber, apart from a dogleg round RAF Scampton. It is a truer survival of the Roman line than the A1 that usually gets the credit.",
	},
	{
		q: "Is the A38 a Roman road?",
		a: "In part. Through Staffordshire and Derbyshire long sections run on Ryknild Street, most faithfully between Burton-on-Trent and Derby, where the road holds almost dead straight up the Trent valley.",
	},
	{
		q: "Which is the most faithful Roman road still in use?",
		a: "The B2068 in Kent is the usual answer: it follows Stone Street south from Canterbury almost exactly for about twenty kilometres and still carries the Roman road's name.",
	},
	{
		q: "Why do Roman roads feel different to drive?",
		a: "Because they take hills head on. Roman surveyors worked between fixed sighting points and held the alignment across whatever lay between, where a medieval road contours around it. The A68 across Northumberland is the clearest example: its sudden crests and dips are Roman surveying, not modern engineering.",
	},
	{
		q: "Is the Military Road on Hadrian's Wall a Roman road?",
		a: "No, and it is the most common confusion in the north. The B6318 Military Road was built in the 1750s after the Jacobite rising, largely on top of Hadrian's Wall itself. The Roman service road, the Military Way, is a separate line running behind the wall.",
	},
];
</script>

<svelte:head>
	<title>{TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
	<link rel="canonical" href={CANONICAL} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={CANONICAL} />
	<meta property="og:image" content="{SITE}/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content="{SITE}/og.png" />
	{@html `<script type="application/ld+json">${jsonLd([
		breadcrumbSchema(crumbs),
		{
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: FAQ.map((f) => ({
				"@type": "Question",
				name: f.q,
				acceptedAnswer: { "@type": "Answer", text: f.a },
			})),
		},
	])}</` + `script>`}
</svelte:head>

<main>
	<SiteMasthead {crumbs} />

	<article>
		<h1>Modern roads on Roman lines</h1>
		<RuleGold animated />

		<p class="standfirst">
			A surprising number of British trunk roads still run where Roman surveyors put them. Not
			because anyone preserved them deliberately, but because the Romans picked the best line
			first and every road builder since has agreed. These are the clearest cases, with an honest
			note on how closely each one really follows.
		</p>

		<ol class="roads" role="list">
			{#each roads as road (road.number)}
				<!-- Anchor per road (#a1, #a37-and-a367) so search results and shares can
				     deep-link the answer to "is the A1 a Roman road?". -->
				<li id={road.number.toLowerCase().replaceAll(" ", "-")}>
					<div class="head">
						<h2 class="number">{road.number}</h2>
						<span class="fidelity" data-fidelity={road.fidelity}>
							{FIDELITY_LABEL[road.fidelity]}
						</span>
					</div>
					<p class="follows">
						Follows
						{#if road.road}
							<a href="/road/{road.road}">{road.roman}</a>
						{:else}
							{road.roman}
						{/if}
						between {road.between}
					</p>
					<p class="note">{road.note}</p>
				</li>
			{/each}
		</ol>

		<h2 class="section">Common questions</h2>
		<FaqList items={FAQ} />

		<a class="cta" href="/">Am I on one right now?</a>
	</article>

	<SiteFooter />
</main>

<style>
	main {
		min-height: 100dvh;
		display: grid;
		grid-template-rows: auto 1fr auto;
		padding: clamp(1rem, 3vw, 1.75rem);
		max-width: 760px;
		margin: 0 auto;
	}

	article {
		animation: fadeUp 600ms var(--ease-out) both;
	}

	h1 {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(2.4rem, 9vw, 4.2rem);
		line-height: 1;
		letter-spacing: -0.035em;
		color: var(--ink);
		margin: clamp(1rem, 3vh, 1.5rem) 0 0.7rem;
	}

	.standfirst {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: clamp(1.05rem, 2.8vw, 1.2rem);
		line-height: 1.6;
		color: var(--ink);
		max-width: 62ch;
		margin: clamp(1.5rem, 4vh, 2rem) 0 0;
	}

	.section {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(1.35rem, 3.6vw, 1.65rem);
		line-height: 1.15;
		letter-spacing: -0.015em;
		color: var(--ink);
		margin: clamp(2.5rem, 6vh, 3.25rem) 0 0;
	}

	.roads {
		list-style: none;
		margin: clamp(2rem, 6vh, 3rem) 0 0;
		padding: 0;
	}
	.roads li {
		scroll-margin-top: 1rem;
		padding: clamp(1.1rem, 3vh, 1.4rem) 0;
	}
	.roads li + li {
		border-top: 1px solid color-mix(in srgb, var(--gold) 38%, transparent);
	}

	.head {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.7rem 0.9rem;
	}
	.number {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(1.7rem, 5vw, 2.1rem);
		line-height: 1;
		letter-spacing: -0.02em;
		color: var(--ink);
		margin: 0;
		font-feature-settings: "onum" 0;
	}
	.fidelity {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.74rem;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		padding: 0.3rem 0.6rem;
		border-radius: 999px;
		border: 1px solid currentColor;
	}
	.fidelity[data-fidelity="close"] {
		color: var(--ok);
	}
	.fidelity[data-fidelity="partial"] {
		color: var(--warn);
	}
	.fidelity[data-fidelity="loose"] {
		color: var(--ink-soft);
	}

	.follows {
		font-family: var(--font-display);
		font-style: italic;
		font-size: 1.05rem;
		color: var(--ink-soft);
		margin: 0.5rem 0 0;
	}
	.follows a {
		color: var(--brand);
		font-style: italic;
		text-decoration: none;
		border-bottom: 1px solid var(--gold);
		padding-bottom: 1px;
	}
	.follows a:hover {
		color: var(--brand-deep);
	}

	.note {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--ink);
		margin: 0.6rem 0 0;
		max-width: 62ch;
	}

	.cta {
		display: inline-flex;
		align-items: center;
		margin-top: clamp(2.5rem, 6vh, 3.25rem);
		padding: 0.9rem 1.6rem;
		border-radius: 999px;
		background: var(--brand);
		color: var(--bg);
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 1.2rem;
		text-decoration: none;
		min-height: 44px;
		box-shadow: 0 1px 2px rgb(31 22 14 / 0.12), 0 14px 30px -14px var(--brand-deep);
		transition: background 220ms var(--ease), transform 80ms ease;
	}
	.cta:hover {
		background: var(--brand-deep);
		color: var(--bg);
	}
	.cta:active {
		transform: scale(0.98);
	}
	@media (prefers-color-scheme: dark) {
		.cta {
			background: var(--brand-deep);
		}
		.cta:hover {
			background: var(--brand);
		}
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
