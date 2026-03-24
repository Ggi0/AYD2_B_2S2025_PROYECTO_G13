// src/services/api.ts
const viteEnv = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env;
const API_BASE_URL = viteEnv?.VITE_API_URL || "http://localhost:3001/api";

// Tipos exportados con "export type"
export type ApiResponse<T = any> = {
  ok: boolean;
  mensaje: string;
  data: T;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  nit: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
};

// src/services/api.ts (actualizar el tipo AuthUser)
export type AuthUser = {
  id?: number;
  email: string;
  role: string;
  nombres?: string;
  apellidos?: string;
  empresa?: string; // Añadir campo de empresa si está disponible
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type RegisterResponse = {
  id: number;
  email: string;
  role: string;
};

export type MeResponse = {
  sub?: string;
  email?: string;
  role?: string;
  nombres?: string;
  apellidos?: string;
};

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.mensaje || "Error en la solicitud");
    }

    return data as ApiResponse<T>;
  }

  async login(payload: LoginPayload): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async register(payload: RegisterPayload): Promise<ApiResponse<RegisterResponse>> {
    return this.request<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async getMe(token: string): Promise<ApiResponse<MeResponse>> {
    return this.request<MeResponse>("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getCurrentUser(): AuthUser | null {
    const rawUser = localStorage.getItem('authUser');
    if (!rawUser) return null;
    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}

export const apiService = new ApiService();
export default apiService;