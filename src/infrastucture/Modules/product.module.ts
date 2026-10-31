import { Module } from '@nestjs/common';
import { ProductController } from '../../presentation/product/product.controller';
import { IProductRepository } from '../../domain/product/i-product.repository';
import { ProductRepository } from '../repositories/product.repository';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [
    {
      provide: IProductRepository,
      useClass: ProductRepository,
    },
  ],
})
export class ProductModule {}
