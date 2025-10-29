"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordpressService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const prisma_service_1 = require("../prisma/prisma.service");
let WordpressService = class WordpressService {
    constructor(httpService, prisma) {
        this.httpService = httpService;
        this.prisma = prisma;
    }
    async getPostsFromWP() {
        try {
            console.log('📡 در حال دریافت پست‌ها از وردپرس...');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts`, {
                params: {
                    per_page: 100,
                    status: 'publish',
                    _fields: 'id,title,content,excerpt,featured_media,date,modified'
                }
            }));
            console.log('✅ پست‌ها دریافت شد:', response.data.length);
            return response.data;
        }
        catch (error) {
            console.error('خطا در دریافت پست‌ها:', error.response?.data || error.message);
            throw new common_1.HttpException('Failed to fetch posts from WordPress', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMedia(mediaId) {
        try {
            if (!mediaId)
                return '';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/media/${mediaId}`));
            return response.data.source_url || '';
        }
        catch (error) {
            console.error('خطا در دریافت مدیا:', mediaId, error.message);
            return '';
        }
    }
    async syncProducts() {
        try {
            const wpPosts = await this.getPostsFromWP();
            let syncedCount = 0;
            let updatedCount = 0;
            for (const post of wpPosts) {
                const existingProduct = await this.prisma.product.findFirst({
                    where: { wpProductId: post.id },
                });
                let imageUrl = '';
                if (post.featured_media) {
                    imageUrl = await this.getMedia(post.featured_media);
                }
                const basePrice = 10000 + (post.id * 1000);
                const partnerPrice = basePrice * 0.8;
                const productData = {
                    wpProductId: post.id,
                    name: post.title.rendered || `پست ${post.id}`,
                    sku: `POST-${post.id}`,
                    description: this.stripHtml(post.content.rendered || post.excerpt.rendered || ''),
                    baseUnit: 'piece',
                    publicPrice: basePrice,
                    partnerPrice: partnerPrice,
                    images: JSON.stringify(imageUrl ? [imageUrl] : []),
                    status: true,
                    supplierId: await this.getDefaultSupplierId(),
                };
                if (!existingProduct) {
                    await this.prisma.product.create({
                        data: productData,
                    });
                    syncedCount++;
                }
                else {
                    await this.prisma.product.update({
                        where: { id: existingProduct.id },
                        data: productData,
                    });
                    updatedCount++;
                }
            }
            return {
                success: true,
                synced: syncedCount,
                updated: updatedCount,
                total: wpPosts.length,
                message: `همگام‌سازی موفق: ${syncedCount} محصول جدید از پست‌های وردپرس`
            };
        }
        catch (error) {
            console.error('Sync error:', error);
            throw new common_1.HttpException('Failed to sync posts as products', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getLocalProducts() {
        const products = await this.prisma.product.findMany({
            include: {
                supplier: {
                    select: {
                        name: true,
                        logoUrl: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return products.map(product => ({
            ...product,
            images: JSON.parse(product.images || '[]'),
            publicPrice: parseFloat(product.publicPrice),
            partnerPrice: parseFloat(product.partnerPrice),
        }));
    }
    async getDefaultSupplierId() {
        let supplier = await this.prisma.supplier.findFirst({
            where: { name: 'تأمین‌کننده پیش‌فرض' },
        });
        if (!supplier) {
            supplier = await this.prisma.supplier.create({
                data: {
                    name: 'تأمین‌کننده پیش‌فرض',
                    contactInfo: JSON.stringify({}),
                },
            });
        }
        return supplier.id;
    }
    stripHtml(html) {
        return html?.replace(/<[^>]*>/g, '').substring(0, 200) || '';
    }
};
exports.WordpressService = WordpressService;
exports.WordpressService = WordpressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        prisma_service_1.PrismaService])
], WordpressService);
//# sourceMappingURL=wordpress.service.js.map