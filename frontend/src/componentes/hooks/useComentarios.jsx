import { useQuery } from "@tanstack/react-query";
import { getComentariosByObra } from "../api/comentarios";

export const useComentariosByObra = (obraId) => {
    return useQuery({
        queryKey: ["comentarios", obraId],
        queryFn: () => getComentariosByObra(obraId),
        enabled: !!obraId,
    });
};