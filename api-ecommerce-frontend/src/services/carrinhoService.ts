import { request } from "./api";
import type { Carrinho, AdicionarItemRequest } from "../types/carrinho";

type ItemCarrinhoApi = {
  produtoId: number;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
};

type CarrinhoApi = {
  id: number;
  criadoEm?: string;
  atualizadoEm?: string | null;
  itens: ItemCarrinhoApi[];
  total: number;
};

function mapCarrinhoApiParaCarrinho(apiModel: CarrinhoApi): Carrinho {
  return {
    id: apiModel.id,
    criadoEm: apiModel.criadoEm,
    atualizadoEm: apiModel.atualizadoEm ?? null,
    itens: apiModel.itens,
    total: apiModel.total,
  };
}

export async function obterOuCriarCarrinho(): Promise<Carrinho> {
  const data = await request<CarrinhoApi>("/carrinho");
  return mapCarrinhoApiParaCarrinho(data);
}

export async function adicionarItemAoCarrinho(payload: AdicionarItemRequest): Promise<Carrinho> {
  const data = await request<CarrinhoApi>("/carrinho/itens", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapCarrinhoApiParaCarrinho(data);
}

export async function removerItemDoCarrinho(produtoId: number): Promise<Carrinho> {
  await request<void>(`/carrinho/itens/${produtoId}`, {
    method: "DELETE",
  });

  return obterOuCriarCarrinho();
}

export function limparCarrinhoLocal() {

}