import { test, expect } from '@playwright/test';

test.describe('Testbook-Style Free Guest Practice Flow', () => {
  test('should display subjects with 5 free questions badge without requiring sign-in', async ({ page }) => {
    await page.goto('/practice');

    // Page must not redirect to /auth/sign-in
    await expect(page).toHaveURL(/\/practice/);

    // Free guest banner should be visible
    await expect(page.locator('text=Attempt Free Practice Questions Instantly').first()).toBeVisible();

    // 5 free questions badge should be visible on cards
    const freeBadge = page.locator('text=5 Free Questions').first();
    await expect(freeBadge).toBeVisible();
  });

  test('should launch a practice session in free guest mode', async ({ page }) => {
    await page.goto('/practice');

    // Click the first available subject
    const subjectCard = page.locator('a[href^="/practice/"]').first();
    await expect(subjectCard).toBeVisible();
    await subjectCard.click();

    // Should load the practice session
    await expect(page).toHaveURL(/\/practice\/[a-zA-Z0-9_-]+/);

    // Free guest mode indicator must be visible
    await expect(page.locator('text=Free Guest Mode').first()).toBeVisible();
  });
});
