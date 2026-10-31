import { CartWithItemsAndProducts, FormattedCart } from '../types/cart.types';

export function formatCart(cart: CartWithItemsAndProducts): FormattedCart {
  const itens = cart.itens.map((item) => {
    const totalItem = item.quantidade * Number(item.produto.preco);
    return {
      produtoId: item.produtoId,
      nome: item.produto.nome,
      quantidade: item.quantidade,
      precoUnitario: Number(item.produto.preco),
      totalItem,
    };
  });
  const total = itens.reduce((accumulator, item) => {
    return accumulator + item.totalItem;
  }, 0);
  return { id: cart.id, usuarioId: cart.usuarioId, itens, total };
}
