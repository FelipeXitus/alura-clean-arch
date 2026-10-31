import { CartWithItemsAndProducts, FormattedCart } from './types/cart.types';

export interface AddCartItemRepositoryInput {
  produtoId: string;
  quantidade: number;
}

export interface AddCartItemRepositoryOutput {
  mensagem: string;
  carrinho: FormattedCart;
}

export interface RemoveCartItemRepositoryOutput {
  mensagem: string;
  carrinho: FormattedCart;
}

export abstract class ICartRepository {
  abstract getOrCreateCart(
    usuarioId: string,
  ): Promise<CartWithItemsAndProducts>;

  abstract getCart(usuarioId: string): Promise<FormattedCart>;

  abstract addCartItem(
    usuarioId: string,
    itemData: AddCartItemRepositoryInput,
  ): Promise<AddCartItemRepositoryOutput>;

  abstract removeCartItem(
    usuarioId: string,
    produtoId: string,
  ): Promise<RemoveCartItemRepositoryOutput>;
}
