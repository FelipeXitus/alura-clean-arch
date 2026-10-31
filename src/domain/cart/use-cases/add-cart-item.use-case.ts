import { Inject, Injectable } from '@nestjs/common';
import {
  AddCartItemRepositoryInput,
  AddCartItemRepositoryOutput,
  ICartRepository,
} from '../i-cart.repository';

@Injectable()
export class AddCartItemUseCase {
  public constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  public async execute(
    usuarioId: string,
    itemData: AddCartItemRepositoryInput,
  ): Promise<AddCartItemRepositoryOutput> {
    return this.cartRepository.addCartItem(usuarioId, itemData);
  }
}
