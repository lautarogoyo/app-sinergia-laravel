import { useQuery } from '@tanstack/react-query';
import { fetchObraById, fetchObras } from '../api/grupos';

export const useObras = () => {
  return useQuery({
    queryKey: ['obras'],
    queryFn: fetchObras,
    refetchOnWindowFocus: false
  });
};

export const useObraById = (id) => {
  return useQuery({
    queryKey: ['obra', id],
    queryFn : () => fetchObraById(id),
    refetchOnWindowFocus: false
  });
}