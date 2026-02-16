import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;


export const getComentariosByObra = async (obraId) => {
    const { data } = await axios.get(`${backendUrl}/api/obras/${obraId}/comentarios`);
    return data.comentarios;
};

export const createComentario = async ({ obraId, denominacion }) => {
    const { data } = await axios.post(`${backendUrl}/api/obras/${obraId}/comentarios`, { denominacion });
    return data;
};

export const deleteComentario = async ({ obraId, comentarioId }) => {
    const { data } = await axios.delete(`${backendUrl}/api/obras/${obraId}/comentarios/${comentarioId}`);
    return data;
};