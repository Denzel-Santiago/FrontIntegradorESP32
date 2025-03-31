// usuario.interface.ts
export interface Usuario {
  id: number;
  name: string;
  lastname: string;
  email: string;
  roleId?: number | null;
  isPremium: boolean;
}

export interface UsuarioCreate {
  name: string;
  lastname: string;
  email: string;
  password: string;
  roleId?: number | null;
  isPremium: boolean;
}

export interface UsuarioUpdate extends Partial<UsuarioCreate> {
  id: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user: Usuario;
}