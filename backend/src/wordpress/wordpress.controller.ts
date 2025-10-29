import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { WordpressService } from './wordpress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wordpress')
@UseGuards(JwtAuthGuard)
export class WordpressController {
  constructor(private wordpressService: WordpressService) {}

  @Get('posts')
  async getPosts() {
    return this.wordpressService.getPostsFromWP();
  }

  @Post('sync')
  async syncProducts() {
    return this.wordpressService.syncProducts();
  }

  @Get('local-products')
  async getLocalProducts() {
    return this.wordpressService.getLocalProducts();
  }
}