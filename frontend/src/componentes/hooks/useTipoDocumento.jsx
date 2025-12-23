import { useQuery } from '@tanstack/react-query';
import { fetchTipoDocumento } from '../api/tipodocumento.js';

export const useTipoDocumento = () => {
  return useQuery({
    queryKey: ['tipoDocumento'],
    queryFn: () => fetchTipoDocumento(),
    refetchOnWindowFocus: false,
  });
};
