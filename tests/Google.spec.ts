import { test,expect} from '@playwright/test';
import { DataManagerPage } from '../POM/DataManger';

test('Google Test', async ({browser})=>{

    const context = await browser.newContext();
  const page = await context.newPage(); 
    const dataManagerPage = new DataManagerPage(page);

    const Website = dataManagerPage.googlePage;
    const YoutubeSite = dataManagerPage.Youtube;







    await Website.goto();
    await YoutubeSite.Youtube();
    

});