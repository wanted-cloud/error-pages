import { test, expect } from '@playwright/test';
import { STATUS_CODES, reasonPhrases } from '../../lib/content';

const VALID_THEMES = ['dark', 'retro', 'neon', 'minimal'] as const;

for (const code of STATUS_CODES) {
	const phrase = reasonPhrases[code];

	test(`${code} ${phrase} — smoke test`, async ({ page }) => {
		// Navigate and assert HTTP 200
		const response = await page.goto(`/${code}`);
		expect(response?.status()).toBe(200);

		// Page title contains code and reason phrase
		await expect(page).toHaveTitle(new RegExp(`${code}.*${phrase}|${phrase}.*${code}`));

		// Numeric code is visible on the page
		const statusCodeEl = page.locator('.status-code');
		await expect(statusCodeEl).toBeVisible();
		await expect(statusCodeEl).toContainText(code);

		// Reason phrase is visible on the page
		const reasonPhraseEl = page.locator('.reason-phrase');
		await expect(reasonPhraseEl).toBeVisible();
		await expect(reasonPhraseEl).toContainText(phrase);

		// Home link pointing to "/" is visible
		const homeLink = page.locator('a[href="/"]');
		await expect(homeLink).toBeVisible();

		// Wait for hydration: container must have data-theme attribute
		const container = page.locator('.container[data-theme]');
		await container.waitFor({ state: 'attached' });

		const themeValue = await container.getAttribute('data-theme');
		expect(VALID_THEMES).toContain(themeValue as (typeof VALID_THEMES)[number]);
	});
}
