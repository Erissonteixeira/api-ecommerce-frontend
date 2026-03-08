export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  whatsapp: string;
  cpf: string;
  senha: string;
}

export interface TokenResponse {
  token: string;
  type: string;
}

export interface MeResponse {
  id: number;
  nome: string;
  email: string;
}