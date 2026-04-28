import axios from "axios";

const backendUrl = import.meta.env.VITE_API_URL;

export const fetchTiposFacturacion = async () => {
  const { data } = await axios.get(`${backendUrl}/api/tipos_facturacion`);
  return data.tipos_facturacion ?? [];
};