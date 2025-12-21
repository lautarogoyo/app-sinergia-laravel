import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;

export const fetchEmpleados = async () => {
  const { data } = await axios.get(`${backendUrl}/api/empleados`);
  return data.empleados;
};

export const fetchEmpleadoById = async (id) => {
  const { data } = await axios.get(`${backendUrl}/api/empleados/${id}`);
  return data.empleado;
};

export const PostEmpleado = async (empleado) => {
    const { data } = await axios.post(`${backendUrl}/api/empleados`, empleado);
    return data;
}

export const UpdateEmpleado = async (id, empleado) => {
  const {data} = await axios.put(`${backendUrl}/api/empleados/${id}`, empleado);
  return data;
}

export const DeleteEmpleado = async (id) => {
  const {data} = await axios.delete(`${backendUrl}/api/empleados/${id}`);
  return data;
}