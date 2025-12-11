import { test, expect } from '@playwright/test';

test.describe('UI: responsiveness and i18n', () => {

  test('Desktop layout should show main nav and Russian texts', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/', { waitUntil: 'networkidle' });

    const russianText = page.locator('text=Создать дефект');
    await expect(russianText).toBeVisible();
  });

  test('Tablet layout should adapt', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/', { waitUntil: 'networkidle' });

    const createBtn = page.locator('button:has-text("Создать дефект")');
    await expect(createBtn).toBeVisible();
  });

});
