import { apiClient, ensureCsrfCookie } from "./client.js";

export const fetchObras = async () => {
  const { data } = await apiClient.get("/obras");
  return data.obras;
};

export const fetchObraById = async (id) => {
  const { data } = await apiClient.get(`/obras/${id}`);
  return data.obra;
};

export const PostObra = async (obra) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.post("/obras", obra);
  return data;
}

export const UpdateObra = async (id, obra) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.put(`/obras/${id}`, obra);
  return data;
}

export const DeleteObra = async (id) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.delete(`/obras/${id}`);
  return data;
}
