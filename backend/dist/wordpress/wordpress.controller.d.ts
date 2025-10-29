import { WordpressService } from './wordpress.service';
export declare class WordpressController {
    private wordpressService;
    constructor(wordpressService: WordpressService);
    getPosts(): Promise<any>;
    syncProducts(): Promise<any>;
    getLocalProducts(): Promise<any>;
}
