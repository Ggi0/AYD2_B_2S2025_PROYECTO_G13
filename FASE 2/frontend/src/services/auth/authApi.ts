type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id?: number;
  email: string;
  role: string;
  nombres?: string;
  apellidos?: string;
};

type RegisterPayload = {
  nit: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
};

const viteEnv = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env;
const API_BASE_URL = viteEnv?.VITE_API_URL || "http://localhost:3000/api";

async function request<T>(endpoint: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

  return data as T;
}

export async function loginRequest(payload: LoginPayload) {
  return request<{ ok: boolean; mensaje: string; data: { token: string; user: { id: number; email: string; role: string } } }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function registerRequest(payload: RegisterPayload) {
  return request<{ ok: boolean; mensaje: string; data: { id: number; email: string; role: string } }>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function meRequest(token: string) {
  return request<{ ok: boolean; mensaje: string; data: { sub?: string; email?: string; role?: string } }>(
    "/auth/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
