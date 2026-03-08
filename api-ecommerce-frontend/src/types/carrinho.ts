export interface CarrinhoProdutoResumo {
  id: number;
  nome: string;
  preco: number;
}

export interface ItemCarrinho {
  produtoId: number;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
}

export interface Carrinho {
  id: number;
  criadoEm?: string;
  atualizadoEm?: string | null;
  itens: ItemCarrinho[];
  total: number;
}

export interface AdicionarItemRequest {
  produtoId: number;
  quantidade: number;
}