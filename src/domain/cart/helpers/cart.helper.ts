import { PrismaClient } from '@prisma/client';
import {
  cartWithItemsAndProducts,
  CartWithItemsAndProducts,
} from '../types/cart.types';

export async function getOrCreateCart(
  prisma: PrismaClient,
  usuarioId: string,
): Promise<CartWithItemsAndProducts> {
  return prisma.carrinho.upsert({
    where: { usuarioId },
    create: { usuarioId },
    update: {},
    include: cartWithItemsAndProducts,
  });
}
