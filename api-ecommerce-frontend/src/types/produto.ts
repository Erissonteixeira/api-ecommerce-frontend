export interface Produto {
  id: number;
  nome: string;
  preco: number;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string | null;
}
