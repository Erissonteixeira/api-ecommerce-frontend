import { request } from "./api";
import type { Carrinho, AdicionarItemRequest } from "../types/carrinho";
import type { ProdutoResumo } from "../types/produto";

const CARRINHO_ID_KEY = "carrinhoId";

type ItemCarrinhoApi = {
  produtoId: number;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
};

type CarrinhoApi = {
  id: number;
  criadoEm: string;
  atualizadoEm: string | null;
  itens: ItemCarrinhoApi[];
  total: number;
};

function mapItemApiParaProdutoResumo(item: ItemCarrinhoApi): ProdutoResumo {
  return {
    id: item.produtoId,
    nome: item.nomeProduto,
    preco: item.precoUnitario,
  };
}

function mapCarrinhoApiParaCarrinho(apiModel: CarrinhoApi): Carrinho {
  return {
    id: apiModel.id,
    itens: apiModel.itens.map((item) => ({
      produto: mapItemApiParaProdutoResumo(item),
      quantidade: item.quantidade,
    })),
    total: apiModel.total,
  };
}

function getCarrinhoIdSalvo(): number | null {
  const value = localStorage.getItem(CARRINHO_ID_KEY);
  if (!value) return null;

  const id = Number(value);
  if (!Number.isFinite(id) || id <= 0) return null;

  return id;
}

function salvarCarrinhoId(id: number) {
  localStorage.setItem(CARRINHO_ID_KEY, String(id));
}

function limparCarrinhoId() {
  localStorage.removeItem(CARRINHO_ID_KEY);
}

export async function criarCarrinho(): Promise<Carrinho> {
  const data = await request<CarrinhoApi>("/carrinhos", { method: "POST" });
  const carrinho = mapCarrinhoApiParaCarrinho(data);
  salvarCarrinhoId(carrinho.id);
  return carrinho;
}

export async function buscarCarrinho(id: number): Promise<Carrinho> {
  const data = await request<CarrinhoApi>(`/carrinhos/${id}`);
  return mapCarrinhoApiParaCarrinho(data);
}

export async function obterOuCriarCarrinho(): Promise<Carrinho> {
  const id = getCarrinhoIdSalvo();

  if (!id) return criarCarrinho();

  try {
    return await buscarCarrinho(id);
  } catch {
    limparCarrinhoId();
    return criarCarrinho();
  }
}

export async function adicionarItemAoCarrinho(
  carrinhoId: number,
  payload: AdicionarItemRequest
): Promise<Carrinho> {
  const data = await request<CarrinhoApi>(`/carrinhos/${carrinhoId}/itens`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapCarrinhoApiParaCarrinho(data);
}

export async function removerItemDoCarrinho(
  carrinhoId: number,
  produtoId: number
): Promise<Carrinho> {
  await request<void>(`/carrinhos/${carrinhoId}/itens/${produtoId}`, {
    method: "DELETE",
  });

  return buscarCarrinho(carrinhoId);
}

export function limparCarrinhoLocal() {
  localStorage.removeItem("carrinhoId");
}