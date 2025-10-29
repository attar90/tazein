import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { WordpressModule } from './wordpress/wordpress.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [AuthModule, WordpressModule, ProductsModule],
})
export class AppModule {}