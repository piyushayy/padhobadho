import { test, expect } from '@playwright/test';

test.describe('Mobile Viewport & Drawer Layering', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should open and close mobile drawer cleanly without content overlap', async ({ page }) => {
    await page.goto('/practice');

    // Find and click the burger menu button
    const burgerButton = page.locator('button[aria-label="Open mobile menu"]');
    await expect(burgerButton).toBeVisible();
    await burgerButton.click();

    // Drawer panel and close button should be visible
    const closeButton = page.locator('button[aria-label="Close mobile menu"]');
    await expect(closeButton).toBeVisible();

    // Drawer links must be visible
    await expect(page.locator('a:has-text("Mock Tests"):visible').first()).toBeVisible();
    await expect(page.locator('a:has-text("Library"):visible').first()).toBeVisible();

    // Click close button
    await closeButton.click();
    await expect(closeButton).not.toBeVisible();
  });
});
