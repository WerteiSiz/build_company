import { test, expect } from '@playwright/test';

test.describe('UI: responsiveness and i18n', () => {

  test('Desktop layout shows Russian UI and navbar', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });

    await page.goto('/');

    await expect(page.getByText(/fixflow/i)).toBeVisible();
    await expect(page.getByText(/основные возможности/i)).toBeVisible();
    await expect(page.getByText(/роли пользователей/i)).toBeVisible();
  });

  test('Tablet layout adapts correctly', async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 });

    await page.goto('/');

    await expect(page.getByRole('button', { name: /начать работу/i })).toBeVisible();

    await page.getByRole('button', { name: /начать работу/i }).click();

    // current app shows TestLogin form when starting auth flow
    await expect(page.getByText(/Авторизация \(тестовая страница\)/i)).toBeVisible();
  });
});
