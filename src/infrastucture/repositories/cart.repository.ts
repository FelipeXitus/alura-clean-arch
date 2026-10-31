import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import {
  AddCartItemRepositoryInput,
  AddCartItemRepositoryOutput,
  ICartRepository,
  RemoveCartItemRepositoryOutput,
} from '../../domain/cart/i-cart.repository';
import { getOrCreateCart } from '../../domain/cart/helpers/cart.helper';
import { formatCart } from '../../domain/cart/helpers/format-cart.helper';
import {
  cartWithItemsAndProducts,
  CartWithItemsAndProducts,
  FormattedCart,
} from '../../domain/cart/types/cart.types';
import { PRISMA_CLIENT } from '../constants/injection-tokens.const';

@Injectable()
export class CartRepository implements ICartRepository {
  public constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: PrismaClient,
  ) {}

  getOrCreateCart(usuarioId: string): Promise<CartWithItemsAndProducts> {
    return getOrCreateCart(this.prisma, usuarioId);
  }

  async getCart(usuarioId: string): Promise<FormattedCart> {
    const cart = await this.getOrCreateCart(usuarioId);

    return formatCart(cart);
  }

  async addCartItem(
    usuarioId: string,
    itemData: AddCartItemRepositoryInput,
  ): Promise<AddCartItemRepositoryOutput> {
    if (itemData.quantidade <= 0) {
      throw new BadRequestException('A quantidade deve ser maior que zero.');
    }

    const cart = await this.getOrCreateCart(usuarioId);

    const product = await this.prisma.produto.findUnique({
      where: {
        id: itemData.produtoId,
      },
    });

    if (!product) {
      throw new NotFoundException(
        `Produto com ID ${itemData.produtoId} não encontrado.`,
      );
    }

    const updatedCart = await this.prisma.$transaction(async (transaction) => {
      const stockUpdate = await transaction.produto.updateMany({
        where: {
          id: itemData.produtoId,
          estoque: {
            gte: itemData.quantidade,
          },
        },
        data: {
          estoque: {
            decrement: itemData.quantidade,
          },
        },
      });

      if (stockUpdate.count === 0) {
        const currentProduct = await transaction.produto.findUnique({
          where: {
            id: itemData.produtoId,
          },
        });

        if (!currentProduct) {
          throw new NotFoundException(
            `Produto com ID ${itemData.produtoId} não encontrado.`,
          );
        }

        throw new BadRequestException(
          `Estoque insuficiente para "${currentProduct.nome}". ` +
            `Disponível: ${currentProduct.estoque}.`,
        );
      }

      return transaction.carrinho.update({
        where: {
          id: cart.id,
        },
        data: {
          itens: {
            upsert: {
              where: {
                produtoId_carrinhoId: {
                  produtoId: itemData.produtoId,
                  carrinhoId: cart.id,
                },
              },
              create: {
                produtoId: itemData.produtoId,
                quantidade: itemData.quantidade,
              },
              update: {
                quantidade: {
                  increment: itemData.quantidade,
                },
              },
            },
          },
        },
        include: cartWithItemsAndProducts,
      });
    });

    return {
      mensagem: 'Item adicionado ao carrinho!',
      carrinho: formatCart(updatedCart),
    };
  }

  async removeCartItem(
    usuarioId: string,
    produtoId: string,
  ): Promise<RemoveCartItemRepositoryOutput> {
    const cart = await this.getOrCreateCart(usuarioId);

    const cartItem = cart.itens.find((item) => item.produtoId === produtoId);

    if (!cartItem) {
      throw new NotFoundException(
        `Produto com ID ${produtoId} não está no carrinho.`,
      );
    }

    const updatedCart = await this.prisma.$transaction(async (transaction) => {
      await transaction.produto.update({
        where: {
          id: produtoId,
        },
        data: {
          estoque: {
            increment: cartItem.quantidade,
          },
        },
      });

      await transaction.itemCarrinho.delete({
        where: {
          id: cartItem.id,
        },
      });

      return transaction.carrinho.findUniqueOrThrow({
        where: {
          id: cart.id,
        },
        include: cartWithItemsAndProducts,
      });
    });

    return {
      mensagem: 'Item removido do carrinho!',
      carrinho: formatCart(updatedCart),
    };
  }
}
