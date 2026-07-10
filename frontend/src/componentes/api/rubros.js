import { apiClient, ensureCsrfCookie } from "./client.js";

export const fetchRubros = async () => {
  const { data } = await apiClient.get("/rubros");
  return data.rubros;
};

export const PostRubro = async (rubro) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.post("/rubros", rubro);
  return data;
};

export const UpdateRubro = async (id, rubro) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.put(`/rubros/${id}`, rubro);
  return data;
};

export const DeleteRubro = async (id) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.delete(`/rubros/${id}`);
  return data;
};
