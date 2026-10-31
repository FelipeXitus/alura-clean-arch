import CreateProductDto from '../../presentation/product/dto/create-product.dto';
import UpdateProductDto from '../../presentation/product/dto/update-product.dto';
import ProductEntity from '../entities/product.entity';

export abstract class IProductRepository {
  abstract createProduct(data: CreateProductDto): Promise<ProductEntity>;

  abstract listProducts(): Promise<ProductEntity[]>;

  abstract getProductById(id: string): Promise<ProductEntity | null>;

  abstract getProductByName(nome: string): Promise<ProductEntity | null>;

  abstract updateProduct(
    id: string,
    data: UpdateProductDto,
  ): Promise<ProductEntity>;

  abstract deleteProduct(id: string): Promise<void>;
}
