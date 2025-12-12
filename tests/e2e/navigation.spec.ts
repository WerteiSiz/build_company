import { test, expect } from '@playwright/test';

test.describe('SPA navigation', () => {

  test('Login → Dashboard flow works', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /начать работу/i }).click();
    await page.getByText(/выберите вашу роль/i).waitFor();

    await page.getByText(/инженер/i).click();
    await page.getByRole('button', { name: /войти/i }).click();

    await expect(page.getByText(/дашборд инженера/i)).toBeVisible();
  });
});
