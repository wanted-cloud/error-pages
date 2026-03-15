import { describe, it, expect } from 'vitest';
import { STATUS_CODES, THEMES, isStatusCode, reasonPhrases, messages } from './content';

describe('STATUS_CODES', () => {
	it('has exactly 8 entries', () => {
		expect(STATUS_CODES).toHaveLength(8);
	});

	it('contains the exact set of expected codes', () => {
		expect([...STATUS_CODES]).toEqual(['400', '401', '403', '404', '500', '502', '503', '504']);
	});
});

describe('THEMES', () => {
	it('has exactly 4 entries', () => {
		expect(THEMES).toHaveLength(4);
	});

	it('contains the exact set of expected theme names', () => {
		expect([...THEMES]).toEqual(['dark', 'retro', 'neon', 'minimal']);
	});
});

describe('reasonPhrases', () => {
	it.each([...STATUS_CODES])('reasonPhrases[%s] exists and is a non-empty string', (code) => {
		const phrase = reasonPhrases[code];
		expect(typeof phrase).toBe('string');
		expect(phrase.length).toBeGreaterThan(0);
	});
});

describe('messages', () => {
	it.each([...STATUS_CODES])('messages[%s] is an array with 4–7 non-empty string items', (code) => {
		const msgs = messages[code];
		expect(Array.isArray(msgs)).toBe(true);
		expect(msgs.length).toBeGreaterThanOrEqual(4);
		expect(msgs.length).toBeLessThanOrEqual(7);
		for (const msg of msgs) {
			expect(typeof msg).toBe('string');
			expect(msg.length).toBeGreaterThan(0);
		}
	});
});

describe('isStatusCode', () => {
	it('returns true for all 8 valid status codes', () => {
		for (const code of STATUS_CODES) {
			expect(isStatusCode(code)).toBe(true);
		}
	});

	it('returns false for invalid string "999"', () => {
		expect(isStatusCode('999')).toBe(false);
	});

	it('returns false for invalid string "200"', () => {
		expect(isStatusCode('200')).toBe(false);
	});

	it('returns false for empty string ""', () => {
		expect(isStatusCode('')).toBe(false);
	});

	it('returns false for number 0', () => {
		expect(isStatusCode(0)).toBe(false);
	});

	it('returns false for null', () => {
		expect(isStatusCode(null)).toBe(false);
	});

	it('returns false for undefined', () => {
		expect(isStatusCode(undefined)).toBe(false);
	});

	it('returns false for boolean false', () => {
		expect(isStatusCode(false)).toBe(false);
	});
});
