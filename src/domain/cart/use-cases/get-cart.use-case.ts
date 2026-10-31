import { PrismaClient } from '@prisma/client';
import { getOrCreateCart } from '../helpers/cart.helper';
import { formatCart } from '../helpers/format-cart.helper';
import { FormattedCart } from '../types/cart.types';

export class GetCartUseCase {
  public constructor(private readonly prisma: PrismaClient) {}
  public async execute(usuarioId: string): Promise<FormattedCart> {
    const cart = await getOrCreateCart(this.prisma, usuarioId);
    return formatCart(cart);
  }
}
