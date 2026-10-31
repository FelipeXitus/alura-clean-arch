import { NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getOrCreateCart } from '../helpers/cart.helper';
import { formatCart } from '../helpers/format-cart.helper';
import { cartWithItemsAndProducts, FormattedCart } from '../types/cart.types';

export interface RemoveCartItemOutput {
  mensagem: string;
  carrinho: FormattedCart;
}

export class RemoveCartItemUseCase {
  public constructor(private readonly prisma: PrismaClient) {}
  public async execute(
    usuarioId: string,
    produtoId: string,
  ): Promise<RemoveCartItemOutput> {
    const cart = await getOrCreateCart(this.prisma, usuarioId);
    const cartItem = cart.itens.find((item) => item.produtoId === produtoId);
    if (!cartItem) {
      throw new NotFoundException(
        `Produto com ID ${produtoId} não está no carrinho.`,
      );
    }
    const updatedCart = await this.prisma.$transaction(async (transaction) => {
      await transaction.produto.update({
        where: { id: produtoId },
        data: { estoque: { increment: cartItem.quantidade } },
      });
      await transaction.itemCarrinho.delete({ where: { id: cartItem.id } });
      return transaction.carrinho.findUniqueOrThrow({
        where: { id: cart.id },
        include: cartWithItemsAndProducts,
      });
    });
    return {
      mensagem: 'Item removido do carrinho!',
      carrinho: formatCart(updatedCart),
    };
  }
}
