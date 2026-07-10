import { apiClient, ensureCsrfCookie } from "./client.js";

export const fetchUsuarios = async () => {
  const { data } = await apiClient.get("/usuarios");
  return data.usuarios;
};

export const fetchUsuarioById = async (id) => {
  const { data } = await apiClient.get(`/usuarios/${id}`);
  return data.usuario;
};

export const PostUsuario = async (usuario) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.post("/usuarios", usuario);
  return data;
};

export const UpdateUsuario = async (id, usuario) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.put(`/usuarios/${id}`, usuario);
  return data;
};

export const DeleteUsuario = async (id) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.delete(`/usuarios/${id}`);
  return data;
};
