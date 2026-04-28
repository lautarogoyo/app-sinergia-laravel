import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  useCreateProveedor,
  useUpdateProveedor,
  useDeleteProveedor,
} from "../../hooks/useProveedores";
import { useTiposFacturacion } from "../../hooks/useTiposFacturacion";

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

export default function ProveedorDetailModal({ proveedor, initialMode, onClose }) {
  const [mode, setMode] = useState(initialMode);
  const proveedorId = proveedor?.proveedor_id ?? proveedor?.id;

  const { data: tiposFacturacion = [] } = useTiposFacturacion();

  

  const {
    register,
    handleSubmit,
    formState: { errors },
    
  } = useForm({
    defaultValues: {
      nombre_apellido:     proveedor?.nombre_apellido     ?? "",
      tipo_facturacion_id: proveedor?.tipo_facturacion_id ?? "",
      telefono:            proveedor?.telefono            ?? "",
      email:               proveedor?.email               ?? "",
      direccion:           proveedor?.direccion           ?? "",
      ciudad:              proveedor?.ciudad              ?? "",
      calificacion:        proveedor?.calificacion        ?? "",
      contacto:            proveedor?.contacto            ?? "",
      observacion:         proveedor?.observacion         ?? "",
      fecha_ingreso:       proveedor?.fecha_ingreso
        ? String(proveedor.fecha_ingreso).slice(0, 10)
        : new Date().toISOString().slice(0, 10)

    },
  });

  const { mutate: crear,      isPending: creando      } = useCreateProveedor(onClose);
  const { mutate: actualizar, isPending: actualizando } = useUpdateProveedor(proveedorId, onClose);
  const { mutate: eliminar,   isPending: eliminando   } = useDeleteProveedor(onClose);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      tipo_facturacion_id: Number(data.tipo_facturacion_id),
      fecha_ingreso: data.fecha_ingreso || null,
    };
    const opts = {
      onError: () =>
        Swal.fire("Error", "No se pudo guardar el proveedor", "error"),
    };
    mode === "create" ? crear(payload, opts) : actualizar(payload, opts);
  };

  const handleDelete = () => {
    eliminar(proveedorId, {
      onError: () =>
        Swal.fire("Error", "No se pudo eliminar el proveedor", "error"),
    });
  };

  const isPending = creando || actualizando || eliminando;
  const isForm = mode === "create" || mode === "edit";

  const titles = {
    create: "Nuevo Proveedor",
    edit:   "Editar Proveedor",
    read:   "Detalle del Proveedor",
    delete: "Eliminar Proveedor",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-extrabold mb-5 text-gray-800">
            {titles[mode]}
          </h3>

          {/* ── MODO READ ── */}
          {mode === "read" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div className="sm:col-span-2">
                  <Row label="Nombre / Razón Social" value={proveedor?.nombre_apellido} />
                </div>
                <Row
                  label="Tipo de Facturación"
                  value={proveedor?.tipo_facturacion?.tipo_facturacion_id == 1 ? "Monotributista" : "Responsable Inscripto"}
                />
                <Row label="Teléfono"         value={proveedor?.telefono} />
                <Row label="Email"            value={proveedor?.email} />
                <Row label="Dirección"        value={proveedor?.direccion} />
                <Row label="Ciudad"           value={proveedor?.ciudad} />
                <Row label="Calificación"     value={proveedor?.calificacion} />
                <Row label="Contacto"         value={proveedor?.contacto} />
                <Row
                  label="Fecha de Ingreso"
                  value={
                    proveedor?.fecha_ingreso
                      ? new Date(proveedor.fecha_ingreso).toLocaleDateString("es-AR")
                      : null
                  }
                />
                <div className="sm:col-span-2">
                  <Row label="Observación" value={proveedor?.observacion} />
                </div>
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
                ¿Estás seguro de que querés eliminar al proveedor{" "}
                <strong>{proveedor?.nombre_apellido}</strong>? Esta acción no se
                puede deshacer.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="sm:col-span-2 flex flex-col">
                  <label className={labelCls}>Nombre / Razón Social *</label>
                  <input
                    type="text"
                    {...register("nombre_apellido", { required: "Campo obligatorio" })}
                    className={inputCls}
                    placeholder="Ej: Juan Pérez"
                  />
                  {errors.nombre_apellido && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.nombre_apellido.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Tipo de Facturación *</label>
                  <select
                    {...register("tipo_facturacion_id", { required: "Campo obligatorio" })}
                    className={inputCls + " cursor-pointer"}
                  >
                    <option value="">-- Seleccionar --</option>
                    {tiposFacturacion.map((t) => (
                      <option key={t.tipo_facturacion_id} value={t.tipo_facturacion_id}>
                        {t.tipo_facturacion_id == 1 ? "Monotributista" : "Responsable Inscripto"}
                      </option>
                    ))}
                  </select>
                  {errors.tipo_facturacion_id && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.tipo_facturacion_id.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Teléfono</label>
                  <input
                    type="text"
                    {...register("telefono")}
                    className={inputCls}
                    placeholder="+54 11 1234-5678"
                  />
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className={inputCls}
                    placeholder="contacto@empresa.com"
                  />
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Dirección</label>
                  <input
                    type="text"
                    {...register("direccion")}
                    className={inputCls}
                    placeholder="Av. Corrientes 1234"
                  />
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Ciudad</label>
                  <input
                    type="text"
                    {...register("ciudad")}
                    className={inputCls}
                    placeholder="Rosario"
                  />
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Calificación</label>
                  <input
                    type="text"
                    {...register("calificacion")}
                    className={inputCls}
                    placeholder="A, B, C..."
                  />
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Contacto</label>
                  <input
                    type="text"
                    {...register("contacto")}
                    className={inputCls}
                    placeholder="Nombre del contacto"
                  />
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Fecha de Ingreso</label>
                  <input
                    type="date"
                    {...register("fecha_ingreso")}
                    className={inputCls}
                    readOnly
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col">
                  <label className={labelCls}>Observación</label>
                  <textarea
                    {...register("observacion")}
                    rows={3}
                    className={inputCls}
                    placeholder="Observaciones adicionales..."
                  />
                </div>
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
                    ? "Crear Proveedor"
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