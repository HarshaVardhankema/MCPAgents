// spec: planner/youtube-demo-test-plan.md
import { test, expect, Page } from '@playwright/test';

test.describe('YouTube Search and Video Selection', () => {
    test('Navigate to YouTube and select second video from search results', async ({ page }) => {
        // Step 1: YouTube Homepage Access
        await test.step('Navigate to YouTube homepage', async () => {
            await page.goto('https://www.youtube.com', { waitUntil: 'networkidle' });
            
            // Verify homepage elements
            await expect(page).toHaveTitle(/YouTube/);
            await expect(page.locator('#search-input')).toBeVisible();
        });

        // Step 2: Search Functionality
        await test.step('Perform search for iPhone 17 Pro Max', async () => {
            // Click the search box
            const searchBox = page.getByRole('searchbox', { name: 'Search' });
            await searchBox.click();
            
            // Type the search term
            await searchBox.fill('iphone 17 pro max');
            
            // Press Enter to search
            await searchBox.press('Enter');
            
            // Verify search results page
            await expect(page).toHaveURL(/\/results\?search_query=iphone/);
        });

        // Step 3: Video Selection
        await test.step('Select second video from search results', async () => {
            // Wait for video results to load
            const videoResults = page.locator('ytd-video-renderer');
            await expect(videoResults.first()).toBeVisible({ timeout: 10000 });

            // Get the second video
            const secondVideo = videoResults.nth(1);
            
            // Verify video elements
            await expect(secondVideo.locator('#thumbnail')).toBeVisible();
            await expect(secondVideo.locator('#video-title')).toBeVisible();
            
            // Get and store video title for verification
            const videoTitle = await secondVideo.locator('#video-title').textContent();
            console.log(`Selected video title: ${videoTitle}`);
            
            // Take screenshot of search results
            await page.screenshot({
                path: './test-results/search-results.png',
                fullPage: false
            });
            
            // Click the second video
            await secondVideo.click();
            
            // Verify video page loaded
            await expect(page).toHaveURL(/\/watch\?v=/);
            await expect(page.locator('#movie_player')).toBeVisible();
            
            // Take screenshot of video page
            await page.screenshot({
                path: './test-results/video-page.png',
                fullPage: false
            });
            
            // Verify video playback started
            const videoPlayer = page.locator('.html5-video-player');
            await expect(videoPlayer).toHaveClass(/playing-mode/, { timeout: 10000 });
            
            // Wait a moment to ensure video starts playing
            await page.waitForTimeout(3000);
        });
    });
});