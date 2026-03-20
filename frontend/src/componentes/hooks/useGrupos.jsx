import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEstadoGrupo, fetchGrupoById, fetchGrupos, UpdateGrupo } from '../api/grupos';

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

export const useEstadosGrupo = () => {
  return useQuery({
    queryKey: ['estadosGrupo'],
    queryFn: () => fetchEstadoGrupo(),
    refetchOnWindowFocus: false
  });
}

// Agregar al archivo existente:
export const useUpdateEstadoGrupo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }) => UpdateGrupo(id, { estado }),
    onSuccess: () => queryClient.invalidateQueries(["grupos"]),
    onError: (e) => console.error(e),
  });
};