import {
  ICartRepository,
  RemoveCartItemRepositoryOutput,
} from '../i-cart.repository';

export class RemoveCartItemUseCase {
  public constructor(private readonly cartRepository: ICartRepository) {}

  public async execute(
    usuarioId: string,
    produtoId: string,
  ): Promise<RemoveCartItemRepositoryOutput> {
    return this.cartRepository.removeCartItem(usuarioId, produtoId);
  }
}
