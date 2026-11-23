import { apiClient, ensureCsrfCookie } from "./client.js";

export const fetchFacturasByObra = async (nroObra) => {
  const { data } = await apiClient.get(`/obras/${nroObra}/facturas`);
  return data.facturas;
};

export const createFactura = async (nroObra, payload) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.post(`/obras/${nroObra}/facturas`, payload);
  return data.factura;
};

export const updateFactura = async (nroObra, facturaId, payload) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.put(`/obras/${nroObra}/facturas/${facturaId}`, payload);
  return data.factura;
};

export const deleteFactura = async (nroObra, facturaId) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.delete(`/obras/${nroObra}/facturas/${facturaId}`);
  return data;
};

export const fetchFacturasReporteMensual = async (params) => {
  const { data } = await apiClient.get("/facturas/reporte-mensual", { params });
  return data;
};

export const fetchImpuestos = async (nroObra, facturaId) => {
    const { data } = await apiClient.get(`/obras/${nroObra}/facturas/${facturaId}/impuestos`);
    return data.impuestos;
};

export const upsertImpuestos = async (nroObra, facturaId, payload) => {
    await ensureCsrfCookie();
    const { data } = await apiClient.put(`/obras/${nroObra}/facturas/${facturaId}/impuestos`, payload);
    return data.impuestos;
};
