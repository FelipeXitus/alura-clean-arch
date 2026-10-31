import { Injectable, NotFoundException } from '@nestjs/common';
import ProductEntity from '../../entities/product.entity';
import { IProductRepository } from '../i-product.repository';

@Injectable()
export class GetProductByIdUseCase {
  public constructor(private readonly productRepository: IProductRepository) {}

  public async execute(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.getProductById(id);

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    return product;
  }
}
