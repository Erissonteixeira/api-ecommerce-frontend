import { describe, it, expect, vi, beforeEach } from "vitest";

const requestMock = vi.fn();

vi.mock("./api", () => ({
  request: (...args: any[]) => requestMock(...args),
}));

import {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  removerUsuario,
} from "./usuariosService";

import type { UsuarioRequest, UsuarioResponse } from "../types/usuario";

describe("usuariosService", () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it("listarUsuarios deve chamar GET /usuarios", async () => {
    const fake: UsuarioResponse[] = [];
    requestMock.mockResolvedValueOnce(fake);

    const result = await listarUsuarios();

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledWith("/usuarios");
    expect(result).toBe(fake);
  });

  it("buscarUsuarioPorId deve chamar GET /usuarios/{id}", async () => {
    const fake: UsuarioResponse = {
      id: 1,
      nome: "Teste",
      email: "teste@email.com",
      whatsapp: "51 99999-9999",
      cpf: "12345678901",
      criadoEm: "2026-01-01T10:00:00",
      atualizadoEm: null,
    };

    requestMock.mockResolvedValueOnce(fake);

    const result = await buscarUsuarioPorId(1);

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledWith("/usuarios/1");
    expect(result).toBe(fake);
  });

  it("criarUsuario deve chamar POST /usuarios com body", async () => {
    const payload: UsuarioRequest = {
      nome: "Novo",
      email: "novo@email.com",
      whatsapp: "51 99999-9999",
      cpf: "12345678901",
      senha: "Senha@123",
    };

    const fake: UsuarioResponse = {
      id: 10,
      nome: payload.nome,
      email: payload.email,
      whatsapp: payload.whatsapp,
      cpf: payload.cpf,
      criadoEm: "2026-01-01T10:00:00",
      atualizadoEm: null,
    };

    requestMock.mockResolvedValueOnce(fake);

    const result = await criarUsuario(payload);

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledWith("/usuarios", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    expect(result).toBe(fake);
  });

  it("atualizarUsuario deve chamar PUT /usuarios/{id} com body", async () => {
    const payload: UsuarioRequest = {
      nome: "Editado",
      email: "editado@email.com",
      whatsapp: "51 99999-9999",
      cpf: "12345678901",
      senha: "Senha@123",
    };

    const fake: UsuarioResponse = {
      id: 5,
      nome: payload.nome,
      email: payload.email,
      whatsapp: payload.whatsapp,
      cpf: payload.cpf,
      criadoEm: "2026-01-01T10:00:00",
      atualizadoEm: "2026-01-02T10:00:00",
    };

    requestMock.mockResolvedValueOnce(fake);

    const result = await atualizarUsuario(5, payload);

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledWith("/usuarios/5", {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    expect(result).toBe(fake);
  });

  it("removerUsuario deve chamar DELETE /usuarios/{id}", async () => {
    requestMock.mockResolvedValueOnce(undefined);

    const result = await removerUsuario(7);

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledWith("/usuarios/7", { method: "DELETE" });
    expect(result).toBeUndefined();
  });
});