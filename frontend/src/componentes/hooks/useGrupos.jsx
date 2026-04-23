import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEstadoGrupo, fetchGrupoById, fetchGrupos, UpdateGrupo, PostGrupo, DeleteGrupo } from '../api/grupos';

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

export const useCreateGrupo = (onSuccess) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PostGrupo,
    onSuccess: () => { queryClient.invalidateQueries(['grupos']); onSuccess?.(); },
    onError: (e) => console.error(e),
  });
};

export const useUpdateGrupo = (id, onSuccess) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grupo) => UpdateGrupo(id, grupo),
    onSuccess: () => { queryClient.invalidateQueries(['grupos']); onSuccess?.(); },
    onError: (e) => console.error(e),
  });
};

export const useDeleteGrupo = (onSuccess) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeleteGrupo,
    onSuccess: () => { queryClient.invalidateQueries(['grupos']); onSuccess?.(); },
    onError: (e) => console.error(e),
  });
};

export const useUpdateEstadoGrupo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }) => UpdateGrupo(id, { estado }),
    onSuccess: () => queryClient.invalidateQueries(["grupos"]),
    onError: (e) => console.error(e),
  });
};