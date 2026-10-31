import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getOrCreateCart } from '../helpers/cart.helper';
import { formatCart } from '../helpers/format-cart.helper';
import { cartWithItemsAndProducts, FormattedCart } from '../types/cart.types';

interface AddCartItemInput {
  produtoId: string;
  quantidade: number;
}
export interface AddCartItemOutput {
  mensagem: string;
  carrinho: FormattedCart;
}

export class AddCartItemUseCase {
  public constructor(private readonly prisma: PrismaClient) {}
  public async execute(
    usuarioId: string,
    itemData: AddCartItemInput,
  ): Promise<AddCartItemOutput> {
    if (itemData.quantidade <= 0) {
      throw new BadRequestException('A quantidade deve ser maior que zero.');
    }
    const cart = await getOrCreateCart(this.prisma, usuarioId);
    const product = await this.prisma.produto.findUnique({
      where: { id: itemData.produtoId },
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
          estoque: { gte: itemData.quantidade },
        },
        data: { estoque: { decrement: itemData.quantidade } },
      });
      if (stockUpdate.count === 0) {
        const currentProduct = await transaction.produto.findUnique({
          where: { id: itemData.produtoId },
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
        where: { id: cart.id },
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
              update: { quantidade: { increment: itemData.quantidade } },
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
}
