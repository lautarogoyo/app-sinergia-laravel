import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;

// Pedidos de compra
export const fetchPedidosCompra = async () => {
  const { data } = await axios.get(`${backendUrl}/api/pedidos_compra`);
  return Array.isArray(data.pedido_compra) ? data.pedido_compra : [];
};

export const createPedidoCompra = async (formData) => {
  const { data } = await axios.post(`${backendUrl}/api/pedidos_compra`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updatePedidoCompra = async (pedidoId, formData) => {
  const { data } = await axios.post(`${backendUrl}/api/pedidos_compra/${pedidoId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: { _method: "PUT" },
  });
  return data;
};

export const deletePedidoCompra = async (pedidoId) => {
  const { data } = await axios.delete(`${backendUrl}/api/pedidos_compra/${pedidoId}`);
  return data;
};
