import { useQuery } from '@tanstack/react-query';
import { fetchGrupos } from '../api/grupos';

export const useGrupos = () => {
  return useQuery({
    queryKey: ['grupos'],
    queryFn: fetchGrupos,
    refetchOnWindowFocus: false
  });
};
