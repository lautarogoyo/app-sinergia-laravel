import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGrupoById } from "../hooks/useGrupos";
import { DeleteGrupo } from "../api/grupos";

export default function RemoveGrupo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: grupo, isLoading } = useGrupoById(id);

  const { mutate, isPending } = useMutation({
    mutationFn: () => DeleteGrupo(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["grupos"]);
      navigate("/personas"); // o "/grupos" según tu flujo
    },
    onError: (e) => console.error("Error al eliminar el grupo", e),
  });

  if (isLoading) return <p className="p-8 text-gray-500">Cargando...</p>;

  if (!grupo) {
    return (
      <div className="p-8 bg-gray-100 w-full flex flex-col items-center">
        <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl border border-gray-300 p-6">
          <h1 className="text-3xl text-gray-800 mb-4 font-sans">Eliminar Grupo</h1>
          <p className="text-gray-600 mb-6">No se encontró el grupo solicitado.</p>
          <button type="button" onClick={() => navigate("/personas")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 w-full flex flex-col items-center">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl border border-gray-300 p-6">
        <h1 className="text-3xl text-gray-800 mb-4 font-sans">Eliminar Grupo</h1>
        <p className="mb-6 text-red-600 text-lg">
          ¿Está seguro que desea eliminar el grupo <strong>{grupo.denominacion}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => mutate()} disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 disabled:opacity-50">
            {isPending ? "Eliminando..." : "Confirmar Eliminación"}
          </button>
          <button type="button" onClick={() => navigate("/personas")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}