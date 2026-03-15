// Status codes as string union (matches SvelteKit params which are always strings)
export type StatusCode = '400' | '401' | '403' | '404' | '500' | '502' | '503' | '504';
export type ThemeName = 'dark' | 'retro' | 'neon' | 'minimal';

export const STATUS_CODES: readonly StatusCode[] = [
	'400',
	'401',
	'403',
	'404',
	'500',
	'502',
	'503',
	'504'
];
export const THEMES: readonly ThemeName[] = ['dark', 'retro', 'neon', 'minimal'];

export function isStatusCode(value: unknown): value is StatusCode {
	return typeof value === 'string' && (STATUS_CODES as readonly string[]).includes(value);
}

export const reasonPhrases: Readonly<Record<StatusCode, string>> = {
	'400': 'Bad Request',
	'401': 'Unauthorized',
	'403': 'Forbidden',
	'404': 'Not Found',
	'500': 'Internal Server Error',
	'502': 'Bad Gateway',
	'503': 'Service Unavailable',
	'504': 'Gateway Timeout'
};

// 4-7 funny/witty IT-themed messages per status code
export const messages: Readonly<Record<StatusCode, readonly string[]>> = {
	'400': [
		'Your request had one job. One.',
		'Garbage in, garbage out. Classic.',
		'Even the parser threw its hands up.',
		"Malformed? That's a generous word for this.",
		'Did you just try to send JSON with trailing commas?'
	],
	'401': [
		'You shall not pass. Token not found.',
		'Nice try. Authentication required.',
		"No credentials, no access. This isn't a trust fall.",
		'Your session expired. Classic you.',
		'401: The bouncer says no.',
		'Are you even on the list?'
	],
	'403': [
		"You're logged in. You're just not welcome here.",
		'Access denied. This area is above your pay grade.',
		"You have the key. You just can't open this door.",
		'Forbidden. As in, we know who you are and still said no.',
		'403: Closer than 401, but still no.'
	],
	'404': [
		'We searched under every couch cushion. Nothing.',
		'The page is in another castle.',
		'404: The URL you entered exists only in your imagination.',
		"Whoever moved this didn't leave a forwarding address.",
		'Have you tried turning the URL off and on again?',
		'It was here. We promise. Probably.'
	],
	'500': [
		'Something exploded on our end. Working on it.',
		'This is fine. (It is not fine.)',
		'The server achieved enlightenment and ceased to exist.',
		'An engineer will be paged. They will not be happy.',
		'Production is a place of learning and growth.',
		'git blame is running. Silence fills the room.',
		'We broke it. We own it.'
	],
	'502': [
		'The upstream service has left the building.',
		'We knocked. Nobody answered.',
		'Bad Gateway: the middle-man dropped the ball.',
		'Something between you and the answer is very broken.',
		'502: A perfect storm of two services failing at once.'
	],
	'503': [
		'Back in five minutes. (Estimate not guaranteed.)',
		'The service is temporarily indisposed.',
		"We're at capacity. Everyone is having a bad day.",
		'503: Even infrastructure needs a coffee break.',
		'All circuits are busy. Have you tried writing a letter?',
		'Autoscaling is working on it. Slowly.'
	],
	'504': [
		'The upstream took too long. We gave up waiting.',
		'Gateway timeout: patience has left the chat.',
		'Somewhere, a slow database query is to blame.',
		"We waited. And waited. And then didn't.",
		'504: A perfect metaphor for the modern enterprise.'
	]
};
