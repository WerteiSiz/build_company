import { test, expect } from '@playwright/test';

test.describe('SPA navigation', () => {

  test('Login → Dashboard flow works', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /начать работу/i }).click();

    // TestLogin page is shown in current app; fill demo credentials
    await page.getByText(/Авторизация \(тестовая страница\)/i).waitFor();
    await page.getByLabel(/логин/i).fill('engineer');
    await page.getByLabel(/пароль/i).fill('demo');
    await page.getByRole('button', { name: /войти/i }).click();

    await expect(page.getByText(/дашборд инженера/i)).toBeVisible();
  });
});
