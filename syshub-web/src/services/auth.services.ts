import api from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  nombre_completo: string;
  email: string;
  registro: string;
  carrera: string;
  fecha_nacimiento: string;
  password: string;
}

export interface AuhtResponse {
  access_token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuhtResponse> {
    const response = await api.post<AuhtResponse>("/auth/login", credentials);
    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
    }
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuhtResponse> {
    const response = await api.post<AuhtResponse>(
      "/auth/register",
      credentials,
    );
    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("access_token");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  },

  getToken(): string | null {
    return localStorage.getItem("access_token");
  },
};
