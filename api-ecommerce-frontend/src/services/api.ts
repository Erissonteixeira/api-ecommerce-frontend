import type { ApiError } from "../types/apiError";

const BASE_URL = "http://localhost:8080";

export async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    let errorBody: Partial<ApiError> = {};

    try {
      errorBody = (await response.json()) as ApiError;
    } catch {
      errorBody = {};
    }

    throw {
      status: response.status,
      message: (errorBody as any).message || "Erro inesperado",
      errors: (errorBody as any).errors,
    } as ApiError;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
