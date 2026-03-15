import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { isStatusCode, reasonPhrases, messages } from '$lib/content';

export const prerender = true;
export const csr = true;

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
