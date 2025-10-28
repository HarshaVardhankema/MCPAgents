import{test,expect}from "@playwright/test"

test('Test',async({browser})=>{

    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');

    await page.locator("[type='button']").nth(2).click();
    await page.locator('a[href="#"]').nth(7).click();
 await page.locator("[type='button']").nth(3).click();




})