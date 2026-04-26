import Swal from "sweetalert2";
import { useDeleteRubro } from "../../hooks/useRubros";

export default function RubroDeleteModal({ rubro, onClose }) {
  const { mutate: eliminar, isPending } = useDeleteRubro(onClose);

  const handleDelete = () => {
    eliminar(rubro.rubro_id, {
      onError: () => Swal.fire("Error", "No se pudo eliminar el rubro", "error"),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-full max-w-md">
        <h3 className="text-2xl font-extrabold mb-2 text-gray-800">Eliminar Rubro</h3>
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que querés eliminar el rubro{" "}
          <strong>{rubro.descripcion}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-base font-semibold py-2 px-4 rounded shadow transition duration-150"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white text-base font-bold py-2 px-4 rounded shadow transition duration-150 disabled:opacity-50"
          >
            {isPending ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
