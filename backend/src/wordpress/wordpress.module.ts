import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WordpressService } from './wordpress.service';
import { WordpressController } from './wordpress.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [HttpModule],
  providers: [WordpressService, PrismaService],
  controllers: [WordpressController],
})
export class WordpressModule {}