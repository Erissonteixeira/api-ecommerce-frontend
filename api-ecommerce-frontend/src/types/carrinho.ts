import type { ProdutoResumo } from "./produto";

export interface ItemCarrinho {
  produto: ProdutoResumo;
  quantidade: number;
}

export interface Carrinho {
  id: number;
  itens: ItemCarrinho[];
  total: number;
}
