<script lang="ts">
type Props = {
	width?: number;
	animated?: boolean;
	delay?: number;
};
let { width = 48, animated = false, delay = 350 }: Props = $props();
</script>

<span
	class="rule"
	class:animated
	style="--w: {width}px; --d: {delay}ms"
	aria-hidden="true"
></span>

<style>
	.rule {
		display: block;
		height: 2px;
		width: var(--w);
		background: linear-gradient(90deg, var(--gold) 0%, var(--gold-soft) 100%);
		border-radius: 1px;
		transform-origin: left center;
	}
	.rule.animated {
		transform: scaleX(0);
		animation: drawOn 500ms var(--ease-out) var(--d) forwards;
	}
	@keyframes drawOn {
		to {
			transform: scaleX(1);
		}
	}
</style>
