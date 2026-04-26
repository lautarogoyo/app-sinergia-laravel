import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useCreateProveedor, useUpdateProveedor } from "../../hooks/useProveedores";
import { useTiposFacturacion } from "../../hooks/useTiposFacturacion";

const inputCls = "w-full px-4 py-2 rounded border border-gray-300 text-base focus:outline-none focus:ring focus:border-blue-400";
const labelCls = "text-sm font-medium text-gray-700 mb-1";

export default function ProveedorEditModal({ proveedor, onClose }) {
  const isEdit = !!proveedor;
  const { data: tiposFacturacion = [] } = useTiposFacturacion();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nombre_apellido: proveedor?.nombre_apellido ?? "",
      tipo_facturacion_id: proveedor?.tipo_facturacion_id ?? "",
      telefono: proveedor?.telefono ?? "",
      email: proveedor?.email ?? "",
      direccion: proveedor?.direccion ?? "",
      ciudad: proveedor?.ciudad ?? "",
      calificacion: proveedor?.calificacion ?? "",
      contacto: proveedor?.contacto ?? "",
      observacion: proveedor?.observacion ?? "",
      fecha_ingreso: proveedor?.fecha_ingreso ? String(proveedor.fecha_ingreso).slice(0, 10) : "",
    },
  });

  const { mutate: crear, isPending: creando } = useCreateProveedor(onClose);
  const { mutate: actualizar, isPending: actualizando } = useUpdateProveedor(proveedor?.proveedor_id, onClose);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      tipo_facturacion_id: Number(data.tipo_facturacion_id),
      fecha_ingreso: data.fecha_ingreso || null,
    };
    const opts = { onError: () => Swal.fire("Error", "No se pudo guardar el proveedor", "error") };
    isEdit ? actualizar(payload, opts) : crear(payload, opts);
  };

  const isPending = creando || actualizando;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-extrabold mb-5 text-gray-800">
            {isEdit ? "Editar Proveedor" : "Nuevo Proveedor"}
          </h3>
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
                      {t.descripcion}
                    </option>
                  ))}
                </select>
                {errors.tipo_facturacion_id && <p className="text-red-600 text-xs mt-1">{errors.tipo_facturacion_id.message}</p>}
              </div>

              <div className="flex flex-col">
                <label className={labelCls}>Teléfono</label>
                <input type="text" {...register("telefono")} className={inputCls} placeholder="+54 11 1234-5678" />
              </div>

              <div className="flex flex-col">
                <label className={labelCls}>Email</label>
                <input type="email" {...register("email")} className={inputCls} placeholder="contacto@empresa.com" />
              </div>

              <div className="flex flex-col">
                <label className={labelCls}>Dirección</label>
                <input type="text" {...register("direccion")} className={inputCls} placeholder="Av. Corrientes 1234" />
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

              <div className="flex flex-col">
                <label className={labelCls}>Fecha de Ingreso</label>
                <input type="date" {...register("fecha_ingreso")} className={inputCls} />
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
                {isPending ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Proveedor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
