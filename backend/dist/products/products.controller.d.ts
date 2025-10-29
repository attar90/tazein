import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsController {
    private prisma;
    constructor(prisma: PrismaService);
    getProducts(): Promise<{
        images: any;
        publicPrice: number;
        partnerPrice: number;
        supplier: {
            name: string;
            logoUrl: string;
        };
        id: string;
        wpProductId: number | null;
        name: string;
        sku: string | null;
        description: string | null;
        supplierId: string;
        baseUnit: string;
        status: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
