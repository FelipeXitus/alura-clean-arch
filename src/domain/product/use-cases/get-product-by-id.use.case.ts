import { NotFoundException } from '@nestjs/common';
import ProductEntity from '../../entities/product.entity';
import { PrismaClient } from '@prisma/client';

export class GetProductByIdUseCase {
  public constructor(private readonly prisma: PrismaClient) {}

  public async execute(id: string): Promise<ProductEntity> {
    const product = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    return product;
  }
}
