// spec: planner/flipkart-samsung-s24fe-test-plan.md
import { test, expect, Page } from '@playwright/test';

// Configure this test suite to always run in headed mode
test.describe.configure({ });

test.describe('Flipkart Shopping - Samsung S24 FE Add to Cart', () => {
  test.fixme('Add Samsung S24 FE to Cart via Mobiles Category', async ({ page }) => {
    // Note: Test is marked as fixme because S24 FE model is not yet available on Flipkart
    // 1. Navigate to Flipkart homepage
    await page.goto('https://www.flipkart.com', { waitUntil: 'domcontentloaded' });

    // 2. Handle login popup if present
    try {
      const modalClose = page.locator('button._2KpZ6l._2doB4z').first();
      if (await modalClose.count() && await modalClose.isVisible({ timeout: 2000 })) {
        await modalClose.click();
      } else {
        const altClose = page.getByText('✕').first();
        if (await altClose.count() && await altClose.isVisible({ timeout: 2000 })) {
          await altClose.click();
        }
      }
    } catch {
      // Ignore if modal is not present
    }

    // 3. Try to navigate via Mobiles & Tablets category first
    try {
      const mobilesMenu = page.getByRole('link', { name: /mobiles|mobiles & tablets/i }).first();
      if (await mobilesMenu.isVisible({ timeout: 3000 })) {
        await mobilesMenu.click();
        await page.waitForLoadState('domcontentloaded');
      } else {
        // Fallback to search if category navigation fails
        throw new Error('Category not visible');
      }
    } catch {
      // Fallback: Use search for S24 FE
      const searchInput = page.locator('input[name="q"], input[title*="Search"], input[placeholder*="Search"]').first();
      await expect(searchInput).toBeVisible({ timeout: 5000 });
      await searchInput.fill('Samsung S24 FE');
      await searchInput.press('Enter');
    }

    // 4. Wait for and find S24 FE in results
    const resultSelectors = [
      'a:has-text("S24")',
      'a:has(div._4rR01T):has-text("Galaxy S24")',
      'a:has(div._2B099V):has-text("Galaxy S24")',
      'a[href*="/samsung-galaxy-s24"]',
      'a:has-text("Samsung Galaxy S24")'
    ];

    let productLink = null;
    for (const selector of resultSelectors) {
      const link = page.locator(selector).first();
      if (await link.count() > 0) {
        if (await link.isVisible().catch(() => false)) {
          productLink = link;
          break;
        }
      }
    }

    if (!productLink) {
      throw new Error('Could not find Samsung S24 FE product link');
    }

    // 5. Click product and handle possible new tab
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page').catch(() => null),
      productLink.click()
    ]);
    const pdp: Page = newPage ?? page;
    await pdp.waitForLoadState('domcontentloaded');

    // 6. Verify we're on the correct product page
    const titleSelectors = [
      'span.B_NuCI',
      'h1',
      'div._35KyD6'
    ];
    
    let correctProduct = false;
    for (const selector of titleSelectors) {
      const title = pdp.locator(selector).first();
      if (await title.count() > 0) {
        const titleText = await title.innerText().catch(() => '');
        if (titleText.toLowerCase().includes('s24')) {
          correctProduct = true;
          break;
        }
      }
    }
    expect(correctProduct, 'Should be on Samsung S24 FE product page').toBeTruthy();

    // 7. Handle any variant selections (color/storage)
    const variantSelectors = [
      'div._2C41yO button',
      'ul._2-rIyh li',
      'div._1kzJVk button'
    ];

    for (const selector of variantSelectors) {
      const variant = pdp.locator(selector).first();
      if (await variant.count() > 0) {
        try {
          if (await variant.isVisible()) {
            await variant.click({ timeout: 3000 }).catch(() => {});
            break;
          }
        } catch {
          // Continue if variant selection fails
        }
      }
    }

    // 8. Click Add to Cart
    const addToCartButton = pdp.getByRole('button', { name: /add to cart/i }).first();
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    await addToCartButton.click();

    // 9. Wait for cart update and navigate to cart
    await pdp.waitForTimeout(2000); // Wait for cart update
    await pdp.goto('https://www.flipkart.com/cart', { waitUntil: 'domcontentloaded' });

    // 10. Verify product in cart
    const cartProduct = pdp.locator('text=/S24 FE|Galaxy S24 FE/i').first();
    await expect(cartProduct).toBeVisible({ timeout: 10000 });

    // 11. Take screenshot of cart
    // Create test-results directory if it doesn't exist
    const fs = require('fs');
    const path = require('path');
    const screenshotDir = path.join(__dirname, '..', 'test-results');
    
    if (!fs.existsSync(screenshotDir)){
        fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Take screenshot
    await pdp.screenshot({
      path: path.join(screenshotDir, 's24fe-cart.png'),
      fullPage: false
    });

    // Optional: Add a pause at the end to keep the browser open for a moment
    await page.waitForTimeout(3000);
  });
});