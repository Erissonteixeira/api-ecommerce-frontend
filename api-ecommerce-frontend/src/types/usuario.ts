export type UsuarioResponse = {
  id: number;
  nome: string;
  email: string;
  whatsapp: string;
  cpf: string;
  criadoEm?: string;
  atualizadoEm?: string | null;
};

export type UsuarioRequest = {
  nome: string;
  email: string;
  whatsapp: string;
  cpf: string;
  senha: string;
};