import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useCreateRubro, useUpdateRubro, useDeleteRubro } from "../../hooks/useRubros";

const inputCls =
  "w-full px-4 py-2 rounded border border-gray-300 text-base focus:outline-none focus:ring focus:border-blue-400";
const labelCls = "text-sm font-medium text-gray-700 mb-1";

function Row({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-base text-gray-800 mt-0.5">
        {value || <span className="text-gray-400 italic">Sin datos</span>}
      </span>
    </div>
  );
}

export default function RubroDetailModal({ rubro, initialMode, onClose }) {
  const [mode, setMode] = useState(initialMode);
  const rubroId = rubro?.rubro_id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      descripcion: rubro?.descripcion ?? "",
    },
  });

  const { mutate: crear,      isPending: creando      } = useCreateRubro(onClose);
  const { mutate: actualizar, isPending: actualizando } = useUpdateRubro(rubroId, onClose);
  const { mutate: eliminar,   isPending: eliminando   } = useDeleteRubro(onClose);

  const onSubmit = (data) => {
  const opts = {
    onSuccess: () => onClose(),
    onError: () => Swal.fire("Error", "No se pudo guardar el rubro", "error"),
  };
  mode === "create" ? crear(data, opts) : actualizar(data, opts);
};

  const handleDelete = () => {
    eliminar(rubroId, {
      onError: () => Swal.fire("Error", "No se pudo eliminar el rubro", "error"),
    });
  };

  const isPending = creando || actualizando || eliminando;
  const isForm = mode === "create" || mode === "edit";

  const titles = {
    create: "Nuevo Rubro",
    edit:   "Editar Rubro",
    read:   "Detalle del Rubro",
    delete: "Eliminar Rubro",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md">
        <div className="p-6">
          <h3 className="text-2xl font-extrabold mb-5 text-gray-800">
            {titles[mode]}
          </h3>

          {/* ── MODO READ ── */}
          {mode === "read" && (
            <>
              <div className="mb-6 space-y-4">
                <Row label="ID"          value={rubro?.rubro_id} />
                <Row label="Descripción" value={rubro?.descripcion} />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setMode("edit")}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-base font-bold py-2 px-4 rounded shadow transition duration-150"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-base font-semibold py-2 px-4 rounded shadow transition duration-150"
                >
                  Cerrar
                </button>
              </div>
            </>
          )}

          {/* ── MODO DELETE ── */}
          {mode === "delete" && (
            <>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que querés eliminar el rubro{" "}
                <strong>{rubro?.descripcion}</strong>? Esta acción no se puede
                deshacer.
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
                  {eliminando ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </>
          )}

          {/* ── MODO CREATE / EDIT ── */}
          {isForm && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col">
                <label className={labelCls}>Descripción *</label>
                <input
                  type="text"
                  {...register("descripcion", { required: "Campo obligatorio" })}
                  className={inputCls}
                  placeholder="Ej: Electricidad"
                  autoFocus
                />
                {errors.descripcion && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.descripcion.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-base font-semibold py-2 px-4 rounded shadow transition duration-150"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-base font-bold py-2 px-4 rounded shadow transition duration-150 disabled:opacity-50"
                >
                  {isPending
                    ? "Guardando..."
                    : mode === "create"
                    ? "Crear Rubro"
                    : "Guardar Cambios"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}