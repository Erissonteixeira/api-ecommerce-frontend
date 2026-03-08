import type { ApiError, FieldErrorItem } from "../types/apiError";

const BASE_URL = "http://localhost:8080";
const TOKEN_KEY = "authToken";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toFieldErrors(value: unknown): Record<string, string> | undefined {
  if (!Array.isArray(value)) return undefined;

  const result: Record<string, string> = {};

  for (const item of value) {
    if (!isObject(item)) continue;

    const field = typeof item.field === "string" ? item.field : null;
    const message = typeof item.message === "string" ? item.message : null;

    if (field && message) {
      result[field] = message;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();

  const headers = new Headers(options?.headers ?? {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Erro inesperado";
    let fieldErrors: Record<string, string> | undefined = undefined;

    try {
      const body: unknown = await response.json();

      if (isObject(body)) {
        if (typeof body.message === "string" && body.message.trim()) {
          message = body.message;
        }

        if ("fieldErrors" in body) {
          fieldErrors = toFieldErrors(body.fieldErrors as FieldErrorItem[]);
        }
      }
    } catch {
      
    }

    const apiError: ApiError = {
      status: response.status,
      message,
      fieldErrors,
    };

    throw apiError;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data: unknown = await response.json();
  return data as T;
}