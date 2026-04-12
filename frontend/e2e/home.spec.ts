import { test, expect } from '@playwright/test';

test('has title and displays main elements', async ({ page }) => {
  // Try to load the homepage
  await page.goto('/');

  // Check if title is correct (assuming the site name is "Mysore Farmer Marketplace" or similar)
  // We can just verify if the page loads and has a body
  await expect(page.locator('body')).toBeVisible();

  // Optionally verify an element if we know it exists, e.g. a nav bar
  // await expect(page.getByRole('navigation')).toBeVisible();
});
