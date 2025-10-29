import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
export declare class WordpressService {
    private httpService;
    private prisma;
    constructor(httpService: HttpService, prisma: PrismaService);
    getPostsFromWP(): Promise<any>;
    getMedia(mediaId: number): Promise<string>;
    syncProducts(): Promise<any>;
    getLocalProducts(): Promise<any>;
    private getDefaultSupplierId;
    private stripHtml;
}
