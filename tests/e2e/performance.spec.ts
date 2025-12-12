import { test, expect } from '@playwright/test';

const MAX_RESPONSE_MS = 4000;

test('Page initial load time <= 1s', async ({ page }) => {
  const start = Date.now();

  await page.goto('/', { waitUntil: 'networkidle' });

  const duration = Date.now() - start;
  console.log('Load time:', duration);

  expect(duration).toBeLessThanOrEqual(MAX_RESPONSE_MS);
});
