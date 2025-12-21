import { useQuery } from '@tanstack/react-query';
import { fetchEmpleadoById, fetchEmpleados } from '../api/empleados.js';

export const useEmpleados = () => {
  return useQuery({
    queryKey: ['empleados'],
    queryFn: fetchEmpleados,
    refetchOnWindowFocus: false
  });
};

export const useEmpleadoById = (id) => {
  return useQuery({
    queryKey: ['empleado', id],
    queryFn : () => fetchEmpleadoById(id),
    refetchOnWindowFocus: false
  });
}