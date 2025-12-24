import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;

export const fetchObras = async () => {
  const { data } = await axios.get(`${backendUrl}/api/obras`);
  return data.obras;
};

export const fetchObraById = async (id) => {
  const { data } = await axios.get(`${backendUrl}/api/obras/${id}`);
  return data.obra;
};

export const PostObra = async (obra) => {
    const { data } = await axios.post(`${backendUrl}/api/obras`, obra);
    return data;
}

export const UpdateObra = async (id, obra) => {
  const {data} = await axios.put(`${backendUrl}/api/obras/${id}`, obra);
  return data;
}

export const DeleteObra = async (id) => {
  const {data} = await axios.delete(`${backendUrl}/api/obras/${id}`);
  return data;
}