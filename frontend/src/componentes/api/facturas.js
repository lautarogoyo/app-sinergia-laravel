import axios from "axios";
const base = import.meta.env.VITE_API_URL;

export const fetchFacturasByObra = async (nroObra) => {
  const { data } = await axios.get(`${base}/api/obras/${nroObra}/facturas`);
  return data.facturas;
};

export const createFactura = async (nroObra, payload) => {
  const { data } = await axios.post(`${base}/api/obras/${nroObra}/facturas`, payload);
  return data.factura;
};

export const updateFactura = async (nroObra, nroFactura, payload) => {
  const { data } = await axios.put(`${base}/api/obras/${nroObra}/facturas/${nroFactura}`, payload);
  return data.factura;
};

export const deleteFactura = async (nroObra, nroFactura) => {
  const { data } = await axios.delete(`${base}/api/obras/${nroObra}/facturas/${nroFactura}`);
  return data;
};