import { ConflictException } from '@nestjs/common';
import ProductEntity from '../../entities/product.entity';
import { PrismaClient } from '@prisma/client';

interface CreateProductInput {
  nome: string;
  preco: number;
  estoque: number;
}

export class CreateProductUseCase {
  public constructor(private readonly prisma: PrismaClient) {}

  public async execute(
    productData: CreateProductInput,
  ): Promise<ProductEntity> {
    const productExists = await this.prisma.produto.findUnique({
      where: { nome: productData.nome },
    });

    if (productExists) {
      throw new ConflictException('Já existe um produto com este nome.');
    }

    return this.prisma.produto.create({
      data: productData,
    });
  }
}
