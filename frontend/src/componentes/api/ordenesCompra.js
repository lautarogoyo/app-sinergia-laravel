import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;

// Ordenes de compra (nested under obra)
export const fetchOrdenesCompra = async (obraId) => {
  const { data } = await axios.get(`${backendUrl}/api/obras/${obraId}/ordenes_compra`);
  return Array.isArray(data.ordenes) ? data.ordenes : [];
};

export const createOrdenCompra = async (obraId, orden) => {
  const { data } = await axios.post(`${backendUrl}/api/obras/${obraId}/ordenes_compra`, orden);
  return data;
};

export const updateOrdenCompra = async (obraId, ordenId, orden) => {
  const { data } = await axios.put(`${backendUrl}/api/obras/${obraId}/ordenes_compra/${ordenId}`, orden);
  return data;
};

export const deleteOrdenCompra = async (obraId, ordenId) => {
  const { data } = await axios.delete(`${backendUrl}/api/obras/${obraId}/ordenes_compra/${ordenId}`);
  return data;
};
