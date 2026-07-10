import { apiClient, ensureCsrfCookie } from "./client.js";

export const fetchEmpleados = async () => {
  const { data } = await apiClient.get("/empleados");
  return data.empleados;
};

export const fetchEmpleadoById = async (id) => {
  const { data } = await apiClient.get(`/empleados/${id}`);
  return data.empleado;
};

export const PostEmpleado = async (empleado) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.post("/empleados", empleado);
  return data;
}

export const UpdateEmpleado = async (id, empleado) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.put(`/empleados/${id}`, empleado);
  return data;
}

export const DeleteEmpleado = async (id) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.delete(`/empleados/${id}`);
  return data;
}

export const fetchEstadosEmpleado = async () => {
  const { data } = await apiClient.get("/estados_empleados");
  return data.estados;
};
