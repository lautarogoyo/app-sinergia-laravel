import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useRubros, useCreateRubro, useUpdateRubro, useDeleteRubro } from "../../hooks/useRubros.jsx";
import {useNavigate } from "react-router-dom";

function RubroModal({ rubro, onClose, onCreate, onUpdate }) {
  const isEdit = !!rubro;
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { descripcion: rubro?.descripcion ?? "" },
  });

  const onSubmit = handleSubmit((data) => {
    if (isEdit) {
      onUpdate({ id: rubro.rubro_id, descripcion: data.descripcion });
    } else {
      onCreate(data);
    }
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-full max-w-md">
        <h3 className="text-2xl font-extrabold mb-4 text-gray-800">
          {isEdit ? "Editar Rubro" : "Crear Rubro"}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="descripcion" className="mb-2 text-lg font-medium text-gray-700">
              Descripción
            </label>
            <input
              id="descripcion"
              type="text"
              {...register("descripcion", { required: "La descripción es obligatoria" })}
              className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Ej: Construcción"
            />
            {errors.descripcion && (
              <p className="text-red-600 text-sm font-semibold mt-1">{errors.descripcion.message}</p>
            )}
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg font-semibold py-2 px-4 rounded shadow transition duration-150"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150"
            >
              {isEdit ? "Guardar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Rubros() {
  const [filtro, setFiltro] = useState("");
  const [modalRubro, setModalRubro] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { isLoading, isError, data: rubros = [] } = useRubros();
  const { mutate: crear, isPending: creando } = useCreateRubro();
  const { mutate: editar, isPending: editando } = useUpdateRubro();
  const { mutate: eliminar } = useDeleteRubro();

  const handleCreate = (data) => {
    crear(data, {
      onSuccess: () => setShowModal(false),
      onError: () => Swal.fire("Error", "No se pudo crear el rubro", "error"),
    });
  };

  const handleUpdate = (data) => {
    editar(data, {
      onSuccess: () => setShowModal(false),
      onError: () => Swal.fire("Error", "No se pudo actualizar el rubro", "error"),
    });
  };

  const handleDelete = (rubro) => {
    Swal.fire({
      title: "¿Eliminar rubro?",
      text: `Se eliminará "${rubro.descripcion}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar(rubro.rubro_id, {
          onError: () => Swal.fire("Error", "No se pudo eliminar el rubro", "error"),
        });
      }
    });
  };

  const openCreate = () => {
    setModalRubro(null);
    setShowModal(true);
  };

  const openEdit = (rubro) => {
    setModalRubro(rubro);
    setShowModal(true);
  };

  if (isLoading) return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
      <div className="mt-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Rubros</h2>
        <div className="w-80 h-3 bg-gray-700 rounded-full overflow-hidden shadow-lg">
          <div className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full animate-loading-bar"></div>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
          <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
          <span className="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
        </div>
      </div>
    </div>
  );

  if (isError) return <div className="text-center text-xl py-8 text-red-500">Error al cargar los rubros</div>;

  const rubrosFiltrados = rubros.filter((r) =>
    (r.descripcion ?? "").toLowerCase().includes(filtro.toLowerCase()) ||
    (r.rubro_id ?? "").toString().includes(filtro)
  );
const navigate = useNavigate();
  return (
    <div className="p-8 bg-gray-100 lg:w-full flex flex-col">
      {(creando || editando) && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl px-8 py-6 text-gray-800 text-xl font-semibold shadow-xl">
            Guardando...
          </div>
        </div>
      )}

      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide">Panel de Rubros</h2>

      <div className="mb-6 w-full max-w-2xl flex flex-col">
        <label htmlFor="filtro" className="mb-2 text-lg font-medium text-gray-700">Filtrar:</label>
        <input
          id="filtro"
          type="text"
          className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400 mb-2"
          placeholder="Filtrar por descripción o ID..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row gap-2 justify-between">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
            onClick={openCreate}
          >
            Agregar Rubro
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
            onClick={() => navigate("/personas")}
          >
            Volver
          </button>
        </div>
      </div>

      <div className="shadow-2xl rounded-xl border border-gray-300 bg-white flex flex-col overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
            <tr>
              <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">ID</th>
              <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Descripción</th>
              <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 divide-y divide-gray-200 text-center">
            {rubrosFiltrados.length > 0 ? (
              rubrosFiltrados.map((rubro) => (
                <tr key={rubro.rubro_id} className="hover:bg-gray-200 transition-colors duration-150">
                  <td className="text-lg text-gray-500 px-4 py-3">{rubro.rubro_id}</td>
                  <td className="text-lg text-gray-800 px-4 py-3">{rubro.descripcion ?? "Sin descripción"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
                        onClick={() => openEdit(rubro)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
                        onClick={() => handleDelete(rubro)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No hay rubros</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <RubroModal
          rubro={modalRubro}
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
