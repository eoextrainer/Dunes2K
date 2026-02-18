const { test, expect } = require('@playwright/test');

test.describe('Dunes2K App', () => {
  test('should load the main page and show menu', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await expect(page.locator('#menu-overlay')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('DUNES 2K');
  });

  test('should start quick game and show HUD', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.click('button:has-text("Quick Game")');
    await expect(page.locator('#hud')).toBeVisible();
    await expect(page.locator('.scoreboard')).toBeVisible();
  });
});
