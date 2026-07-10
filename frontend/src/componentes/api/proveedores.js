import { apiClient, ensureCsrfCookie } from "./client.js";

export const fetchProveedores = async () => {
  const { data } = await apiClient.get("/proveedores");
  return data.proveedores;
};

export const fetchProveedorById = async (id) => {
  const { data } = await apiClient.get(`/proveedores/${id}`);
  return data.proveedor;
};

export const PostProveedor = async (proveedor) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.post("/proveedores", proveedor);
  return data;
};

export const UpdateProveedor = async (id, proveedor) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.put(`/proveedores/${id}`, proveedor);
  return data;
};

export const DeleteProveedor = async (id) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.delete(`/proveedores/${id}`);
  return data;
};
