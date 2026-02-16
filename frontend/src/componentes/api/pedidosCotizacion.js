import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;

// Pedidos de cotización (nested under obra)
export const fetchPedidosCotizacion = async (obraId) => {
  const { data } = await axios.get(`${backendUrl}/api/obras/${obraId}/pedidos_cotizacion`);
  return Array.isArray(data.pedidos) ? data.pedidos : [];
};

export const createPedidoCotizacion = async (obraId, formData) => {
  const { data } = await axios.post(
    `${backendUrl}/api/obras/${obraId}/pedidos_cotizacion`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

export const updatePedidoCotizacion = async (obraId, pedidoId, formData) => {
  const { data } = await axios.post(
    `${backendUrl}/api/obras/${obraId}/pedidos_cotizacion/${pedidoId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      params: { _method: "PUT" },
    }
  );
  return data;
};

export const deletePedidoCotizacion = async (obraId, pedidoId) => {
  const { data } = await axios.delete(
    `${backendUrl}/api/obras/${obraId}/pedidos_cotizacion/${pedidoId}`
  );
  return data;
};
