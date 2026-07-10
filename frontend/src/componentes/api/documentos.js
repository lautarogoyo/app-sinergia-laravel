import { apiClient, ensureCsrfCookie } from "./client.js";

export const fetchEmpleadoDocumentaciones = async (empleadoId) => {
  const { data } = await apiClient.get(
    `/empleados/${empleadoId}/documentaciones`
  );
  return data.documentaciones;
};


export const updateDocumentacionAPI = async (
  empleadoId,
  documentacionId,
  formData
) => {
  formData.append("_method", "PUT");

  await ensureCsrfCookie();
  const { data } = await apiClient.post(
    `/empleados/${empleadoId}/documentaciones/${documentacionId}`,
    formData
  );

  return data;
};

export const createDocumentacionAPI = async (empleadoId, formData) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.post(
    `/empleados/${empleadoId}/documentaciones`,
    formData
  );
  return data;
};



export const deleteDocumentacionAPI = async (empleadoId, documentacionId) => {
  await ensureCsrfCookie();
  const { data } = await apiClient.delete(
    `/empleados/${empleadoId}/documentaciones/${documentacionId}`
  );
  return data;
};
