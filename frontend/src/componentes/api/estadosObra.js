import { apiClient } from "./client.js";

export const fetchEstadosObra = async () => {
  const { data } = await apiClient.get("/estados_obras");
  return data.estados;
};
