import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;


export const fetchEmpleadoDocumentaciones = async (empleadoId) => {
  const { data } = await axios.get(
    `${backendUrl}/api/empleados/${empleadoId}/documentaciones`
  );
  return data.documentaciones;
};


export const updateDocumentacionAPI = async (
  empleadoId,
  documentacionId,
  formData
) => {
  formData.append("_method", "PUT");

  const { data } = await axios.post(
    `${backendUrl}/api/empleados/${empleadoId}/documentaciones/${documentacionId}`,
    formData
  );

  return data;
};

export const createDocumentacionAPI = async (empleadoId, formData) => {
  const { data } = await axios.post(
    `${backendUrl}/api/empleados/${empleadoId}/documentaciones`,
    formData
  );
  return data;
};



export const deleteDocumentacionAPI = async (empleadoId, documentacionId) => {
  const { data } = await axios.delete(
    `${backendUrl}/api/empleados/${empleadoId}/documentaciones/${documentacionId}`
  );
  return data;
};
