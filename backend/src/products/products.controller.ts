import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getProducts() {
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

    // تبدیل images از JSON string به array
    return products.map(product => ({
      ...product,
      images: JSON.parse(product.images || '[]'),
      publicPrice: parseFloat(product.publicPrice as any),
      partnerPrice: parseFloat(product.partnerPrice as any),
    }));
  }
}