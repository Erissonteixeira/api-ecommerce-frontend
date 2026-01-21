import type { ApiError } from "../types/apiError";

const BASE_URL = "http://localhost:8080";

export async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = (await response.json()) as ApiError;

    throw {
      status: response.status,
      message: errorBody.message || "Erro inesperado",
      errors: errorBody.errors,
    } as ApiError;
  }

  return (await response.json()) as T;
}
