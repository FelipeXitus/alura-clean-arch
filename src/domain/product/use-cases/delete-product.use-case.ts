import { Injectable, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '../i-product.repository';

@Injectable()
export class DeleteProductUseCase {
  public constructor(private readonly productRepository: IProductRepository) {}

  public async execute(id: string): Promise<void> {
    const productExists = await this.productRepository.getProductById(id);

    if (!productExists) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    await this.productRepository.deleteProduct(id);
  }
}
