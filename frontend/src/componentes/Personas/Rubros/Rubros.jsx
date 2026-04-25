import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRubros, useCreateRubro, useUpdateRubro, useDeleteRubro } from "../../hooks/useRubros.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import RubroFormModal from "./RubroFormModal.jsx";
import RubrosGrid from "./RubrosGrid.jsx";

export default function Rubros() {
  const [filtro, setFiltro] = useState("");
  const [modalRubro, setModalRubro] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (location.state?.openCreate) {
      openCreate();
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

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
        <div className="flex flex-row items-end gap-2">
          <input
            id="filtro"
            type="text"
            className="min-w-0 flex-1 px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
            placeholder="Filtrar por descripción o ID..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer whitespace-nowrap shrink-0"
            onClick={openCreate}
          >
            Agregar Rubro
          </button>
        </div>
      </div>

      <RubrosGrid rubros={rubrosFiltrados} onEdit={openEdit} onDelete={handleDelete} />

      {showModal && (
        <RubroFormModal
          rubro={modalRubro}
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
