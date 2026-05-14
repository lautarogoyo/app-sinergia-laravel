import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;

export const fetchEstadosObra = async () => {
  const { data } = await axios.get(`${backendUrl}/api/estados_obras`);
  return data.estados;
};
