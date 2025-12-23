import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;


export const fetchTipoDocumento = async () => {
    const { data } = await axios.get(`${backendUrl}/api/tipos_documento`);
    return data;
};
