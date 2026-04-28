import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProveedores,
  fetchProveedorById,
  PostProveedor,
  UpdateProveedor,
  DeleteProveedor,
} from "../api/proveedores";

export const useProveedores = () =>
  useQuery({
    queryKey: ["proveedores"],
    queryFn: fetchProveedores,
    refetchOnWindowFocus: false,
  });

export const useProveedorById = (id) =>
  useQuery({
    queryKey: ["proveedor", id],
    queryFn: () => fetchProveedorById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

const useProveedorMutation = (mutationFn, onSuccessCb) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
      onSuccessCb?.();
    },
    onError: (e) => console.error(e),
  });
};

export const useCreateProveedor = (onSuccess) =>
  useProveedorMutation(PostProveedor, onSuccess);

export const useUpdateProveedor = (id, onSuccess) =>
  useProveedorMutation((data) => UpdateProveedor(id, data), onSuccess);

export const useDeleteProveedor = (onSuccess) =>
  useProveedorMutation((id) => {
    console.log("Eliminando proveedor id:", id); // 👈
    return DeleteProveedor(id);
  }, onSuccess);