import { request } from "./api";
import type { LoginRequest, MeResponse, RegisterRequest, TokenResponse } from "../types/auth";

export const AUTH_TOKEN_KEY = "authToken";

export async function login(payload: LoginRequest): Promise<TokenResponse> {
  return request<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(payload: RegisterRequest): Promise<TokenResponse> {
  return request<TokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function me(): Promise<MeResponse> {
  return request<MeResponse>("/auth/me");
}

export function saveToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}