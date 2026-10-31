import { Prisma } from '@prisma/client';

export const cartWithItemsAndProducts = {
  itens: { include: { produto: true } },
} satisfies Prisma.CarrinhoInclude;
export type CartWithItemsAndProducts = Prisma.CarrinhoGetPayload<{
  include: typeof cartWithItemsAndProducts;
}>;
export interface FormattedCartItem {
  produtoId: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  totalItem: number;
}
export interface FormattedCart {
  id: string;
  usuarioId: string;
  itens: FormattedCartItem[];
  total: number;
}
