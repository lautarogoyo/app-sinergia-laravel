import { apiClient, ensureCsrfCookie } from "./client.js";

// Pedidos de cotización (nested under obra)
export const fetchPedidosCotizacion = async (obraId) => {
  const { data } = await apiClient.get(`/obras/${obraId}/pedidos_cotizacion`);
  return Array.isArray(data.pedidos) ? data.pedidos : [];
};

export const createPedidoCotizacion = async (obraId, formData) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.post(
    `/obras/${obraId}/pedidos_cotizacion`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

export const updatePedidoCotizacion = async (obraId, pedidoId, formData) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.post(
    `/obras/${obraId}/pedidos_cotizacion/${pedidoId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      params: { _method: "PUT" },
    }
  );
  return data;
};

export const deletePedidoCotizacion = async (obraId, pedidoId) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.delete(
    `/obras/${obraId}/pedidos_cotizacion/${pedidoId}`
  );
  return data;
};
