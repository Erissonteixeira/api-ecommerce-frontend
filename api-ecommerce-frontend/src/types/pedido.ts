export interface PedidoItem {
  id: number;
  produtoId: number;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  criadoEm: string;
  atualizadoEm: string | null;
  status: string;
  total: number;
  usuarioId: number;
  usuarioNome: string;
  usuarioEmail: string;
  itens: PedidoItem[];
}