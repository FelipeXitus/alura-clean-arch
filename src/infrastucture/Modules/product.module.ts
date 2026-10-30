import { Module } from '@nestjs/common';
import { ProductController } from '../../presentation/product/product.controller';

@Module({
  controllers: [ProductController],
})
export class ProductModule {}
