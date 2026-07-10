import { useQuery } from '@tanstack/react-query';
import { fetchUsuarioById, fetchUsuarios } from '../api/usuarios.js';

export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: fetchUsuarios,
    refetchOnWindowFocus: false,
  });
};

export const useUsuarioById = (id) => {
  return useQuery({
    queryKey: ['usuario', id],
    queryFn: () => fetchUsuarioById(id),
    refetchOnWindowFocus: false,
  });
};
