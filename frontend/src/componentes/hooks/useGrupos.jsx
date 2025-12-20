import { useQuery } from '@tanstack/react-query';
import { fetchGrupoById, fetchGrupos } from '../api/grupos';

export const useGrupos = () => {
  return useQuery({
    queryKey: ['grupos'],
    queryFn: fetchGrupos,
    refetchOnWindowFocus: false
  });
};

export const useGrupoById = (id) => {
  return useQuery({
    queryKey: ['grupo', id],
    queryFn : () => fetchGrupoById(id),
    refetchOnWindowFocus: false
  });
}