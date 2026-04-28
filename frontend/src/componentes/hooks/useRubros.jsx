import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRubros, PostRubro, UpdateRubro, DeleteRubro } from "../api/rubros";

export const useRubros = () => {
  return useQuery({
    queryKey: ["rubros"],
    queryFn: fetchRubros,
    refetchOnWindowFocus: false,
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

export const useUpdateRubro = (id, onSuccess) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => UpdateRubro(id, data),
    onSuccess: () => { queryClient.invalidateQueries(["rubros"]); onSuccess?.(); },
    onError: (e) => console.error(e),
  });
};

export const useDeleteRubro = (onSuccess) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeleteRubro,
    onSuccess: () => { queryClient.invalidateQueries(["rubros"]); onSuccess?.(); },
    onError: (e) => console.error(e),
  });
};
