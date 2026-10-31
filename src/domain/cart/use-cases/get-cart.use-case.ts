import { Inject, Injectable } from '@nestjs/common';
import { ICartRepository } from '../i-cart.repository';
import { FormattedCart } from '../types/cart.types';

@Injectable()
export class GetCartUseCase {
  public constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  public async execute(usuarioId: string): Promise<FormattedCart> {
    return this.cartRepository.getCart(usuarioId);
  }
}
