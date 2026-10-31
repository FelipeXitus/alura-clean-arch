import ProductEntity from '../../entities/product.entity';
import { PrismaClient } from '@prisma/client';

export class ListProductsUseCase {
  public constructor(private readonly prisma: PrismaClient) {}

  public async execute(): Promise<ProductEntity[]> {
    return this.prisma.produto.findMany();
  }
}
