import type { Produto } from "./produto";

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

export interface Carrinho {
  id: number;
  itens: ItemCarrinho[];
  total: number;
}
