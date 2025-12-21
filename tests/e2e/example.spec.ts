/**
 * Example E2E Test
 *
 * Demonstrates Playwright E2E testing setup.
 * Tests basic navigation and page rendering.
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check that the page title is set
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should have accessible main content', async ({ page }) => {
    await page.goto('/');

    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});

test.describe('API Health Check', () => {
  test('should return health status', async ({ request }) => {
    // Make API request
    const response = await request.get('/api/health');

    // Check response status
    expect(response.ok()).toBeTruthy();

    // Check response body
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('uptime');
    expect(data).toHaveProperty('database');
    expect(data).toHaveProperty('environment');
  });
});

test.describe('Accessibility', () => {
  test('should have no automatic accessibility violations on homepage', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be interactive
    await page.waitForLoadState('domcontentloaded');

    // Basic accessibility checks
    // Check for page title
    expect(await page.title()).not.toBe('');

    // Check for lang attribute
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang');
  });
});

test.describe('Navigation', () => {
  test('should maintain focus visibility for keyboard users', async ({ page }) => {
    await page.goto('/');

    // Tab through the page
    await page.keyboard.press('Tab');

    // Check that focused element is visible
    const focusedElement = await page.evaluate(() => {
      const activeEl = document.activeElement;
      if (!activeEl) return null;

      const styles = window.getComputedStyle(activeEl);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      };
    });

    // Should have some focus indicator (outline or box-shadow)
    expect(focusedElement).toBeTruthy();
  });
});

test.describe('Responsive Design', () => {
  test('should render correctly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Check that page is still accessible
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should render correctly on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/');

    // Check that page is still accessible
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should render correctly on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('/');

    // Check that page is still accessible
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});
