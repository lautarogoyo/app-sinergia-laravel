import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eliminarProveedor, obtenerProveedorPorId } from "./proveedoresStorage.js";

export default function RemovePersona() {
  const { id } = useParams();
  const navigate = useNavigate();

  const proveedor = useMemo(() => obtenerProveedorPorId(id), [id]);

  const confirmarEliminacion = () => {
    eliminarProveedor(id);
    navigate("/personas");
  };

  if (!proveedor) {
    return (
      <div className="p-8 bg-gray-100 w-full flex flex-col items-center">
        <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl border border-gray-300 p-6">
          <h1 className="text-3xl text-gray-800 mb-4 font-sans">Eliminar Proveedor</h1>
          <p className="text-gray-600 mb-6">No se encontro el proveedor solicitado.</p>
          <button
            type="button"
            onClick={() => navigate("/personas")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
          >
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
          Esta seguro que desea eliminar al proveedor <strong>{[proveedor.nombre, proveedor.apellido].filter(Boolean).join(" ")}</strong>?
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={confirmarEliminacion}
            className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
          >
            Confirmar Eliminacion
          </button>
          <button
            type="button"
            onClick={() => navigate("/personas")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
