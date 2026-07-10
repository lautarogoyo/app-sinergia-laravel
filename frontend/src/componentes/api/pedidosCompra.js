import { apiClient, ensureCsrfCookie } from "./client.js";

// Pedidos de compra
export const fetchPedidosCompra = async () => {
  const { data } = await apiClient.get("/pedidos_compra");
  return Array.isArray(data.pedido_compra) ? data.pedido_compra : [];
};

export const createPedidoCompra = async (formData) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.post("/pedidos_compra", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updatePedidoCompra = async (pedidoId, formData) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.post(`/pedidos_compra/${pedidoId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: { _method: "PUT" },
  });
  return data;
};

export const deletePedidoCompra = async (pedidoId) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.delete(`/pedidos_compra/${pedidoId}`);
  return data;
};
