import { test, expect } from '@playwright/test';

test.describe('Basic security checks (frontend)', () => {

  test('Password inputs use type="password"', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle' });
    const passInput = page.locator('input[type="password"]');
    await expect(passInput).toHaveCount(1);
  });

  test('CSRF token present in forms (meta or hidden input)', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle' });
    const meta = await page.locator('meta[name="csrf-token"]');
    const csrfInput = await page.locator('input[name="_csrf"]');
    expect(await meta.count() + await csrfInput.count()).toBeGreaterThan(0);
  });

  test('Basic XSS injection attempt does not execute', async ({ page }) => {
    await page.goto('/defects/new', { waitUntil: 'networkidle' });

    const descSelector = 'textarea[name="description"]';
    const payload = '<img src=x onerror="window.__xss_executed = true" />';

    await page.fill(descSelector, payload);
    await page.click('button:has-text("Сохранить")');
    await page.waitForLoadState('networkidle');

    const xssExecuted = await page.evaluate(() => !!(window as any).__xss_executed);
    expect(xssExecuted).toBeFalsy();
  });

});
