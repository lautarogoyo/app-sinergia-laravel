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

export const updateFactura = async (nroObra, nroFactura, payload) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.put(`/obras/${nroObra}/facturas/${nroFactura}`, payload);
  return data.factura;
};

export const deleteFactura = async (nroObra, nroFactura) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.delete(`/obras/${nroObra}/facturas/${nroFactura}`);
  return data;
};

export const fetchFacturasReporteMensual = async (params) => {
  const { data } = await apiClient.get("/facturas/reporte-mensual", { params });
  return data;
};

export const fetchImpuestos = async (nroObra, nroFactura) => {
    const { data } = await apiClient.get(`/obras/${nroObra}/facturas/${nroFactura}/impuestos`);
    return data.impuestos;
};

export const upsertImpuestos = async (nroObra, nroFactura, payload) => {
    await ensureCsrfCookie();
    const { data } = await apiClient.put(`/obras/${nroObra}/facturas/${nroFactura}/impuestos`, payload);
    return data.impuestos;
};
