import { useNavigate, useParams } from "react-router-dom";
import { useProveedorById, useDeleteProveedor } from "../hooks/useProveedores";

export default function RemovePersona() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: proveedor, isLoading } = useProveedorById(id);
  const { mutate, isPending } = useDeleteProveedor(() => navigate("/personas"));

  if (isLoading) return <p className="p-8 text-gray-500">Cargando...</p>;

  if (!proveedor) {
    return (
      <div className="p-8 bg-gray-100 w-full flex flex-col items-center">
        <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl border border-gray-300 p-6">
          <h1 className="text-3xl text-gray-800 mb-4 font-sans">Eliminar Proveedor</h1>
          <p className="text-gray-600 mb-6">No se encontró el proveedor solicitado.</p>
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
        <h1 className="text-3xl text-gray-800 mb-4 font-sans">Eliminar Proveedor</h1>
        <p className="mb-6 text-red-600 text-lg">
          ¿Está seguro que desea eliminar al proveedor{" "}
          <strong>{[proveedor.nombre, proveedor.apellido].filter(Boolean).join(" ")}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => mutate(id)} disabled={isPending}
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