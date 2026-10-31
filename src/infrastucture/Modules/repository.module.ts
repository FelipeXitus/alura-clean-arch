import { Module } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { PRISMA_CLIENT } from '../constants/injection-tokens.const';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [],
  providers: [
    { provide: PRISMA_CLIENT, useFactory: () => new PrismaClient() },
    { provide: 'IProductRepository', useClass: ProductRepository },
  ],
  exports: [ProductRepository],
})
export class RepositoryModule {}
