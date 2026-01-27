import { describe, it, expect } from "vitest";
import { userMessageFromError } from "./userMessage";

describe("userMessageFromError", () => {
  it("deve retornar fallback quando não há mensagem", () => {
    const msg = userMessageFromError({}, "fallback");
    expect(msg).toBe("fallback");
  });

  it("deve transformar Failed to fetch em mensagem humana", () => {
    const msg = userMessageFromError(new Error("Failed to fetch"), "fallback");
    expect(msg).toBe("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
  });

  it("deve transformar timeout em mensagem humana", () => {
    const msg = userMessageFromError(new Error("Request timed out"), "fallback");
    expect(msg).toBe("A requisição demorou demais. Tente novamente.");
  });

  it("deve retornar a mensagem original quando não for caso conhecido", () => {
    const msg = userMessageFromError(new Error("Erro específico do backend"), "fallback");
    expect(msg).toBe("Erro específico do backend");
  });
});
