import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;

export const fetchGrupos = async () => {
  const { data } = await axios.get(`${backendUrl}/api/grupos`);
  return data.grupos;
};

export const PostGrupo = async (grupo) => {
    const { data } = await axios.post(`${backendUrl}/api/grupos`, grupo);
    return data;
}