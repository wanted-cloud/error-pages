import type { StatusCode } from '$lib/content';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			code: StatusCode;
			reasonPhrase: string;
			candidateMessages: readonly string[];
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
