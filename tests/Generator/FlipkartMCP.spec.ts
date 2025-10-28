// spec: planner/flipkart-s24ultra-cart-test-plan.md
import { test, expect, Page } from '@playwright/test';

test.describe('Flipkart — "S24 Ultra" Search → Select Product → Add to Cart', () => {
  test('Search and Add Single S24 Ultra to Cart (Guest)', async ({ page }) => {
    // 1. Open browser and navigate to https://www.flipkart.com
    await page.goto('https://www.flipkart.com', { waitUntil: 'domcontentloaded' });

    // 2. Close any login modal/pop-up if present.
    // (Many Flipkart pages show a login modal with a button having class _2KpZ6l _2doB4z)
    try {
      const modalClose = page.locator('button._2KpZ6l._2doB4z').first();
      if (await modalClose.count() && await modalClose.isVisible({ timeout: 2000 })) {
        await modalClose.click();
      } else {
        // fallback: an '✕' text close button sometimes appears
        const altClose = page.getByText('✕').first();
        if (await altClose.count() && await altClose.isVisible({ timeout: 2000 })) {
          await altClose.click();
        }
      }
    } catch {
      // ignore if modal not present
    }

    // 3. Locate the search input and type `s24 ultra`, then press Enter / click search.
    // Try a few common selectors for Flipkart search input
    const searchLocator = page.locator('input[name="q"], input[title*="Search"], input[placeholder*="Search"]');
    await expect(searchLocator).toBeVisible({ timeout: 5000 });
    await searchLocator.fill('s24 ultra');
    await searchLocator.press('Enter');

    // 4. On the search results (PLP), verify that results are relevant
    // Wait for results to appear; prefer product title selectors but use flexible fallback
    const resultsSelectorCandidates = [
      'a:has(div._4rR01T)', // grid title
      'a:has(div._2B099V)', // alternate
      'a:has-text("S24")',
      'a[href*="/p/"]'
    ];

    let firstResult = null;
    for (const sel of resultsSelectorCandidates) {
      const loc = page.locator(sel).first();
      if (await loc.count() > 0) {
        await loc.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
        if (await loc.isVisible().catch(() => false)) {
          firstResult = loc;
          break;
        }
      }
    }
    if (!firstResult) {
      throw new Error('Could not find a product result on PLP - selectors may need updating');
    }

    // 5. Click the first result that appears to be "Samsung Galaxy S24 Ultra" or a clear match.
    // Click and detect if product opens in a new tab or same tab.
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page').catch(() => null),
      firstResult.click()
    ]);
    const pdp: Page = newPage ?? page;
    await pdp.waitForLoadState('domcontentloaded');

    // 6. On the PDP, verify the product title contains "S24 Ultra" or "Galaxy S24 Ultra".
    // Try common title selectors; this is tolerant and will pass if any title includes S24 text.
    const titleCandidates = [
      pdp.locator('span.B_NuCI'), // common Flipkart PDP title class
      pdp.locator('h1'),
      pdp.locator('div._35KyD6')
    ];
    let titleFound = false;
    for (const t of titleCandidates) {
      if (await t.count() > 0) {
        const txt = (await t.first().innerText().catch(() => '')).trim();
        if (/s24|s24 ultra|galaxy s24 ultra/i.test(txt)) {
          titleFound = true;
          break;
        }
      }
    }
    expect(titleFound, 'PDP title should mention S24/S24 Ultra').toBeTruthy();

    // 7. If variants (color/storage) are required, select a default valid variant (e.g., 256 GB, Phantom Black).
    // We'll attempt to click the first visible variant option from a few likely selectors.
    const variantSelectors = [
      'div._2C41yO button', // possible variant container
      'ul._2-rIyh li',
      'div._1kzJVk button',
      'div.sku-selector button'
    ];
    for (const sel of variantSelectors) {
      const opt = pdp.locator(sel).first();
      if (await opt.count() > 0) {
        try {
          if (await opt.isVisible()) {
            await opt.scrollIntoViewIfNeeded();
            await opt.click({ timeout: 3000 }).catch(() => {});
            break;
          }
        } catch {
          // ignore and try next selector
        }
      }
    }

    // 8. Verify price is present and the Add to Cart button is visible and enabled.
    const priceLocator = pdp.locator('div._30jeq3, span._3nCwDW, span._16Jk6d').first();
    await expect(priceLocator).toBeVisible({ timeout: 8000 });

    // Add to Cart button
    const addToCart = pdp.getByRole('button', { name: /Add to Cart|ADD TO CART|Add to cart/i }).first();
    await expect(addToCart).toBeVisible({ timeout: 10000 });
    await expect(addToCart).toBeEnabled();

    // 9. Click "Add to Cart".
    await addToCart.click();

    // 10. Confirm navigation to the cart or a success indicator; open the cart if not auto-navigated.
    // We'll navigate to the cart page to be explicit.
    try {
      // Some pages auto-open a cart panel; wait briefly
      await pdp.waitForTimeout(1500);
      await pdp.goto('https://www.flipkart.com/cart', { waitUntil: 'domcontentloaded' });
    } catch {
      // if navigation failed, still attempt to open /cart
      await pdp.goto('https://www.flipkart.com/cart').catch(() => {});
    }

    // 11. Verify the cart contains the chosen product with correct title, selected variants, quantity = 1, and a displayed price.
    // Use flexible matching for 'S24' in cart.
    const cartPage = pdp;
    const cartItem = cartPage.locator('text=/S24|S24 Ultra|Galaxy S24 Ultra/i').first();
    await expect(cartItem).toBeVisible({ timeout: 10000 });

    // Check price presence in cart
    const cartPrice = cartPage.locator('div._1YsvA0, span._2-ut7f._1WpvJ7, div._3n_SbN').first();
    if (await cartPrice.count() > 0) {
      await expect(cartPrice).toBeVisible();
    }

    // 12. Refresh the page once and verify cart still shows the product (persistence for guest session).
    await cartPage.reload({ waitUntil: 'domcontentloaded' });
    await expect(cartItem).toBeVisible({ timeout: 8000 });

    // Extra: take a screenshot on success for record (optional)
    // await cartPage.screenshot({ path: 'flipkart-s24-cart.png' });
  });
});