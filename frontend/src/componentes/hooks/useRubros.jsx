import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRubros, PostRubro } from "../api/rubros";

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
