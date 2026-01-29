import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchEmpleadoDocumentaciones,
  createDocumentacionAPI,
  updateDocumentacionAPI,
  deleteDocumentacionAPI
} from '../api/documentos.js';

export const useDocumentaciones = (empleadoId) => {
  return useQuery({
    queryKey: ['documentaciones', empleadoId],
    queryFn: () => fetchEmpleadoDocumentaciones(empleadoId),
    refetchOnWindowFocus: false,
    enabled: !!empleadoId
  });
};

export const useCreateDocumentacion = (empleadoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => createDocumentacionAPI(empleadoId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['documentaciones', empleadoId]);
      queryClient.invalidateQueries(['empleado', empleadoId]);
    }
  });
};

export const useUpdateDocumentacion = (empleadoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ docId, formData }) => updateDocumentacionAPI(empleadoId, docId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['documentaciones', empleadoId]);
      queryClient.invalidateQueries(['empleado', empleadoId]);
    }
  });
};

export const useDeleteDocumentacion = (empleadoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (docId) => deleteDocumentacionAPI(empleadoId, docId),
    onSuccess: () => {
      queryClient.invalidateQueries(['documentaciones', empleadoId]);
      queryClient.invalidateQueries(['empleado', empleadoId]);
    }
  });
};
