import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRubros, fetchRubroById, PostRubro, UpdateRubro, DeleteRubro } from "../api/rubros";

export const useRubros = () => {
  return useQuery({
    queryKey: ["rubros"],
    queryFn: fetchRubros,
    refetchOnWindowFocus: false,
  });
};

export const useRubroById = (id) => {
  return useQuery({
    queryKey: ["rubro", id],
    queryFn: () => fetchRubroById(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export const useCreateRubro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PostRubro,
    onSuccess: () => queryClient.invalidateQueries(["rubros"]),
    onError: (e) => console.error(e),
  });
};

export const useUpdateRubro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...rubro }) => UpdateRubro(id, rubro),
    onSuccess: () => queryClient.invalidateQueries(["rubros"]),
    onError: (e) => console.error(e),
  });
};

export const useDeleteRubro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeleteRubro,
    onSuccess: () => queryClient.invalidateQueries(["rubros"]),
    onError: (e) => console.error(e),
  });
};
