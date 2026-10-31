import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import ProductEntity from '../../entities/product.entity';
import { IProductRepository } from '../i-product.repository';

interface UpdateProductInput {
  nome?: string;
  preco?: number;
  estoque?: number;
}

export class UpdateProductUseCase {
  public constructor(private readonly productRepository: IProductRepository) {}

  public async execute(
    id: string,
    productData: UpdateProductInput,
  ): Promise<ProductEntity> {
    if (Object.keys(productData).length === 0) {
      throw new BadRequestException(
        'Pelo menos um campo deve ser fornecido para atualização.',
      );
    }

    const productExists = await this.productRepository.getProductById(id);

    if (!productExists) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    if (productData.nome) {
      const productWithSameName = await this.productRepository.getProductByName(
        productData.nome,
      );

      if (productWithSameName && productWithSameName.id !== id) {
        throw new ConflictException('Já existe um produto com este nome.');
      }
    }

    return this.productRepository.updateProduct(id, productData);
  }
}
