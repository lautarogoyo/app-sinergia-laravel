import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;

export const fetchGrupos = async () => {
  const { data } = await axios.get(`${backendUrl}/api/grupos`);
  return data.grupos;
};

export const fetchGrupoById = async (id) => {
  const { data } = await axios.get(`${backendUrl}/api/grupos/${id}`);
  return data.grupo;
};

export const PostGrupo = async (grupo) => {
    const { data } = await axios.post(`${backendUrl}/api/grupos`, grupo);
    return data;
}

export const UpdateGrupo = async (id, grupo) => {
  const {data} = await axios.put(`${backendUrl}/api/grupos/${id}`, grupo);
  return data;
}

export const DeleteGrupo = async (id) => {
  const {data} = await axios.delete(`${backendUrl}/api/grupos/${id}`);
  return data;
}