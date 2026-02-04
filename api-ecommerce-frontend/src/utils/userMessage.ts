export function userMessageFromError(error: unknown, fallback: string) {
  const raw =
    typeof error === "string"
      ? error
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as any).message)
        : "";

  const msg = raw.trim();

  if (!msg) return fallback;

  const lower = msg.toLowerCase();

  if (lower.includes("failed to fetch") || lower.includes("networkerror") || lower.includes("load failed")) {
    return "Não foi possível conectar ao servidor. Verifique se o backend está rodando.";
  }

  if (lower.includes("timeout") || lower.includes("timed out")) {
    return "A requisição demorou demais. Tente novamente.";
  }

  return msg;
}
