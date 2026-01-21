import type { ItemCarrinho } from "./carrinho";

export interface Pedido {
  id: number;
  status: string;
  total: number;
  itens: ItemCarrinho[];
}
