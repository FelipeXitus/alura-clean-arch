import { ConflictException, Injectable } from '@nestjs/common';
import ProductEntity from '../../entities/product.entity';
import { IProductRepository } from '../i-product.repository';

interface CreateProductInput {
  nome: string;
  preco: number;
  estoque: number;
}

@Injectable()
export class CreateProductUseCase {
  public constructor(private readonly productRepository: IProductRepository) {}

  public async execute(
    productData: CreateProductInput,
  ): Promise<ProductEntity> {
    const productExists = await this.productRepository.getProductByName(
      productData.nome,
    );

    if (productExists) {
      throw new ConflictException('Já existe um produto com este nome.');
    }

    return this.productRepository.createProduct(productData);
  }
}
