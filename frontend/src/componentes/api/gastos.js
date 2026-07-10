import { apiClient, ensureCsrfCookie } from "./client.js";

export const fetchGastosByObra = async (obraId) => {
  const { data } = await apiClient.get(`/obras/${obraId}/gastos`);
  return data;
};

export const upsertProyeccionGasto = async (obraId, importeProyeccion) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.put(`/obras/${obraId}/gastos/proyeccion`, {
    importe_proyeccion: importeProyeccion,
  });
  return data;
};
