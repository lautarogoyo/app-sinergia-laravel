import { useQuery } from '@tanstack/react-query';
import { fetchEmpleadoDocumentaciones } from '../api/documentos.js';

export const useDocumentos = (id) => {
  return useQuery({
    queryKey: ['empleado', id],
    queryFn: () => fetchEmpleadoDocumentaciones(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};
