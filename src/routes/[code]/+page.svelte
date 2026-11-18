<script lang="ts">
	import type { PageData } from './$types';
	import { THEMES } from '$lib/content';

	let { data }: { data: PageData } = $props();

	// 4xx is the caller's to fix, 5xx is ours — the eyebrow says which, and a 5xx dot pulses.
	const kind = $derived(data.code.startsWith('5') ? 'server' : 'client');
	const kindLabel = $derived(kind === 'server' ? 'Server error' : 'Client error');
</script>

<svelte:head>
	<title>{data.code} {data.reasonPhrase}</title>
	<link rel="icon" href="https://wanted.solutions/assets/branding/favicon.ico" />
</svelte:head>

<div class="container" data-theme={THEMES[0]} data-kind={kind} id="ep-root">
	<div class="field" aria-hidden="true"><div class="horizon"></div></div>
	<main>
		<p class="eyebrow" aria-hidden="true">
			<span class="dot"></span>HTTP&nbsp;{data.code}<span class="sep">·</span>{kindLabel}
		</p>

		<div class="code-stack">
			<span class="halo" aria-hidden="true"></span>
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
     --surface / --edge / --shadow  the card fill, its hairline and its lift
     --field-a / --field-b          the two background washes
     --grid                         the structural line colour
     --glow                         text glow (none outside retro)
     --font-stack
   ──────────────────────────────────────────────────────────────────────── */

	/* Courier is what `monospace` resolves to on most Linux and Windows boxes,
	   and it is what made the eyebrow look like a typewriter. Name the good
	   monospace faces explicitly before falling back. */
	.container {
		--mono:
			ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'Cascadia Mono', 'Liberation Mono',
			'DejaVu Sans Mono', monospace;
		--sans:
			ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
			sans-serif;
		--glow: none;
	}

	/* dark — deep slate, cool indigo→sky light source from the top-left. */
	.container[data-theme='dark'] {
		--bg: #0b1120;
		--fg: #e2e8f0; /* slate-200 — 14.0:1 on --bg */
		--muted: #97a5ba; /* 7.4:1 on --bg  */
		--accent: #a5b4fc; /* indigo-300 */
		--accent-2: #38bdf8; /* sky-400    */
		--surface: rgba(15, 23, 42, 0.55);
		--edge: rgba(226, 232, 240, 0.09);
		--shadow: 0 30px 80px -20px rgba(2, 6, 23, 0.8), 0 0 0 1px rgba(2, 6, 23, 0.4);
		--field-a: rgba(99, 102, 241, 0.2); /* indigo wash */
		--field-b: rgba(14, 165, 233, 0.12); /* sky wash    */
		--grid: rgba(226, 232, 240, 0.045);
		--font-stack: var(--sans);
	}

	/* retro — amber CRT. Scanlines, vignette, phosphor glow, blinking cursor. */
	.container[data-theme='retro'] {
		--bg: #110d08;
		--fg: #fde68a; /* amber-200 — 12.6:1 on --bg */
		--muted: #d8a657; /* 7.6:1 */
		--accent: #f59e0b; /* amber-500 */
		--accent-2: #fde68a; /* amber-200 */
		--surface: rgba(28, 20, 10, 0.6);
		--edge: rgba(245, 158, 11, 0.28);
		--shadow: 0 0 0 1px rgba(0, 0, 0, 0.5), 0 0 60px -10px rgba(245, 158, 11, 0.18);
		--field-a: rgba(245, 158, 11, 0.13);
		--field-b: rgba(120, 53, 15, 0.25);
		--grid: rgba(253, 230, 138, 0.055);
		--glow: 0 0 6px rgba(245, 158, 11, 0.45);
		--font-stack: var(--mono);
	}

	/* neon — synthwave. Horizon line, cyan→pink numeral, perspective floor. */
	.container[data-theme='neon'] {
		--bg: #05010f;
		--fg: #ecfeff; /* cyan-50 — 17.9:1 on --bg */
		--muted: #b4a0f5; /* violet — 7.1:1 on --bg  */
		--accent: #22d3ee; /* cyan-400   */
		--accent-2: #f472b6; /* pink-400   */
		--surface: rgba(10, 4, 28, 0.6);
		--edge: rgba(34, 211, 238, 0.25);
		--shadow: 0 0 0 1px rgba(0, 0, 0, 0.6), 0 0 80px -20px rgba(217, 70, 239, 0.45);
		--field-a: rgba(217, 70, 239, 0.22); /* magenta sky */
		--field-b: rgba(34, 211, 238, 0.14); /* cyan rim    */
		--grid: rgba(34, 211, 238, 0.16);
		--font-stack: var(--sans);
	}

	/* minimal — paper. Hairline grid, ink numeral, one red accent. */
	.container[data-theme='minimal'] {
		--bg: #f6f5f2;
		--fg: #1c1917; /* stone-900 — 15.6:1 on --bg */
		--muted: #57534e; /* stone-600 — 7.3:1 on --bg  */
		--accent: #b91c1c; /* red-700 */
		--accent-2: #1c1917; /* stone-900 */
		--surface: rgba(255, 255, 255, 0.82);
		--edge: rgba(28, 25, 23, 0.1);
		--shadow: 0 1px 2px rgba(28, 25, 23, 0.06), 0 24px 60px -24px rgba(28, 25, 23, 0.18);
		--field-a: rgba(185, 28, 28, 0.05);
		--field-b: rgba(28, 25, 23, 0.035);
		--grid: rgba(28, 25, 23, 0.06);
		--font-stack: var(--sans);
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
		-webkit-font-smoothing: antialiased;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px 16px;
		overflow: hidden;
	}

	/* ─── Background field ────────────────────────────────────────────────────
   Two coloured washes plus a structural layer, all pure CSS gradients —
   no images, nothing to fetch. The whole point of an error page is that it
   renders when the rest of the estate does not.
   ──────────────────────────────────────────────────────────────────────── */
	.field {
		position: absolute;
		inset: 0;
		z-index: -1;
		background:
			radial-gradient(56rem 34rem at 15% -8%, var(--field-a), transparent 70%),
			radial-gradient(48rem 32rem at 92% 108%, var(--field-b), transparent 70%);
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
		background-size: 64px 64px;
		background-position: center;
		mask-image: radial-gradient(60% 55% at 50% 50%, #000 15%, transparent 100%);
		-webkit-mask-image: radial-gradient(60% 55% at 50% 50%, #000 15%, transparent 100%);
	}

	.horizon {
		display: none;
	}

	/* retro — CRT scanlines instead of a grid, plus a deep vignette. */
	.container[data-theme='retro'] .field::after {
		background-image: repeating-linear-gradient(to bottom, var(--grid) 0 1px, transparent 1px 3px);
		background-size: auto;
		mask-image: none;
		-webkit-mask-image: none;
	}

	.container[data-theme='retro'] .field {
		box-shadow: inset 0 0 18rem 4rem rgba(0, 0, 0, 0.65);
	}

	/* neon — a receding floor grid meeting a glowing horizon line. */
	.container[data-theme='neon'] .field::after {
		top: 62%;
		background-size: 36px 36px;
		mask-image: linear-gradient(to bottom, transparent 0%, #000 45%);
		-webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 45%);
		transform: perspective(18rem) rotateX(58deg) scale(1.8);
		transform-origin: 50% 0;
	}

	.container[data-theme='neon'] .horizon {
		display: block;
		position: absolute;
		inset-inline: 0;
		top: 62%;
		height: 1px;
		background: linear-gradient(
			to right,
			transparent,
			var(--accent-2) 30%,
			var(--accent) 70%,
			transparent
		);
		box-shadow:
			0 0 12px 1px color-mix(in srgb, var(--accent-2) 60%, transparent),
			0 -40px 120px 20px rgba(217, 70, 239, 0.12);
	}

	/* minimal — a tighter, flatter grid; paper rather than space. */
	.container[data-theme='minimal'] .field::after {
		background-size: 24px 24px;
		mask-image: radial-gradient(75% 65% at 50% 50%, #000 25%, transparent 100%);
		-webkit-mask-image: radial-gradient(75% 65% at 50% 50%, #000 25%, transparent 100%);
	}

	/* ─── Card ────────────────────────────────────────────────────────────────*/
	main {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: clamp(32px, 5vw, 52px) clamp(20px, 5vw, 52px) clamp(32px, 5vw, 48px);
		max-width: 560px;
		width: 100%;
		border: 1px solid var(--edge);
		border-radius: 24px;
		background-color: var(--surface);
		box-shadow: var(--shadow);
		-webkit-backdrop-filter: blur(14px) saturate(140%);
		backdrop-filter: blur(14px) saturate(140%);
		animation: rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	/* A single highlight along the top edge — reads as a light source rather
	   than as a border. */
	main::before {
		content: '';
		position: absolute;
		inset-inline: 18%;
		top: -1px;
		height: 1px;
		background: linear-gradient(to right, transparent, var(--accent), transparent);
		opacity: 0.7;
	}

	.container[data-theme='minimal'] main::before {
		opacity: 0.35;
	}

	/* ─── Eyebrow ─────────────────────────────────────────────────────────────*/
	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--mono);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
		padding: 5px 12px 5px 10px;
		border: 1px solid var(--edge);
		border-radius: 999px;
		background: color-mix(in srgb, var(--fg) 3%, transparent);
		animation: fade-in 300ms ease both;
	}

	.sep {
		opacity: 0.5;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: var(--accent);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent);
	}

	/* 5xx: something of OURS is down — the dot breathes. */
	.container[data-kind='server'] .dot {
		animation: pulse 1.8s ease-in-out infinite;
	}

	/* ─── Status code ─────────────────────────────────────────────────────────
   A soft accent halo behind the gradient numeral gives depth without the
   doubled outline a second numeral produced.
   ──────────────────────────────────────────────────────────────────────── */
	.code-stack {
		position: relative;
		display: grid;
		place-items: center;
		line-height: 1;
		margin-top: clamp(16px, 3vw, 24px);
	}

	.halo {
		position: absolute;
		z-index: 0;
		width: 80%;
		height: 70%;
		border-radius: 50%;
		background: radial-gradient(
			closest-side,
			color-mix(in srgb, var(--accent) 35%, transparent),
			color-mix(in srgb, var(--accent-2) 12%, transparent) 60%,
			transparent
		);
		filter: blur(28px);
		animation: fade-in 900ms ease both;
	}

	/* On paper a glow reads as a smudge, not as light. */
	.container[data-theme='minimal'] .halo {
		display: none;
	}

	.status-code {
		position: relative;
		z-index: 1;
		font-family: var(--sans);
		font-size: clamp(5.5rem, 22vw, 10rem);
		font-weight: 800;
		line-height: 0.9;
		letter-spacing: -0.06em;
		/* Optical centring: negative tracking leaves the trailing gap on the right. */
		padding-left: 0.06em;
		font-variant-numeric: tabular-nums;
		background: linear-gradient(160deg, var(--accent) 15%, var(--accent-2) 85%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
		animation: slide-down 450ms cubic-bezier(0.16, 1, 0.3, 1) both;
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

	.container[data-theme='retro'] .status-code {
		font-family: var(--mono);
		font-weight: 700;
		letter-spacing: -0.02em;
		padding-left: 0;
		filter: drop-shadow(0 0 14px color-mix(in srgb, var(--accent) 45%, transparent));
	}

	.container[data-theme='neon'] .status-code {
		filter: drop-shadow(0 0 12px color-mix(in srgb, var(--accent) 45%, transparent));
		animation:
			slide-down 450ms cubic-bezier(0.16, 1, 0.3, 1) both,
			neon-pulse 3s ease-in-out 1s infinite alternate;
	}

	/* ─── Rule ────────────────────────────────────────────────────────────────*/
	.rule {
		width: 48px;
		height: 2px;
		border-radius: 2px;
		background: linear-gradient(to right, var(--accent), var(--accent-2));
		margin: clamp(20px, 3vw, 28px) auto clamp(16px, 2.5vw, 20px);
		animation: grow 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: 150ms;
	}

	.container[data-theme='minimal'] .rule {
		background: var(--accent);
	}

	/* ─── Reason phrase ───────────────────────────────────────────────────────*/
	.reason-phrase {
		font-size: clamp(1.375rem, 4vw, 1.875rem);
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: -0.02em;
		color: var(--fg);
		text-shadow: var(--glow);
		text-wrap: balance;
		margin-bottom: 10px;
		animation: fade-up 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: 180ms;
	}

	.container[data-theme='retro'] .reason-phrase {
		letter-spacing: 0;
	}

	.container[data-theme='retro'] .reason-phrase::after {
		content: '_';
		animation: blink 1s steps(1) infinite;
		margin-left: 2px;
		color: var(--accent);
	}

	/* ─── Message ─────────────────────────────────────────────────────────────*/
	.message {
		font-size: clamp(0.9375rem, 2.2vw, 1.0625rem);
		line-height: 1.6;
		color: var(--muted);
		text-shadow: var(--glow);
		max-width: 44ch;
		text-wrap: balance;
		animation: fade-up 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: 240ms;
	}

	.container[data-theme='retro'] .message {
		font-size: clamp(0.875rem, 2vw, 0.9688rem);
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

	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(12px) scale(0.985);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes slide-down {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes grow {
		from {
			opacity: 0;
			transform: scaleX(0);
		}
		to {
			opacity: 1;
			transform: scaleX(1);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent);
		}
		50% {
			box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent) 0%, transparent);
		}
	}

	@keyframes neon-pulse {
		from {
			filter: drop-shadow(0 0 12px color-mix(in srgb, var(--accent) 45%, transparent));
		}
		to {
			filter: drop-shadow(0 0 26px color-mix(in srgb, var(--accent) 75%, transparent));
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
		.halo,
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

		.container[data-kind='server'] .dot {
			animation: none;
		}

		.container[data-theme='neon'] .status-code {
			filter: drop-shadow(0 0 12px color-mix(in srgb, var(--accent) 45%, transparent));
		}

		.container[data-theme='retro'] .reason-phrase::after {
			animation: none;
		}
	}
</style>
