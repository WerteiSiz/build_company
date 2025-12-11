import { test, expect } from '@playwright/test';

test.describe('Performance checks', () => {
  const MAX_RESPONSE_MS = 1000;

  test('Page initial load time should be <= 1s', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'load' });
    expect(response && response.ok()).toBeTruthy();

    const loadTime = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (nav && 'duration' in nav) return nav.duration;
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });

    console.log('Navigation duration (ms):', loadTime);
    expect(loadTime).toBeLessThanOrEqual(MAX_RESPONSE_MS);
  });
});
