import { Inject, Injectable } from '@nestjs/common';
import {
  ICartRepository,
  RemoveCartItemRepositoryOutput,
} from '../i-cart.repository';

@Injectable()
export class RemoveCartItemUseCase {
  public constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  public async execute(
    usuarioId: string,
    produtoId: string,
  ): Promise<RemoveCartItemRepositoryOutput> {
    return this.cartRepository.removeCartItem(usuarioId, produtoId);
  }
}
