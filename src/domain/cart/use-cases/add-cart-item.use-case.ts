import {
  AddCartItemRepositoryInput,
  AddCartItemRepositoryOutput,
  ICartRepository,
} from '../i-cart.repository';

export class AddCartItemUseCase {
  public constructor(private readonly cartRepository: ICartRepository) {}

  public async execute(
    usuarioId: string,
    itemData: AddCartItemRepositoryInput,
  ): Promise<AddCartItemRepositoryOutput> {
    return this.cartRepository.addCartItem(usuarioId, itemData);
  }
}
