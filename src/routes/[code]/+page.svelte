<script lang="ts">
	import type { PageData } from './$types';
	import { THEMES } from '$lib/content';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.code} {data.reasonPhrase}</title>
	<link rel="icon" href="https://wanted.solutions/assets/branding/favicon.ico" />
</svelte:head>

<div class="container" data-theme={THEMES[0]} id="ep-root">
	<div class="field" aria-hidden="true"></div>
	<main>
		<p class="eyebrow" aria-hidden="true">HTTP&nbsp;{data.code}</p>

		<div class="code-stack">
			<span class="ghost" aria-hidden="true">{data.code}</span>
			<p class="status-code" aria-hidden="true">{data.code}</p>
		</div>

		<div class="rule" aria-hidden="true"></div>

		<h1 class="reason-phrase">
			<span class="sr-only">HTTP {data.code} — </span>{data.reasonPhrase}
		</h1>
		<p class="message" id="ep-message">{data.candidateMessages[0]}</p>
	</main>
</div>

{@html `<script>
	(function () {
		var themes = ${JSON.stringify(THEMES)};
		var messages = ${JSON.stringify(data.candidateMessages)};
		var root = document.getElementById('ep-root');
		var msg = document.getElementById('ep-message');
		if (root) root.setAttribute('data-theme', themes[Math.floor(Math.random() * themes.length)]);
		if (msg) msg.textContent = messages[Math.floor(Math.random() * messages.length)];
	})();
</script>`}

<style>
	/* ─── Reset ───────────────────────────────────────────────────────────────*/
	:global(html, body) {
		margin: 0;
		padding: 0;
	}

	*,
	*::before,
	*::after {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* ─── Themes ──────────────────────────────────────────────────────────────
   Every theme defines the same token set, so the layout never branches on
   which one was rolled:

     --bg / --fg / --muted          surface + text (all pairs ≥ 4.5:1)
     --accent / --accent-2          the two stops of the numeral gradient
     --surface / --edge             the card fill and its hairline
     --field-a / --field-b          the two background washes
     --grid                         the structural line colour
     --font-stack
   ──────────────────────────────────────────────────────────────────────── */

	/* dark — deep slate, cool indigo→sky light source from the top-left. */
	.container[data-theme='dark'] {
		--bg: #0b1120;
		--fg: #e2e8f0; /* slate-200 — 14.0:1 on --bg */
		--muted: #97a5ba; /* 7.4:1 on --bg  */
		--accent: #a5b4fc; /* indigo-300 */
		--accent-2: #38bdf8; /* sky-400    */
		--surface: rgba(226, 232, 240, 0.035);
		--edge: rgba(226, 232, 240, 0.1);
		--field-a: rgba(99, 102, 241, 0.16); /* indigo wash */
		--field-b: rgba(14, 165, 233, 0.1); /* sky wash    */
		--grid: rgba(226, 232, 240, 0.04);
		--font-stack: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
	}

	/* retro — amber CRT. Scanlines + vignette, monospace, blinking cursor. */
	.container[data-theme='retro'] {
		--bg: #14110d;
		--fg: #fde68a; /* amber-200 — 12.6:1 on --bg */
		--muted: #d8a657; /* 7.6:1 — was amber-700 at 3.3:1 */
		--accent: #f59e0b; /* amber-500 */
		--accent-2: #fde68a; /* amber-200 */
		--surface: rgba(253, 230, 138, 0.04);
		--edge: rgba(245, 158, 11, 0.22);
		--field-a: rgba(245, 158, 11, 0.12);
		--field-b: rgba(120, 53, 15, 0.22);
		--grid: rgba(253, 230, 138, 0.05);
		--font-stack: ui-monospace, 'SF Mono', 'Courier New', Courier, monospace;
	}

	/* neon — synthwave. Horizon glow, cyan→pink numeral, perspective grid. */
	.container[data-theme='neon'] {
		--bg: #05010f;
		--fg: #ecfeff; /* cyan-50 — 17.9:1 on --bg */
		--muted: #b4a0f5; /* violet — 7.1:1 on --bg  */
		--accent: #22d3ee; /* cyan-400   */
		--accent-2: #f472b6; /* pink-400   */
		--surface: rgba(236, 254, 255, 0.03);
		--edge: rgba(34, 211, 238, 0.22);
		--field-a: rgba(217, 70, 239, 0.18); /* magenta horizon */
		--field-b: rgba(34, 211, 238, 0.14); /* cyan rim        */
		--grid: rgba(34, 211, 238, 0.1);
		--font-stack: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
	}

	/* minimal — paper. Hairline grid, ink numeral, one red accent. */
	.container[data-theme='minimal'] {
		--bg: #faf9f7;
		--fg: #1c1917; /* stone-900 — 16.3:1 on --bg */
		--muted: #57534e; /* stone-600 — 7.6:1 on --bg  */
		--accent: #b91c1c; /* red-700 */
		--accent-2: #1c1917; /* stone-900 */
		--surface: rgba(28, 25, 23, 0.015);
		--edge: rgba(28, 25, 23, 0.12);
		--field-a: rgba(185, 28, 28, 0.05);
		--field-b: rgba(28, 25, 23, 0.03);
		--grid: rgba(28, 25, 23, 0.05);
		--font-stack: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
	}

	/* ─── Container ───────────────────────────────────────────────────────────*/
	.container {
		position: relative;
		isolation: isolate;
		min-height: 100vh;
		min-height: 100dvh;
		background-color: var(--bg);
		color: var(--fg);
		font-family: var(--font-stack);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		overflow: hidden;
	}

	/* ─── Background field ────────────────────────────────────────────────────
   Two coloured washes plus a structural layer, both pure CSS gradients —
   no images, nothing to fetch. The whole point of an error page is that it
   renders when the rest of the estate does not.
   ──────────────────────────────────────────────────────────────────────── */
	.field {
		position: absolute;
		inset: 0;
		z-index: -1;
		background:
			radial-gradient(60rem 36rem at 12% -10%, var(--field-a), transparent 70%),
			radial-gradient(48rem 32rem at 95% 108%, var(--field-b), transparent 70%);
		animation: fade-in 700ms ease both;
	}

	/* Structural layer — a different geometry per theme, same mechanism. */
	.field::after {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(to right, var(--grid) 1px, transparent 1px),
			linear-gradient(to bottom, var(--grid) 1px, transparent 1px);
		background-size: 72px 72px;
		mask-image: radial-gradient(70% 60% at 50% 45%, #000 20%, transparent 100%);
		-webkit-mask-image: radial-gradient(70% 60% at 50% 45%, #000 20%, transparent 100%);
	}

	/* retro — CRT scanlines instead of a grid, plus a vignette. */
	.container[data-theme='retro'] .field::after {
		background-image: repeating-linear-gradient(to bottom, var(--grid) 0 1px, transparent 1px 4px);
		background-size: auto;
		mask-image: none;
		-webkit-mask-image: none;
	}

	.container[data-theme='retro'] .field {
		box-shadow: inset 0 0 20rem 6rem rgba(0, 0, 0, 0.55);
	}

	/* neon — a receding floor grid under a glowing horizon. */
	.container[data-theme='neon'] .field::after {
		background-size: 56px 56px;
		mask-image: linear-gradient(to bottom, transparent 55%, #000 100%);
		-webkit-mask-image: linear-gradient(to bottom, transparent 55%, #000 100%);
		transform: perspective(28rem) rotateX(62deg) scale(2.4);
		transform-origin: 50% 100%;
	}

	/* minimal — a tighter, flatter grid; paper rather than space. */
	.container[data-theme='minimal'] .field::after {
		background-size: 32px 32px;
		mask-image: radial-gradient(80% 70% at 50% 50%, #000 30%, transparent 100%);
		-webkit-mask-image: radial-gradient(80% 70% at 50% 50%, #000 30%, transparent 100%);
	}

	/* ─── Card ────────────────────────────────────────────────────────────────*/
	main {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: clamp(36px, 6vw, 64px) clamp(24px, 5vw, 56px);
		max-width: min(94vw, 600px);
		width: 100%;
		border: 1px solid var(--edge);
		border-radius: 20px;
		background-color: var(--surface);
		backdrop-filter: blur(1px);
		animation: rise 450ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	/* A single highlight along the top edge — reads as a light source rather
	   than as a border, and disappears cleanly on the light theme. */
	main::before {
		content: '';
		position: absolute;
		inset-inline: 12%;
		top: -1px;
		height: 1px;
		background: linear-gradient(to right, transparent, var(--accent), transparent);
		opacity: 0.5;
	}

	/* ─── Eyebrow ─────────────────────────────────────────────────────────────*/
	.eyebrow {
		font-family: ui-monospace, 'SF Mono', 'Courier New', monospace;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--muted);
		padding: 4px 12px;
		border: 1px solid var(--edge);
		border-radius: 999px;
		animation: fade-in 300ms ease both;
	}

	/* ─── Status code ─────────────────────────────────────────────────────────
   Two layers: a ghost numeral for depth, and the gradient numeral on top.
   ──────────────────────────────────────────────────────────────────────── */
	.code-stack {
		position: relative;
		display: grid;
		place-items: center;
		line-height: 1;
		margin-top: 20px;
	}

	.ghost {
		position: absolute;
		z-index: 0;
		font-size: clamp(7rem, 24vw, 13.5rem);
		font-weight: 900;
		line-height: 1;
		letter-spacing: -0.07em;
		color: var(--fg);
		user-select: none;
		pointer-events: none;
		/* The keyframe carries the final opacity: `animation-fill-mode: both`
		   makes the keyframe's end state win over a plain `opacity` here. */
		animation: ghost-in 900ms ease both;
	}

	.status-code {
		position: relative;
		z-index: 1;
		font-size: clamp(4.5rem, 16vw, 9rem);
		font-weight: 900;
		line-height: 1;
		letter-spacing: -0.045em;
		font-variant-numeric: tabular-nums;
		background: linear-gradient(150deg, var(--accent) 10%, var(--accent-2) 90%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
		animation: slide-down 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	/* If background-clip:text is unavailable the numeral would render invisible.
	   An error page is exactly the wrong place to gamble on that. */
	@supports not ((background-clip: text) or (-webkit-background-clip: text)) {
		.status-code {
			background: none;
			-webkit-text-fill-color: var(--accent);
			color: var(--accent);
		}
	}

	.container[data-theme='neon'] .status-code {
		filter: drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 45%, transparent));
		animation:
			slide-down 400ms cubic-bezier(0.16, 1, 0.3, 1) both,
			neon-pulse 3s ease-in-out 1s infinite alternate;
	}

	.container[data-theme='retro'] .status-code {
		filter: drop-shadow(0 0 12px color-mix(in srgb, var(--accent) 35%, transparent));
	}

	/* ─── Rule ────────────────────────────────────────────────────────────────*/
	.rule {
		position: relative;
		width: 72px;
		height: 1px;
		background: linear-gradient(to right, transparent, var(--accent), transparent);
		margin: 22px auto 20px;
		animation: fade-in 300ms ease both;
		animation-delay: 120ms;
	}

	.rule::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background-color: var(--accent);
		transform: translate(-50%, -50%);
	}

	/* ─── Reason phrase ───────────────────────────────────────────────────────*/
	.reason-phrase {
		font-size: clamp(1.375rem, 3.5vw, 2.125rem);
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.02em;
		color: var(--fg);
		margin-bottom: 14px;
		animation: fade-in 300ms ease both;
		animation-delay: 170ms;
	}

	.container[data-theme='retro'] .reason-phrase::after {
		content: '_';
		animation: blink 1s steps(1) infinite;
		margin-left: 3px;
		color: var(--accent);
	}

	/* ─── Message ─────────────────────────────────────────────────────────────*/
	.message {
		font-size: clamp(0.9375rem, 2vw, 1.0625rem);
		line-height: 1.6;
		color: var(--muted);
		max-width: 40ch;
		text-wrap: balance;
		animation: fade-in 300ms ease both;
		animation-delay: 220ms;
	}

	/* ─── Keyframes ───────────────────────────────────────────────────────────*/
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes ghost-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 0.05;
		}
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slide-down {
		from {
			opacity: 0;
			transform: translateY(-12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes neon-pulse {
		from {
			filter: drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 45%, transparent));
		}
		to {
			filter: drop-shadow(0 0 24px color-mix(in srgb, var(--accent) 75%, transparent));
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

	/* ─── Reduced motion ──────────────────────────────────────────────────────*/
	@media (prefers-reduced-motion: reduce) {
		.field,
		.eyebrow,
		.status-code,
		.rule,
		.reason-phrase,
		.message,
		main {
			animation: none;
			opacity: 1;
			transform: none;
		}

		.ghost {
			animation: none;
			opacity: 0.05;
		}

		.container[data-theme='neon'] .field::after {
			transform: perspective(28rem) rotateX(62deg) scale(2.4);
		}

		.container[data-theme='neon'] .status-code {
			filter: drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 45%, transparent));
		}

		.container[data-theme='retro'] .reason-phrase::after {
			animation: none;
		}
	}
</style>
