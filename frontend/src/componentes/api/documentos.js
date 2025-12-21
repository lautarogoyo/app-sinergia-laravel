import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;


export const fetchEmpleadoDocumentaciones = async (id) => {
    const { data } = await axios.get(`${backendUrl}/api/empleados/${id}`);
    return data.empleado;
};

export const updateDocumentacionAPI = async (id, formData) => {
    const { data } = await axios.put(`${backendUrl}/api/documentaciones/${id}`, formData);
    return data;
};

export const createDocumentacionAPI = async (formData) => {
    const { data } = await axios.post(`${backendUrl}/api/documentaciones`, formData);
    return data;
};