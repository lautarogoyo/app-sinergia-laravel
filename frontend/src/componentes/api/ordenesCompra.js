import axios from "axios";
const base = import.meta.env.VITE_API_URL;

export const fetchOrdenesByObra = async (nroObra) => {
  const { data } = await axios.get(`${base}/api/obras/${nroObra}/ordenes_compra`);
  return data.ordenes;
};

export const createOrden = async (nroObra, payload) => {
  const { data } = await axios.post(`${base}/api/obras/${nroObra}/ordenes_compra`, payload);
  return data.orden;
};

export const updateOrden = async (nroObra, nroOc, payload) => {
  const { data } = await axios.put(`${base}/api/obras/${nroObra}/ordenes_compra/${nroOc}`, payload);
  return data.orden;
};

export const deleteOrden = async (nroObra, nroOc) => {
  const { data } = await axios.delete(`${base}/api/obras/${nroObra}/ordenes_compra/${nroOc}`);
  return data;
};