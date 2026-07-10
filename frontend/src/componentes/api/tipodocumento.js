import { apiClient } from "./client.js";

export const fetchTipoDocumento = async () => {
    const { data } = await apiClient.get("/tipos_documentacion");
    return data;
};
