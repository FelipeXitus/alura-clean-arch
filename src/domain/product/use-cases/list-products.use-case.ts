import { Injectable } from '@nestjs/common';
import ProductEntity from '../../entities/product.entity';
import { IProductRepository } from '../i-product.repository';

@Injectable()
export class ListProductsUseCase {
  public constructor(private readonly productRepository: IProductRepository) {}

  public async execute(): Promise<ProductEntity[]> {
    return this.productRepository.listProducts();
  }
}
