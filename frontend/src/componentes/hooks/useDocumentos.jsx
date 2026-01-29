import { useQuery } from '@tanstack/react-query';
import { fetchEmpleadoDocumentaciones } from '../api/documentos.js';

export const useDocumentos = (empleadoId) => {
  return useQuery({
    queryKey: ['documentaciones', empleadoId],
    queryFn: () => fetchEmpleadoDocumentaciones(empleadoId),
    enabled: !!empleadoId,
  });
};

