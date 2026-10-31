import { ICartRepository } from '../i-cart.repository';
import { FormattedCart } from '../types/cart.types';

export class GetCartUseCase {
  public constructor(private readonly cartRepository: ICartRepository) {}

  public async execute(usuarioId: string): Promise<FormattedCart> {
    return this.cartRepository.getCart(usuarioId);
  }
}
