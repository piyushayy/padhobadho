import { test, expect } from '@playwright/test';

test.describe('Landing Page & Public Flow', () => {
  test('should load the homepage with brand header and target exams', async ({ page }) => {
    await page.goto('/');

    // Title and branding
    await expect(page).toHaveTitle(/PadhoBadho/i);
    await expect(page.locator('text=pb.').first()).toBeVisible();

    // CTA button to practice
    const practiceLink = page.locator('a[href="/practice"]').first();
    await expect(practiceLink).toBeVisible();

    // Target Exams section
    await expect(page.locator('text=Target Exams').first()).toBeVisible();
  });

  test('should navigate from landing to free practice catalog', async ({ page }) => {
    await page.goto('/');
    const practiceLink = page.locator('a[href="/practice"]').first();
    await practiceLink.click();
    await expect(page).toHaveURL(/\/practice/);
    await expect(page.locator('text=Free Trial Mode').first()).toBeVisible();
  });
});
