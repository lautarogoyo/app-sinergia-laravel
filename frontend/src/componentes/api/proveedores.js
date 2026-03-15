import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;

export const fetchProveedores = async () => {
  const { data } = await axios.get(`${backendUrl}/api/proveedores`);
  return data.proveedores;
};

export const fetchProveedorById = async (id) => {
  const { data } = await axios.get(`${backendUrl}/api/proveedores/${id}`);
  return data.proveedor;
};

export const PostProveedor = async (proveedor) => {
  const { data } = await axios.post(`${backendUrl}/api/proveedores`, proveedor);
  return data;
};

export const UpdateProveedor = async (id, proveedor) => {
  const { data } = await axios.put(`${backendUrl}/api/proveedores/${id}`, proveedor);
  return data;
};

export const DeleteProveedor = async (id) => {
  const { data } = await axios.delete(`${backendUrl}/api/proveedores/${id}`);
  return data;
};