import type { ApiError } from "../types/apiError";

const BASE_URL = "http://localhost:8080";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toRecordString(value: unknown): Record<string, string> | undefined {
  if (!isObject(value)) return undefined;

  const result: Record<string, string> = {};

  for (const [key, val] of Object.entries(value)) {
    if (typeof val === "string") {
      result[key] = val;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

export async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Erro inesperado";
    let errors: Record<string, string> | undefined = undefined;

    try {
      const body: unknown = await response.json();

      if (isObject(body)) {
        if (typeof body.message === "string") message = body.message;
        if ("errors" in body) errors = toRecordString(body.errors);
      }
    } catch {
      // ignore
    }

    const apiError: ApiError = {
      status: response.status,
      message,
      errors,
    };

    throw apiError;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data: unknown = await response.json();
  return data as T;
}
