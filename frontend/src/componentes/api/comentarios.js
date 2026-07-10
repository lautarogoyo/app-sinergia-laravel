import { apiClient, ensureCsrfCookie } from "./client.js";

export const getComentariosByObra = async (obraId) => {
    const { data } = await apiClient.get(`/obras/${obraId}/comentarios`);
    return data.comentarios;
};

export const createComentario = async ({ obraId, detalle }) => {
    await ensureCsrfCookie();
    const { data } = await apiClient.post(`/obras/${obraId}/comentarios`, { detalle });
    return data;
};

export const deleteComentario = async ({ obraId, comentarioId }) => {
    await ensureCsrfCookie();
    const { data } = await apiClient.delete(`/obras/${obraId}/comentarios/${comentarioId}`);
    return data;
};

export const updateComentario = async ({ obraId, comentarioId, detalle }) => {
    await ensureCsrfCookie();
    const { data } = await apiClient.put(`/obras/${obraId}/comentarios/${comentarioId}`, { detalle });
    return data;
};
