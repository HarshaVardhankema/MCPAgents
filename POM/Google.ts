import{test,expect, Page} from "@playwright/test";

export class GooglePage{

    page : Page;

    constructor(page: Page){
        this.page = page;
    }
async goto(){
    
    await this.page.goto("https://www.google.com/");


}

}
