import{test,expect,Page, Locator} from "@playwright/test";

export class YoutubePage{

    page : Page;
    youtube : Locator;

    constructor(page:Page){

        this.page = page;
        this.youtube = page.locator("");

    }

    async Youtube(){

        await this.page.goto("https://www.youtube.com/");
       // await this.youtube.click();

    }
}
