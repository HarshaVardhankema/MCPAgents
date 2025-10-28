## Flipkart — "S24 Ultra" Search  Select Product  Add to Cart
### Executive summary
This test plan covers the end-to-end guest flow of searching for "S24 Ultra" on Flipkart, selecting a product from the results, and adding it to the cart. It includes happy paths, negative/edge cases, validation and error handling checks. The goal is to validate that search, product selection, variant handling, and add-to-cart functions work as expected for a typical e-commerce purchase entry.

### Scope
- In-scope: Search, product listing page (PLP), product detail page (PDP), variant selection (color/storage), Add to Cart behavior, cart contents and persistence in a guest session.
- Out-of-scope: Checkout/payment, order placement, third-party integrations (payment gateways), account-specific promotions requiring user login (unless specified in a scenario).

### Test environment / prerequisites
- Browser: Chrome (latest), and optionally Firefox/Edge for cross-browser checks.
- Network: Normal connectivity; also run one scenario under throttled network for performance handling.
- Account: No user account required for core scenarios (guest flow). Additional scenarios include logged-in user.
- Seed data: None required. Testers should use public, live Flipkart environment unless a test environment is provided.
- Starting state: Browser cleared of cookies and local storage; no prior Flipkart session.

### Test data
- Primary search keywords: s24 ultra, Samsung Galaxy S24 Ultra
- Example variant choices: Colors (e.g., Phantom Black), Storage (e.g., 256 GB)
- Quantity: 1 (increase quantity scenarios cover >1)
- Delivery pincode (where applicable) e.g., 560001 (to validate availability)

### Test identifiers and metadata
- Project: Flipkart S24 Add-to-Cart
- File: flipkart-s24ultra-cart-test-plan.md
- Author: QA
- Estimated execution time per happy-path run: 5–8 minutes
- Priority: High for happy path; Medium for edge cases

---

## Global assumptions and notes
1. Flipkart may show an initial login modal/pop-up. Tests include steps to close/handle it.
2. Product listings and sellers may vary; tests that assert exact price must allow a price tolerance or check for price presence and currency (₹).
3. Some PDPs may open in a new tab or same tab; testers should handle both.
4. Availability, stock and seller-specific info can change frequently—tests verify behavior (in-stock vs out-of-stock) rather than fixed stock numbers.

---

## Success criteria (overall)
- User can search for "s24 ultra", open a product PDP, select required variants (if any), add the product to the cart, and see the product in the cart with correct name, selected variants, price, and quantity.
- Cart persists across a soft refresh (F5) for the guest session.
- For negative/edge scenarios, appropriate error messages or behaviors appear (e.g., out-of-stock message, variant-selection required prompt).

## Failure conditions (overall)
- Add to Cart button does nothing or throws unhandled errors.
- Wrong product or mismatched variant added to cart.
- Cart shows inconsistent pricing or zero quantity after add.
- Unexpected redirect to login without explanation for guest add-to-cart.

---

## Test Scenarios

### 1. Happy path — Search and Add Single S24 Ultra to Cart (Guest)
Assumptions: Fresh guest browser session, no pop-ups preventing interaction.

Steps:
1. Open browser and navigate to https://www.flipkart.com
2. Close any login modal/pop-up if present.
3. Locate the search input and type s24 ultra, then press Enter / click search.
4. On the search results (PLP), verify that results are relevant (items listed contain "S24", "S24 Ultra", or "Samsung").
5. Click the first result that appears to be "Samsung Galaxy S24 Ultra" or a clear match.
6. On the PDP, verify the product title contains "S24 Ultra" or "Galaxy S24 Ultra".
7. If variants (color/storage) are required, select a default valid variant (e.g., 256 GB, Phantom Black).
8. Verify price is present and the Add to Cart button is visible and enabled.
9. Click "Add to Cart".
10. Confirm navigation to the cart or a success indicator; open the cart if not auto-navigated.
11. Verify the cart contains the chosen product with correct title, selected variants, quantity = 1, and a displayed price.
12. Refresh the page once and verify cart still shows the product (persistence for guest session).

Expected results:
- Search returns relevant results.
- PDP opens and shows correct title and variant options.
- Add to Cart succeeds and the cart lists the correct item and variant.
- Cart persists after soft refresh.

Success criteria:
- All verifications pass; add-to-cart action leads to cart update.

---

### 2. Variant required — Prevent add-to-cart when a mandatory variant is not selected
Assumptions: PDP has mandatory variant selections.

Steps:
1. Navigate to PDP of an S24 Ultra product (as above).
2. Do NOT select a mandatory variant (e.g., color).
3. Attempt to click "Add to Cart".

Expected results:
- Either "Add to Cart" should be disabled or a validation message prompts user to choose the variant.
- Product is not added to the cart.

Failure condition:
- Product added with missing variant or wrong default assumed without user action.

---

### 3. Out-of-stock scenario handling
Assumptions: Select a seller/variant that is out-of-stock or simulate by using a known OOS variant if available.

Steps:
1. From the PDP, choose a variant marked out-of-stock (if available).
2. Attempt to add to cart or check how the UI presents OOS state.

Expected results:
- UI shows "Out of stock", "Notify Me", or disables Add to Cart.
- No items added to cart.

---

### 4. Add to cart while login modal blocks interaction
Assumptions: Flipkart sometimes shows a login modal on landing.

Steps:
1. Open Flipkart and allow login modal to appear.
2. Attempt searching and adding to cart while modal is visible (without closing).
3. Close modal and retry if blocked.

Expected results:
- Modal either must be dismissible or the flow indicates how to proceed.
- Add-to-cart must only function after user dismisses or completes required action.
- If modal forces login for add-to-cart, document exact behavior.

---

### 5. Quantity change in cart and stock-limit handling
Assumptions: Product supports quantity >1 and seller has limited stock.

Steps:
1. Add 1 item to cart (happy path).
2. In cart, increment quantity to 2 or more.
3. Observe behavior when requesting quantity greater than allowed stock.

Expected results:
- Quantity increases and cart total updates accordingly if stock permits.
- If exceeding stock, display message or limit quantity to available stock.

---

### 6. Price consistency between PDP and Cart
Assumptions: Price shown on PDP may include seller-specific discounts; cart can show final price.

Steps:
1. On PDP, note the displayed price and any discounts/coupon markers.
2. Add to cart.
3. In cart, verify price equals PDP price or differences are explained (taxes, shipping).
4. Apply any visible coupon (optional) and verify price recalculation.

Expected results:
- Price in cart is consistent with PDP or clear breakdown is shown.
- No unexpected jumps in price without explanation.

---

### 7. Cross-tab behavior (PDP opened in new tab)
Assumptions: PDP may open in same or new tab/window.

Steps:
1. From PLP, open a product in a new tab.
2. Interact in both tabs: add to cart in one, check cart in the other, refresh as needed.

Expected results:
- Cart state syncs reasonably between tabs (guest session behavior may be sessionStorage/localStorage/cookie based).
- No data loss or duplication after add/refresh operations.

---

### 8. Network/timeout resilience (throttled)
Assumptions: Simulate slow network.

Steps:
1. Use browser devtools to set network to "Slow 3G" or equivalent.
2. Repeat happy-path test and observe UI behavior (loaders, timeouts).
3. Attempt Add to Cart.

Expected results:
- UI shows loaders; add-to-cart completes without silent failure.
- If timeout occurs, app shows meaningful error and allows retry.

---

### 9. Logged-in user (optional): Add to cart and verify account persistence
Assumptions: Valid Flipkart test account available.

Steps:
1. Log in with a test account.
2. Search and add S24 Ultra to cart.
3. Log out and back in (or log in on another device) and verify cart persistence across sessions if expected.

Expected results:
- For logged-in users, cart persists across sessions per Flipkart behavior, or documented otherwise.

---

### 10. Negative input — invalid search term and result handling
Steps:
1. Search for an invalid or misspelled term s24-ultra-xyz-123456.
2. Observe results and suggestions.

Expected results:
- Reasonable "no results" view or suggestions shown.
- No app crash or unexpected UI behavior.

---

## Test case template (for each scenario)
- Test ID: FPK-ADD-001 (increment as needed)
- Title: Brief descriptive title
- Preconditions: Browser cleared, user state, test data
- Steps: Numbered steps as above
- Expected results: Pass/fail criteria
- Actual result: (tester fills)
- Status: Pass/Fail
- Notes: Environment, observations, screenshots if failure

---

## Edge cases to include as additional tests
- Seller-specific carts (multiple sellers with different shipping times)
- Promotions or coupons applied on PDP vs cart
- Partial add-to-cart where PDP says "Buy Now" vs "Add to Cart"
- Browser extensions interfering with Add to Cart (ad-blockers)
- Locale/pincode mismatch producing "Not deliverable" messages

---

## Automation considerations
- Prefer automating the happy path and variant-required scenarios first.
- Use stable selectors: data-test-id or aria labels where possible. Avoid brittle CSS selectors based on index.
- Add retry logic for transient network flakiness and explicit waits for elements (search results, add-to-cart confirmation).
- For CI, mock or sandbox checkout flow—do not trigger real purchases.

---

## Cleanup
- Remove test items from cart after each test where possible (or use session isolation).
- Clear cookies/local storage between tests unless testing persistence.

---

## Reporting and logging
- Capture screenshots and logs on failures.
- Record PDP title, price, variant selected, seller name, and cart ID if present.
- Log response times for search, PDP load, and add-to-cart action.

---

## Summary / Next steps
- Execute the happy path manually and mark it as a high priority automation candidate.
- Triage any UI blocks (e.g., forced login modals) and coordinate with dev if they block automation.
- Optionally create Playwright scripts for automated happy-path with explicit waits and selectors.
