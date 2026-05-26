<script lang="ts">
import type { Story } from "$lib/stories.js";

type Props = { story: Story };
let { story }: Props = $props();
</script>

<section class="story" aria-labelledby="story-title">
	<h3 id="story-title" class="title">{story.name}</h3>
	<span class="rule" aria-hidden="true"></span>
	<!-- Static authored content; no user input flows here. -->
	<!-- biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, authored -->
	<div class="body">{@html story.body}</div>
	<a class="more" href="/road/{story.key}">More on {story.name} →</a>
</section>

<style>
	.story {
		margin-top: clamp(1.5rem, 4vh, 2rem);
		max-width: 62ch;
		animation: fadeUp 600ms var(--ease-out) both;
	}
	.title {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(1.4rem, 3.8vw, 1.7rem);
		line-height: 1.1;
		letter-spacing: -0.015em;
		color: var(--ink);
		margin: 0;
	}
	.rule {
		display: block;
		width: 40px;
		height: 2px;
		margin: 0.6rem 0 1rem;
		background: linear-gradient(90deg, var(--gold), var(--gold-soft));
		border-radius: 1px;
	}
	.body {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: clamp(1.02rem, 2.8vw, 1.15rem);
		line-height: 1.6;
		color: var(--ink);
		hyphens: auto;
	}
	.body :global(em) {
		font-style: italic;
		font-weight: 500;
	}
	.more {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 1rem;
		padding: 0.6rem 0.5rem;
		margin-left: -0.5rem;
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--ink-soft);
		text-decoration: underline;
		text-decoration-color: var(--gold);
		text-decoration-thickness: 1px;
		text-underline-offset: 4px;
		border-radius: 4px;
		min-height: 44px;
	}
	.more:hover {
		color: var(--ink);
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
