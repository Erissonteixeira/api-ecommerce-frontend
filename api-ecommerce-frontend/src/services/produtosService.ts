import { request } from "./api";
import type { Produto } from "../types/produto";

export async function listarProdutos(): Promise<Produto[]> {
  return request<Produto[]>("/produtos");
}

export async function buscarProdutoPorId(id: number): Promise<Produto> {
  return request<Produto>(`/produtos/${id}`);
}
