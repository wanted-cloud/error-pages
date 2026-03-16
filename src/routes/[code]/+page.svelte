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
	<main>
		<p class="status-code" aria-hidden="true">{data.code}</p>
		<div class="divider" aria-hidden="true"></div>
		<h1 class="reason-phrase">{data.reasonPhrase}</h1>
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

	/* ─── Themes ──────────────────────────────────────────────────────────────
   Tailwind-aligned color palette. Each theme defines five tokens:
   --bg, --fg, --muted, --accent, --ring (focus ring).
   ──────────────────────────────────────────────────────────────────────── */
	.container[data-theme='dark'] {
		--bg: #0f172a; /* slate-900  */
		--fg: #f1f5f9; /* slate-100  */
		--muted: #94a3b8; /* slate-400  */
		--accent: #818cf8; /* indigo-400 */
		--ring: #6366f1; /* indigo-500 */
		--font-stack: ui-sans-serif, system-ui, -apple-system, sans-serif;
	}

	.container[data-theme='retro'] {
		--bg: #1c1917; /* stone-900  */
		--fg: #fef3c7; /* amber-100  */
		--muted: #b45309; /* amber-700  — WCAG AA on stone-900 */
		--accent: #f59e0b; /* amber-400  */
		--ring: #fbbf24; /* amber-400  */
		--font-stack: 'Courier New', Courier, monospace;
	}

	.container[data-theme='neon'] {
		--bg: #03061a; /* custom deep navy */
		--fg: #e2e8f0; /* slate-200  */
		--muted: #7c3aed; /* violet-600 — AA on near-black */
		--accent: #22d3ee; /* cyan-400   */
		--ring: #06b6d4; /* cyan-500   */
		--font-stack: ui-sans-serif, system-ui, -apple-system, sans-serif;
	}

	.container[data-theme='minimal'] {
		--bg: #ffffff;
		--fg: #0f172a; /* slate-900  */
		--muted: #64748b; /* slate-500  */
		--accent: #0f172a; /* slate-900  */
		--ring: #475569; /* slate-600  */
		--font-stack: ui-sans-serif, system-ui, -apple-system, sans-serif;
	}

	/* ─── Container ───────────────────────────────────────────────────────────*/
	.container {
		min-height: 100vh;
		min-height: 100dvh;
		background-color: var(--bg);
		color: var(--fg);
		font-family: var(--font-stack);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* ─── Card ────────────────────────────────────────────────────────────────
   Subtle inset surface for the content block. Gives the page structure
   without heavy chrome.
   ──────────────────────────────────────────────────────────────────────── */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: clamp(32px, 6vw, 64px) clamp(24px, 5vw, 48px);
		max-width: min(92vw, 560px);
		width: 100%;
		border: 1px solid color-mix(in srgb, var(--fg) 10%, transparent);
		border-radius: 16px;
		background-color: color-mix(in srgb, var(--fg) 3%, transparent);
		animation: fade-in 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	/* ─── Status code ─────────────────────────────────────────────────────────*/
	.status-code {
		font-size: clamp(4.5rem, 16vw, 9rem);
		font-weight: 900;
		line-height: 1;
		letter-spacing: -0.04em;
		background: linear-gradient(160deg, var(--accent) 30%, var(--fg));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
		margin-bottom: 8px;
		animation: slide-down 350ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	/* Neon glow — drop-shadow works on clip-text where text-shadow does not */
	.container[data-theme='neon'] .status-code {
		filter: drop-shadow(0 0 8px color-mix(in srgb, var(--accent) 50%, transparent));
		animation:
			slide-down 350ms cubic-bezier(0.16, 1, 0.3, 1) both,
			neon-pulse 3s ease-in-out 1s infinite alternate;
	}

	/* ─── Divider ─────────────────────────────────────────────────────────────*/
	.divider {
		width: 32px;
		height: 2px;
		background-color: color-mix(in srgb, var(--accent) 60%, transparent);
		border-radius: 2px;
		margin: 16px auto;
		animation: fade-in 300ms ease both;
		animation-delay: 100ms;
	}

	/* ─── Reason phrase ───────────────────────────────────────────────────────*/
	.reason-phrase {
		font-size: clamp(1.25rem, 3.5vw, 2rem);
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: -0.02em;
		color: var(--fg);
		margin-bottom: 12px;
		animation: fade-in 300ms ease both;
		animation-delay: 150ms;
	}

	.container[data-theme='retro'] .reason-phrase::after {
		content: '_';
		animation: blink 1s steps(1) infinite;
		margin-left: 2px;
	}

	/* ─── Message ─────────────────────────────────────────────────────────────*/
	.message {
		font-size: clamp(0.875rem, 2vw, 1rem);
		line-height: 1.65;
		color: var(--muted);
		max-width: 38ch;
		margin-bottom: 32px;
		animation: fade-in 300ms ease both;
		animation-delay: 200ms;
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
			filter: drop-shadow(0 0 8px color-mix(in srgb, var(--accent) 50%, transparent));
		}
		to {
			filter: drop-shadow(0 0 20px color-mix(in srgb, var(--accent) 80%, transparent));
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
		.status-code,
		.divider,
		.reason-phrase,
		.message,
		main {
			animation: none;
			opacity: 1;
			transform: none;
		}

		.container[data-theme='neon'] .status-code {
			filter: drop-shadow(0 0 8px color-mix(in srgb, var(--accent) 50%, transparent));
		}

		.container[data-theme='retro'] .reason-phrase::after {
			animation: none;
		}
	}
</style>
