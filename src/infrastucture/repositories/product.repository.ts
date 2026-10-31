import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { IProductRepository } from '../../domain/product/i-product.repository';
import ProductEntity from '../../domain/entities/product.entity';
import CreateProductDto from '../../presentation/product/dto/create-product.dto';
import UpdateProductDto from '../../presentation/product/dto/update-product.dto';
import { PRISMA_CLIENT } from '../constants/injection-tokens.const';

@Injectable()
export class ProductRepository implements IProductRepository {
  public constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: PrismaClient,
  ) {}

  createProduct(data: CreateProductDto): Promise<ProductEntity> {
    return this.prisma.produto.create({
      data,
    });
  }

  listProducts(): Promise<ProductEntity[]> {
    return this.prisma.produto.findMany();
  }

  getProductById(id: string): Promise<ProductEntity | null> {
    return this.prisma.produto.findUnique({
      where: { id },
    });
  }

  getProductByName(nome: string): Promise<ProductEntity | null> {
    return this.prisma.produto.findUnique({
      where: { nome },
    });
  }

  updateProduct(id: string, data: UpdateProductDto): Promise<ProductEntity> {
    return this.prisma.produto.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.prisma.produto.delete({
      where: { id },
    });
  }
}
