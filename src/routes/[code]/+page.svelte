<script lang="ts">
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';
	import { THEMES } from '$lib/content';
	import type { ThemeName } from '$lib/content';

	let { data }: { data: PageData } = $props();

	// Intentional: $state captures the initial value of data.candidateMessages[0] for the SSR render.
	// data is a prerendered prop — it never changes after hydration, so capturing the initial value
	// is correct. $effect then overwrites both with Math.random() selections on the client.
	// The state_referenced_locally warning is expected and safe to ignore here.
	let theme: ThemeName = $state<ThemeName>(THEMES[0]);
	let message: string = $state(data.candidateMessages[0]);

	$effect(() => {
		// Randomise theme and message on the client after hydration.
		theme = THEMES[Math.floor(Math.random() * THEMES.length)];
		message = data.candidateMessages[Math.floor(Math.random() * data.candidateMessages.length)];
	});
</script>

<svelte:head>
	<title>{data.code} {data.reasonPhrase}</title>
</svelte:head>

<div class="container" data-theme={theme}>
	<main>
		<p class="status-code" aria-hidden="true">{data.code}</p>
		<h1 class="reason-phrase">{data.reasonPhrase}</h1>
		<p class="message">{message}</p>
		<a class="home-link" href={resolve('/')}>← go home</a>
	</main>
</div>

<style>
	/* ─── Reset ──────────────────────────────────────────────────────────────── */
	*,
	*::before,
	*::after {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	/* ─── Theme token definitions ─────────────────────────────────────────────
   All four themes defined via data-theme attribute on .container.
   Tokens are scoped to .container to guarantee no leakage.
   ──────────────────────────────────────────────────────────────────────── */
	.container[data-theme='dark'] {
		--bg: #0a0a0a;
		--fg: #f5f5f5;
		--muted: #a0a0a0;
		--accent: #7c3aed;
		--font-stack: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		--glow-color: transparent;
		--scanline-opacity: 0;
		--link-radius: 6px;
		--status-tracking: -0.04em;
	}

	.container[data-theme='retro'] {
		--bg: #1a1200;
		--fg: #fbbf24;
		--muted: #a07828; /* Adjusted from #92691a for WCAG AA compliance */
		--accent: #f59e0b;
		--font-stack: 'Courier New', Courier, monospace;
		--glow-color: transparent;
		--scanline-opacity: 0.06;
		--link-radius: 0px;
		--status-tracking: 0.05em;
	}

	.container[data-theme='neon'] {
		--bg: #0d0d2b;
		--fg: #e0e0ff;
		--muted: #7070cc;
		--accent: #00f0ff;
		--font-stack: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		--glow-color: rgba(0, 240, 255, 0.25);
		--scanline-opacity: 0;
		--link-radius: 4px;
		--status-tracking: -0.04em;
	}

	.container[data-theme='minimal'] {
		--bg: #fafafa;
		--fg: #111111;
		--muted: #666666;
		--accent: #374151;
		--font-stack: Georgia, 'Times New Roman', serif;
		--glow-color: transparent;
		--scanline-opacity: 0;
		--link-radius: 2px;
		--status-tracking: -0.04em;
	}

	/* ─── Container ───────────────────────────────────────────────────────────
   Full-viewport centred layout. Uses dvh with vh fallback for mobile
   browser chrome handling.
   ──────────────────────────────────────────────────────────────────────── */
	.container {
		/* Fallback for browsers that do not support dvh */
		min-height: 100vh;
		min-height: 100dvh;
		background-color: var(--bg);
		color: var(--fg);
		font-family: var(--font-stack);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
	}

	/* ─── CRT Scanline overlay (retro theme only) ─────────────────────────────
   pointer-events: none ensures it does not intercept clicks.
   ──────────────────────────────────────────────────────────────────────── */
	.container::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, var(--scanline-opacity)) 0px,
			rgba(0, 0, 0, var(--scanline-opacity)) 1px,
			transparent 1px,
			transparent 4px
		);
		pointer-events: none;
		z-index: 1;
	}

	/* ─── Main content column ─────────────────────────────────────────────────
   Centred, padded, no breakpoint dependencies.
   ──────────────────────────────────────────────────────────────────────── */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 24px;
		max-width: min(90vw, 640px);
		width: 100%;
		position: relative;
		z-index: 2;
	}

	/* ─── Status code ─────────────────────────────────────────────────────────
   Gradient text via background-clip technique.
   The element is aria-hidden so the number does not get read by screen readers
   (the reason phrase h1 conveys the error type).
   ──────────────────────────────────────────────────────────────────────── */
	.status-code {
		font-size: clamp(6rem, 20vw, 14rem);
		font-weight: 900;
		line-height: 1;
		letter-spacing: var(--status-tracking);
		background: linear-gradient(135deg, var(--accent), var(--fg));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent; /* Fallback for background-clip:text unsupported */
		overflow-wrap: break-word;
		margin-bottom: 0;
		/* Entry animation */
		animation: fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: 0ms;
	}

	/* ─── Neon glow on status code ────────────────────────────────────────────
   background-clip:text makes the element itself transparent, so text-shadow
   does not show on the text. We use a filter:drop-shadow workaround instead,
   which applies to the rendered pixels of the transparent text element.
   ──────────────────────────────────────────────────────────────────────── */
	.container[data-theme='neon'] .status-code {
		filter: drop-shadow(0 0 4px rgba(0, 240, 255, 0.6))
			drop-shadow(0 0 12px rgba(0, 240, 255, 0.35)) drop-shadow(0 0 24px rgba(0, 240, 255, 0.15));
		animation:
			fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both,
			neon-pulse 4000ms ease-in-out infinite alternate;
		animation-delay: 0ms, 700ms; /* Pulse starts after entry animation */
	}

	/* ─── Reason phrase ───────────────────────────────────────────────────────*/
	.reason-phrase {
		font-size: clamp(1.5rem, 4vw, 3rem);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.01em;
		color: var(--fg);
		margin-top: 0;
		margin-bottom: 24px;
		overflow-wrap: break-word;
		/* Entry animation */
		animation: fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: 100ms;
	}

	/* ─── Retro cursor blink on reason phrase ─────────────────────────────────*/
	.container[data-theme='retro'] .reason-phrase::after {
		content: '_';
		display: inline-block;
		animation: blink 1100ms steps(1) infinite;
		margin-left: 2px;
	}

	/* ─── Message ─────────────────────────────────────────────────────────────*/
	.message {
		font-size: clamp(1rem, 2vw, 1.125rem);
		font-weight: 400;
		line-height: 1.6;
		color: var(--muted);
		max-width: 40ch;
		margin-bottom: 48px;
		overflow-wrap: break-word;
		/* Entry animation */
		animation: fade-up 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: 200ms;
	}

	/* ─── Home link ───────────────────────────────────────────────────────────*/
	.home-link {
		display: inline-block;
		font-size: clamp(0.875rem, 1.5vw, 1rem);
		font-weight: 500;
		letter-spacing: 0.01em;
		color: var(--accent);
		text-decoration: none;
		padding: 12px 24px;
		border: 1.5px solid var(--accent);
		border-radius: var(--link-radius);
		background-color: transparent;
		transition:
			background-color 150ms ease,
			color 150ms ease;
		/* Entry animation */
		animation: fade-up 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: 300ms;
	}

	.home-link:hover {
		background-color: var(--accent);
		color: var(--bg);
		text-decoration: none;
	}

	/* ─── Focus indicator ─────────────────────────────────────────────────────
   :focus-visible ensures the ring only appears for keyboard navigation.
   outline-offset creates separation from the border.
   ──────────────────────────────────────────────────────────────────────── */
	.home-link:focus-visible {
		outline: 3px solid var(--accent);
		outline-offset: 3px;
		border-radius: var(--link-radius);
	}

	/* ─── Keyframe animations ─────────────────────────────────────────────────*/
	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes neon-pulse {
		from {
			filter: drop-shadow(0 0 4px rgba(0, 240, 255, 0.6))
				drop-shadow(0 0 12px rgba(0, 240, 255, 0.35)) drop-shadow(0 0 24px rgba(0, 240, 255, 0.15));
		}
		to {
			filter: drop-shadow(0 0 6px rgba(0, 240, 255, 0.9))
				drop-shadow(0 0 18px rgba(0, 240, 255, 0.55)) drop-shadow(0 0 40px rgba(0, 240, 255, 0.25));
		}
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	/* ─── Reduced motion ──────────────────────────────────────────────────────
   All animations off. Only functional transitions (link hover) retained,
   as they are not vestibular-risky.
   ──────────────────────────────────────────────────────────────────────── */
	@media (prefers-reduced-motion: reduce) {
		.status-code,
		.reason-phrase,
		.message,
		.home-link {
			animation: none;
			opacity: 1;
			transform: none;
		}

		.container[data-theme='neon'] .status-code {
			/* Keep static glow, remove pulse */
			filter: drop-shadow(0 0 4px rgba(0, 240, 255, 0.6))
				drop-shadow(0 0 12px rgba(0, 240, 255, 0.35)) drop-shadow(0 0 24px rgba(0, 240, 255, 0.15));
			animation: none;
		}

		.container[data-theme='retro'] .reason-phrase::after {
			animation: none;
			opacity: 1;
		}

		.home-link {
			transition:
				background-color 150ms ease,
				color 150ms ease;
		}
	}
</style>
