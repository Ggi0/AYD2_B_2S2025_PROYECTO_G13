// src/services/Gerencial/gerencial.js
import apiService from "../api";

/**
 * Corte diario de operaciones y facturación por sede
 * GET /api/gerencial/corte-diario
 */
export const getCorteDiario = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.fecha) query.append("fecha", params.fecha);
  if (params.sede) query.append("sede", params.sede);
  const url = `/gerencial/corte-diario${query.toString() ? "?" + query.toString() : ""}`;
  return apiService["request"](url, { method: "GET" });
};

/**
 * KPIs de rentabilidad y cumplimiento
 * GET /api/gerencial/kpis?desde=YYYY-MM-DD&hasta=YYYY-MM-DD&sede=guatemala
 * @param {Object} params - { desde, hasta, sede }
 */
export const getKPIs = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.desde) query.append("desde", params.desde);
  if (params.hasta) query.append("hasta", params.hasta);
  if (params.sede) query.append("sede", params.sede);
  const url = `/gerencial/kpis${query.toString() ? "?" + query.toString() : ""}`;
  return apiService["request"](url, { method: "GET" });
};

/**
 * Alertas de desviación (clientes con baja carga, rutas con exceso de costo)
 * GET /api/gerencial/alertas
 */
export const getAlertas = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.desde) query.append("desde", params.desde);
  if (params.hasta) query.append("hasta", params.hasta);
  const url = `/gerencial/alertas${query.toString() ? "?" + query.toString() : ""}`;
  return apiService["request"](url, { method: "GET" });
};