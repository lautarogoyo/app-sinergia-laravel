import { apiClient, ensureCsrfCookie } from "./client.js";

export const fetchOrdenesByObra = async (nroObra) => {
  const { data } = await apiClient.get(`/obras/${nroObra}/ordenes_compra`);
  return data.ordenes;
};

export const createOrden = async (nroObra, payload) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.post(`/obras/${nroObra}/ordenes_compra`, payload);
  return data.orden;
};

export const updateOrden = async (nroObra, nroOc, payload) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.put(`/obras/${nroObra}/ordenes_compra/${nroOc}`, payload);
  return data.orden;
};

export const deleteOrden = async (nroObra, nroOc) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.delete(`/obras/${nroObra}/ordenes_compra/${nroOc}`);
  return data;
};
