import { request } from "./api";
import type { Pedido } from "../types/pedido";

export async function finalizarPedido(): Promise<Pedido> {
  const data = await request<Pedido>("/pedidos/me", {
    method: "POST",
  });

  return data;
}

export async function listarMeusPedidos(): Promise<Pedido[]> {
  return request<Pedido[]>("/pedidos/me");
}