import { apiClient } from "./client.js";

export const fetchTiposFacturacion = async () => {
  const { data } = await apiClient.get("/tipos_facturacion");
  return data.tipos_facturacion ?? [];
};
