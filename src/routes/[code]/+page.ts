import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { isStatusCode, reasonPhrases, messages } from '$lib/content';

export const prerender = true;
// Error pages are served at arbitrary URLs by Traefik's errors middleware.
// Disabling CSR prevents SvelteKit's client router from running, which would
// try to match the browser URL against [code] and fail with 'Unknown error code'.
export const csr = false;

export const load: PageLoad = ({ params }) => {
	const { code } = params;

	if (!isStatusCode(code)) {
		error(404, `Unknown error code: ${code}`);
	}

	return {
		code,
		reasonPhrase: reasonPhrases[code],
		candidateMessages: messages[code]
	};
};
