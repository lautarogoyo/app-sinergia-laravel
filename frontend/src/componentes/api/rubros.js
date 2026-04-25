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
