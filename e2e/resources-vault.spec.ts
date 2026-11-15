import { test, expect } from '@playwright/test';

test.describe('100% Free Study & PYQ Vault', () => {
  test('should load resources vault for guests without sign-in', async ({ page }) => {
    await page.goto('/resources');

    // Page must not redirect to sign-in
    await expect(page).toHaveURL(/\/resources/);
    await expect(page.locator('text=100% Free Study Vault').first()).toBeVisible();

    // Check exam track pills
    await expect(page.locator('text=Class 12 Boards').first()).toBeVisible();
    await expect(page.locator('text=JEE (Main & Adv)').first()).toBeVisible();
    await expect(page.locator('text=NEET-UG').first()).toBeVisible();
  });

  test('should allow switching exam tracks via URL query or pills', async ({ page }) => {
    await page.goto('/resources?exam=JEE');
    await expect(page.locator('text=JEE (Main & Adv) Vault').first()).toBeVisible();

    await page.goto('/resources?exam=NEET');
    await expect(page.locator('text=NEET-UG Vault').first()).toBeVisible();
  });
});
