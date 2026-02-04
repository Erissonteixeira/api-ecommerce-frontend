import { request } from "./api";
import type { Pedido } from "../types/pedido";

export async function finalizarPedido(carrinhoId: number): Promise<Pedido> {
  const data = await request<Pedido>(`/carrinhos/${carrinhoId}/pedido`, {
    method: "POST",
  });

  return data;
}
