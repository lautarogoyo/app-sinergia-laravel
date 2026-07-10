import { apiClient, ensureCsrfCookie } from "./client.js";

export const fetchGrupos = async () => {
  const { data } = await apiClient.get("/grupos");
  return data.grupos;
};

export const fetchGrupoById = async (id) => {
  const { data } = await apiClient.get(`/grupos/${id}`);
  return data.grupo;
};

export const PostGrupo = async (grupo) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.post("/grupos", grupo);
  return data;
}

export const UpdateGrupo = async (id, grupo) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.put(`/grupos/${id}`, grupo);
  return data;
}

export const DeleteGrupo = async (id) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.delete(`/grupos/${id}`);
  return data;
}

export const fetchEstadoGrupo = async () => {
  const { data } = await apiClient.get("/estado_grupos");
  return data;
}
