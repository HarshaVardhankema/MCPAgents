import {test, expect, Page} from '@playwright/test';
import { GooglePage } from './Google';
import { YoutubePage } from './Youtube';

export class DataManagerPage{

    page : Page;
    googlePage : GooglePage;
    youtube : YoutubePage;

    constructor(page: any){
        this.page = page;
        this.googlePage = new GooglePage(this.page);
        this.youtube= new YoutubePage(this.page);
    }

    get Google(){
        return this.googlePage;
    }

    get Youtube(){
        return this.youtube;
    }



}

