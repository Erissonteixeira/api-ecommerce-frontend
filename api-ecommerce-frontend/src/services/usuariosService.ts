import { request } from "./api";
import type { UsuarioRequest, UsuarioResponse } from "../types/usuario";

export async function listarUsuarios(): Promise<UsuarioResponse[]> {
  return request<UsuarioResponse[]>("/usuarios");
}

export async function buscarUsuarioPorId(id: number): Promise<UsuarioResponse> {
  return request<UsuarioResponse>(`/usuarios/${id}`);
}

export async function criarUsuario(payload: UsuarioRequest): Promise<UsuarioResponse> {
  return request<UsuarioResponse>("/usuarios", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function atualizarUsuario(id: number, payload: UsuarioRequest): Promise<UsuarioResponse> {
  return request<UsuarioResponse>(`/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function removerUsuario(id: number): Promise<void> {
  return request<void>(`/usuarios/${id}`, { method: "DELETE" });
}