import { useQuery } from "@tanstack/react-query";
import { fetchTiposFacturacion } from "../api/tiposFacturacion";

export const useTiposFacturacion = () =>
  useQuery({
    queryKey: ["tipos_facturacion"],
    queryFn: fetchTiposFacturacion,
    refetchOnWindowFocus: false,
  });