import { describe, it, expect, beforeEach, vi } from "vitest";
import { request } from "./api";

type MockFetchResponse = {
  ok: boolean;
  status: number;
  json?: () => Promise<unknown>;
};

function mockFetchOnce(response: MockFetchResponse) {
  const fetchMock = vi.fn(async () => {
    return {
      ok: response.ok,
      status: response.status,
      json: response.json ?? (async () => ({})),
    } as Response;
  });

  global.fetch = fetchMock as unknown as typeof fetch;

  return fetchMock;
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("services/api.request", () => {
  it("retorna dados quando response ok e status 200", async () => {
    mockFetchOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 1, nome: "Produto" }),
    });

    const data = await request<{ id: number; nome: string }>("/produtos/1");

    expect(data).toEqual({ id: 1, nome: "Produto" });
  });

  it("retorna undefined quando status 204", async () => {
    mockFetchOnce({
      ok: true,
      status: 204,
    });

    const data = await request<void>("/carrinhos/1");

    expect(data).toBeUndefined();
  });

  it("lança ApiError com message e errors quando body tem message e errors", async () => {
    mockFetchOnce({
      ok: false,
      status: 400,
      json: async () => ({
        message: "Dados inválidos",
        errors: {
          campoA: "obrigatório",
          campoB: "inválido",
          campoC: 123,
        },
      }),
    });

    try {
      await request("/qualquer");
      throw new Error("era para ter lançado");
    } catch (e: unknown) {
      expect(e).toMatchObject({
        status: 400,
        message: "Dados inválidos",
        errors: {
          campoA: "obrigatório",
          campoB: "inválido",
        },
      });
    }
  });

  it("lança ApiError com message padrão quando json falha", async () => {
    mockFetchOnce({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error("json inválido");
      },
    });

    try {
      await request("/qualquer");
      throw new Error("era para ter lançado");
    } catch (e: unknown) {
      expect(e).toMatchObject({
        status: 500,
        message: "Erro inesperado",
      });
    }
  });

  it("mantém message padrão quando body não tem message", async () => {
    mockFetchOnce({
      ok: false,
      status: 404,
      json: async () => ({ detalhe: "não encontrado" }),
    });

    try {
      await request("/qualquer");
      throw new Error("era para ter lançado");
    } catch (e: unknown) {
      expect(e).toMatchObject({
        status: 404,
        message: "Erro inesperado",
      });
    }
  });
});
