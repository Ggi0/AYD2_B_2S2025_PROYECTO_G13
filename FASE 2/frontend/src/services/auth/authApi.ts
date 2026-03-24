// src/services/auth/authApi.ts
// Importación de tipos usando "type"
import type { 
  LoginPayload, 
  RegisterPayload, 
  LoginResponse, 
  RegisterResponse,
  MeResponse,
  AuthUser
} from '../api';

// Importación de valores usando import normal
import apiService from '../api';

// Re-exportar tipos para mantener compatibilidad
export type { 
  LoginPayload, 
  RegisterPayload, 
  LoginResponse, 
  RegisterResponse,
  MeResponse,
  AuthUser
};

export async function loginRequest(payload: LoginPayload) {
  try {
    const response = await apiService.login(payload);
    return {
      ok: response.ok,
      mensaje: response.mensaje,
      data: response.data
    };
  } catch (error) {
    throw error;
  }
}



export async function registerRequest(payload: RegisterPayload) {
  try {
    const response = await apiService.register(payload);
    return {
      ok: response.ok,
      mensaje: response.mensaje,
      data: response.data
    };
  } catch (error) {
    throw error;
  }
}

export async function meRequest(token: string) {
  try {
    const response = await apiService.getMe(token);
    return {
      ok: response.ok,
      mensaje: response.mensaje,
      data: response.data
    };
  } catch (error) {
    throw error;
  }
}