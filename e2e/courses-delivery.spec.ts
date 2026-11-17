import { test, expect } from '@playwright/test';

test.describe('Course Delivery & Lessons Engine (Phase D)', () => {
    test('should display courses catalog with progress and syllabus outlines', async ({ page }) => {
        await page.goto('/courses');

        // Heading & description
        await expect(page.locator('text=Course Delivery & Lessons').first()).toBeVisible();
        await expect(page.locator('text=CUET-UG Science Stream').first()).toBeVisible();

        // Check progress bar exists
        await expect(page.locator('text=Curriculum Progress').first()).toBeVisible();

        // Click to explore syllabus
        const courseBtn = page.locator('a[href="/courses/course-science"]:visible').first();
        await courseBtn.click();
        await expect(page).toHaveURL(/\/courses\/course-science/);
    });

    test('should view course syllabus, chapters, and launch next lesson', async ({ page }) => {
        await page.goto('/courses/course-science');

        // Course title & chapters
        await expect(page.locator('h1:has-text("CUET-UG Science Stream")')).toBeVisible();
        await expect(page.locator('text=Kinematics & Newton\'s Laws').first()).toBeVisible();

        // Check resume/next lesson CTA
        const nextLessonCta = page.locator('a[href*="/courses/course-science/lessons/"]:visible').first();
        await expect(nextLessonCta).toBeVisible();
        await nextLessonCta.click();

        // Verify lesson content & KaTeX formulas
        await expect(page).toHaveURL(/\/courses\/course-science\/lessons\//);
        await expect(page.locator('text=Kinematic Equations').first()).toBeVisible();

        // Verify mark complete button is present
        const completeBtn = page.locator('button:has-text("Mark as Complete")');
        await expect(completeBtn).toBeVisible();
    });
});
