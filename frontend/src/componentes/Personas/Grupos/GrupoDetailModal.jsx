import { useState } from "react";
import { useForm, useController} from "react-hook-form";
import Swal from "sweetalert2";
import { useCreateGrupo, useUpdateGrupo, useDeleteGrupo, useEstadosGrupo } from "../../hooks/useGrupos";
import { useTiposFacturacion } from "../../hooks/useTiposFacturacion";
import RubrosSelect from "../../shared/RubrosSelect.jsx";

const inputCls = "w-full px-4 py-2 rounded border border-gray-300 text-base focus:outline-none focus:ring focus:border-blue-400";
const labelCls = "text-sm font-medium text-gray-700 mb-1";

const estadoBadge = {
  pendiente: "bg-amber-100 text-amber-700 border-amber-300",
  apto: "bg-emerald-100 text-emerald-700 border-emerald-300",
  activo: "bg-blue-100 text-blue-700 border-blue-300",
};

function Row({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="text-base text-gray-800 mt-0.5">
        {value || <span className="text-gray-400 italic">Sin datos</span>}
      </span>
    </div>
  );
}

export default function GrupoDetailModal({ grupo, initialMode, onClose }) {
  const [mode, setMode] = useState(initialMode);
  const grupoId = grupo?.grupo_id ?? grupo?.id;
  

  const { data: estadosGrupoData } = useEstadosGrupo();
  const estadosGrupo = estadosGrupoData?.estados ?? [];
  const { data: tiposFacturacion = [] } = useTiposFacturacion();
  

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm({
    defaultValues: {
      nombre_apellido: grupo?.nombre_apellido ?? "",
      tipo_facturacion_id: grupo?.tipo_facturacion_id ?? "",
      estado_grupo_id: grupo?.estado_grupo_id ?? "",
      telefono: grupo?.telefono ?? "",
      email: grupo?.email ?? "",
      ciudad: grupo?.ciudad ?? "",
      calificacion: grupo?.calificacion ?? "",
      contacto: grupo?.contacto ?? "",
      rol_profesional: grupo?.rol_profesional ?? "",
      especialidad: grupo?.especialidad ?? "",
      observacion: grupo?.observacion ?? "",
      fecha_ingreso: grupo?.fecha_ingreso
              ? String(grupo.fecha_ingreso).slice(0, 10)
              : new Date().toISOString().slice(0, 10)
          },
      rubros_ids: grupo?.rubros?.map(r => r.rubro_id) ?? [],
  });
  const { field: rubrosField } = useController({ name: "rubros_ids", control });
  const { mutate: crear, isPending: creando } = useCreateGrupo(onClose);
  const { mutate: actualizar, isPending: actualizando } = useUpdateGrupo(grupoId, onClose);
  const { mutate: eliminar, isPending: eliminando } = useDeleteGrupo(onClose);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      tipo_facturacion_id: Number(data.tipo_facturacion_id),
      estado_grupo_id: Number(data.estado_grupo_id),
      rol_profesional: data.rol_profesional ?? false,
      fecha_ingreso: data.fecha_ingreso || null,
      especialidad: data.especialidad || null,
    };
    const opts = { onError: () => Swal.fire("Error", "No se pudo guardar el grupo", "error") };
    mode === "create" ? crear(payload, opts) : actualizar(payload, opts);
  };

  const handleDelete = () => {
    eliminar(grupoId, {
      onError: () => Swal.fire("Error", "No se pudo eliminar el grupo", "error"),
    });
  };

  const isPending = creando || actualizando || eliminando;
  const estadoNombre = grupo?.estado_grupo?.descripcion ?? "";

  const titles = {
    create: "Nuevo Grupo",
    edit: "Editar Grupo",
    read: "Detalle del Grupo",
    delete: "Eliminar Grupo",
  };

  const isForm = mode === "create" || mode === "edit";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-extrabold mb-5 text-gray-800">{titles[mode]}</h3>

          {mode === "read" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div className="sm:col-span-2">
                  <Row label="Nombre / Razón Social" value={grupo?.nombre_apellido} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</span>
                  <span className={`inline-block mt-1 rounded px-3 py-1 text-sm font-bold uppercase border w-fit ${estadoBadge[estadoNombre.toLowerCase()] ?? estadoBadge.pendiente}`}>
                    {estadoNombre || "SIN ESTADO"}
                  </span>
                </div>
                <Row label="Tipo de Facturación" value={grupo?.tipo_facturacion?.tipo_facturacion_id == 1 ? "Monotributista" : "Responsable Inscripto"} />
                <Row label="Teléfono" value={grupo?.telefono} />
                <Row label="Email" value={grupo?.email} />
                <Row label="Ciudad" value={grupo?.ciudad} />
                <Row label="Calificación" value={grupo?.calificacion} />
                <Row label="Contacto" value={grupo?.contacto} />
                <Row label="Rol Profesional" value={grupo?.rol_profesional ? "Sí" : "No"} />
                <Row label="Especialidad" value={grupo?.especialidad} />
                <Row
                  label="Fecha de Ingreso"
                  value={
                    grupo?.fecha_ingreso
                      ? new Date(grupo.fecha_ingreso).toLocaleDateString("es-AR")
                      : null
                  }
                />
                <Row label="Rubros" value={grupo?.rubros?.map(r => r.descripcion).join(", ")} />
                <div className="sm:col-span-2">
                  <Row label="Observación" value={grupo?.observacion} />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setMode("edit")}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-base font-bold py-2 px-4 rounded shadow transition duration-150">
                  Editar
                </button>
                <button type="button" onClick={onClose}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-base font-semibold py-2 px-4 rounded shadow transition duration-150">
                  Cerrar
                </button>
              </div>
            </>
          )}

          {mode === "delete" && (
            <>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que querés eliminar al grupo{" "}
                <strong>{grupo?.nombre_apellido}</strong>? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={onClose} disabled={isPending}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-base font-semibold py-2 px-4 rounded shadow transition duration-150">
                  Cancelar
                </button>
                <button type="button" onClick={handleDelete} disabled={isPending}
                  className="bg-red-600 hover:bg-red-700 text-white text-base font-bold py-2 px-4 rounded shadow transition duration-150 disabled:opacity-50">
                  {eliminando ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </>
          )}

          {isForm && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="sm:col-span-2 flex flex-col">
                  <label className={labelCls}>Nombre / Razón Social *</label>
                  <input
                    type="text"
                    {...register("nombre_apellido", { required: "Campo obligatorio" })}
                    className={inputCls}
                    placeholder="Ej: Grupo ABC"
                  />
                  {errors.nombre_apellido && <p className="text-red-600 text-xs mt-1">{errors.nombre_apellido.message}</p>}
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
                  {errors.tipo_facturacion_id && <p className="text-red-600 text-xs mt-1">{errors.tipo_facturacion_id.message}</p>}
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Estado *</label>
                  <select
                    {...register("estado_grupo_id", { required: "Campo obligatorio" })}
                    className={inputCls + " cursor-pointer"}
                  >
                    <option value="">-- Seleccionar --</option>
                    {estadosGrupo.map((e) => (
                      <option key={e.estado_grupo_id} value={e.estado_grupo_id}>
                        {e.descripcion.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  {errors.estado_grupo_id && <p className="text-red-600 text-xs mt-1">{errors.estado_grupo_id.message}</p>}
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Teléfono</label>
                  <input type="text" {...register("telefono")} className={inputCls} placeholder="+54 11 1234-5678" />
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Email</label>
                  <input type="email" {...register("email")} className={inputCls} placeholder="contacto@grupo.com" />
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Ciudad</label>
                  <input type="text" {...register("ciudad")} className={inputCls} placeholder="Buenos Aires" />
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Calificación</label>
                  <input type="text" {...register("calificacion")} className={inputCls} placeholder="A, B, C..." />
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Contacto</label>
                  <input type="text" {...register("contacto")} className={inputCls} placeholder="Nombre del contacto" />
                </div>

                <div className="flex flex-col justify-center">
                  <label className={labelCls}>¿Es Profesional?</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="rol_profesional"
                      {...register("rol_profesional")}
                      className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <label className={labelCls}>Especialidad</label>
                  <input
                    type="text"
                    {...register("especialidad")}
                    disabled={!watch("rol_profesional")}
                    className={inputCls + (!watch("rol_profesional") ? " bg-gray-100 text-gray-400 cursor-not-allowed" : "")}
                    placeholder="Ej: Ingeniero"
                  />
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>Fecha de Ingreso</label>
                  <input type="date" {...register("fecha_ingreso")} className={inputCls} />
                </div>
                
                <div className="sm:col-span-2 flex flex-col">
                  <label className={labelCls}>Rubros</label>
                  <RubrosSelect value={rubrosField.value} onChange={rubrosField.onChange} />
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
                  {isPending ? "Guardando..." : mode === "create" ? "Crear Grupo" : "Guardar Cambios"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
