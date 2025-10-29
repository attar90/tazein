import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WordpressService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}

  // دریافت پست‌ها از وردپرس (بدون احراز هویت)
  async getPostsFromWP(): Promise<any> {
    try {
      console.log('📡 در حال دریافت پست‌ها از وردپرس...');

      const response = await firstValueFrom(
        this.httpService.get(
          `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts`,
          {
            params: {
              per_page: 100,
              status: 'publish',
              _fields: 'id,title,content,excerpt,featured_media,date,modified'
            }
          }
        )
      );

      console.log('✅ پست‌ها دریافت شد:', response.data.length);
      return response.data;

    } catch (error) {
      console.error('خطا در دریافت پست‌ها:', error.response?.data || error.message);
      throw new HttpException(
        'Failed to fetch posts from WordPress',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // دریافت اطلاعات مدیا (تصویر)
  async getMedia(mediaId: number): Promise<string> {
    try {
      if (!mediaId) return '';

      const response = await firstValueFrom(
        this.httpService.get(
          `${process.env.WORDPRESS_URL}/wp-json/wp/v2/media/${mediaId}`
        )
      );

      return response.data.source_url || '';
    } catch (error) {
      console.error('خطا در دریافت مدیا:', mediaId, error.message);
      return '';
    }
  }

  // همگام‌سازی پست‌ها به عنوان محصولات
  async syncProducts(): Promise<any> {
    try {
      const wpPosts = await this.getPostsFromWP();
      let syncedCount = 0;
      let updatedCount = 0;

      for (const post of wpPosts) {
        const existingProduct = await this.prisma.product.findFirst({
          where: { wpProductId: post.id },
        });

        // دریافت تصویر اگر exists
        let imageUrl = '';
        if (post.featured_media) {
          imageUrl = await this.getMedia(post.featured_media);
        }

        // تولید قیمت بر اساس ID پست (برای تست)
        const basePrice = 10000 + (post.id * 1000);
        const partnerPrice = basePrice * 0.8; // 20% تخفیف برای همکار

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
        } else {
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
    } catch (error) {
      console.error('Sync error:', error);
      throw new HttpException(
        'Failed to sync posts as products', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // دریافت لیست محصولات از دیتابیس
  async getLocalProducts(): Promise<any> {
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
      publicPrice: parseFloat(product.publicPrice as any),
      partnerPrice: parseFloat(product.partnerPrice as any),
    }));
  }

  private async getDefaultSupplierId(): Promise<string> {
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

  private stripHtml(html: string): string {
    return html?.replace(/<[^>]*>/g, '').substring(0, 200) || ''; // محدود کردن به 200 کاراکتر
  }
}