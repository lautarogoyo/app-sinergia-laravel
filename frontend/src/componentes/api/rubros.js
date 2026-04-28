import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;

export const fetchRubros = async () => {
  const { data } = await axios.get(`${backendUrl}/api/rubros`);
  return data.rubros;
};

export const PostRubro = async (rubro) => {
  const { data } = await axios.post(`${backendUrl}/api/rubros`, rubro);
  return data;
};

export const UpdateRubro = async (id, rubro) => {
  const { data } = await axios.put(`${backendUrl}/api/rubros/${id}`, rubro);
  return data;
};

export const DeleteRubro = async (id) => {
  const { data } = await axios.delete(`${backendUrl}/api/rubros/${id}`);
  return data;
};
