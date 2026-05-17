import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller  } from "react-hook-form";
import Swal from "sweetalert2";
import { fetchOrdenesByObra } from "../api/ordenesCompra";
import { fetchFacturasByObra } from "../api/facturas";
import ObraSelect from "../shared/ObrasSelect";
import OcSelect from "../shared/OcSelect";


const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400";
const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

export default function FacturaModal({ mode, factura, proveedores, grupos, obras, obraIdInicial, onClose, onSubmit, isPending }) {
  const [obraIdLocal, setObraIdLocal] = useState(factura?.nro_obra ?? obraIdInicial ?? "");

  const { data: ordenesCompra = [] } = useQuery({
    queryKey: ["ordenes_compra", obraIdLocal],
    queryFn: () => fetchOrdenesByObra(obraIdLocal),
    enabled: !!obraIdLocal,
    refetchOnWindowFocus: false,
  });

  const { register, handleSubmit, watch, setValue, control } = useForm({
    defaultValues: {
      nro_factura:  factura?.nro_factura  ?? "",
      nro_oc:       factura?.nro_oc       ?? "",
      fecha:        factura?.fecha?.split("T")[0] ?? factura?.fecha ?? new Date().toISOString().slice(0, 10),
      tipo_factura: factura?.tipo_factura ?? "A",
      empresa:      factura?.empresa      ?? "GOYOAGA",
      forma_pago:   factura?.forma_pago   ?? "TRANSFERENCIA",
      cantidad_dias: factura?.cantidad_dias ?? "",
      email:        factura?.email        ?? "",
      importe_total: factura?.importe_total ?? "",
      proveedor_id: factura?.proveedor_id ?? "",
      grupo_id:     factura?.grupo_id     ?? "",
    },
  });

  const formaPago        = watch("forma_pago");
  const nroOcSeleccionada = watch("nro_oc");
  const esEcheq          = formaPago === "ECHEQ";

  const ocSeleccionada = ordenesCompra.find(oc => oc.nro_oc === nroOcSeleccionada);

  const { data: facturasOC = [] } = useQuery({
    queryKey: ["facturas", obraIdLocal, nroOcSeleccionada],
    queryFn: () => fetchFacturasByObra(obraIdLocal),
    enabled: !!obraIdLocal && !!nroOcSeleccionada,
    refetchOnWindowFocus: false,
    select: (data) => data.filter(f =>
      f.nro_oc === nroOcSeleccionada &&
      f.nro_factura !== factura?.nro_factura
    ),
  });

  const importeUsado    = facturasOC.reduce((acc, f) => acc + Number(f.importe_total), 0);
  const saldoDisponible = ocSeleccionada ? Number(ocSeleccionada.importe) - importeUsado : null;

  const handleFormSubmit = (data) => {
    if (!obraIdLocal) return Swal.fire({ icon: "warning", title: "Seleccioná una obra" });
    onSubmit(obraIdLocal, {
      ...data,
      nro_oc:        data.nro_oc        || null,
      cantidad_dias: esEcheq && data.cantidad_dias ? Number(data.cantidad_dias) : null,
      email:         esEcheq ? data.email : null,
      proveedor_id:  data.proveedor_id  || null,
      grupo_id:      data.grupo_id      || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">
            {mode === "create" ? "Nueva Factura" : "Editar Factura"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">

            {/* Obra */}
            <div className="col-span-2">
                <label className={labelClass}>Obra *</label>
                <ObraSelect
                    obras={obras}
                    value={obraIdLocal}
                    onChange={(val) => setObraIdLocal(val)}
                    disabled={mode === "edit"}
                />
                </div>

            {/* Nro Factura */}
            <div>
              <label className={labelClass}>Nro. Factura *</label>
              <input
                {...register("nro_factura", { required: true })}
                disabled={mode === "edit"}
                className={inputClass + (mode === "edit" ? " bg-gray-100 cursor-not-allowed" : "")}
              />
            </div>

            {/* OC */}
            <div>
                <label className={labelClass}>Nro. OC</label>
                <Controller
                    name="nro_oc"
                    control={control}
                    render={({ field }) => (
                    <OcSelect
                        ordenes={ordenesCompra}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                    />
                    )}
                />
                {ocSeleccionada && saldoDisponible !== null && (
                    <p className={`text-xs mt-1 font-semibold ${saldoDisponible <= 0 ? "text-red-600" : "text-emerald-600"}`}>
                    Saldo: ${saldoDisponible.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    {" "}/ Total OC: ${Number(ocSeleccionada.importe).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </p>
                )}
                </div>

            {/* Fecha */}
            <div>
              <label className={labelClass}>Fecha *</label>
              <input type="date" {...register("fecha", { required: true })} className={inputClass} />
            </div>

            {/* Tipo Factura */}
            <div>
              <label className={labelClass}>Tipo Factura *</label>
              <select {...register("tipo_factura", { required: true })} className={inputClass}>
                <option value="A">A</option>
                <option value="C">C</option>
              </select>
            </div>

            {/* Empresa */}
            <div>
              <label className={labelClass}>Empresa *</label>
              <select {...register("empresa", { required: true })} className={inputClass}>
                <option value="GOYOAGA">GOYOAGA</option>
                <option value="PROTECDUR">PROTECDUR</option>
                <option value="SINERGIA">SINERGIA</option>
              </select>
            </div>

            {/* Forma de Pago */}
            <div>
              <label className={labelClass}>Forma de Pago *</label>
              <select {...register("forma_pago", { required: true })} className={inputClass}>
                <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                <option value="ECHEQ">ECHEQ</option>
              </select>
            </div>

            {/* Campos ECHEQ */}
            {esEcheq && (
              <>
                <div>
                  <label className={labelClass}>Cantidad días *</label>
                  <input type="number" {...register("cantidad_dias", { required: esEcheq })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" {...register("email", { required: esEcheq })} className={inputClass} />
                </div>
              </>
            )}

            {/* Proveedor */}
            <div>
              <label className={labelClass}>Proveedor</label>
              <select
                {...register("proveedor_id")}
                className={inputClass}
                onChange={(e) => {
                  setValue("proveedor_id", e.target.value);
                  if (e.target.value) setValue("grupo_id", "");
                }}
              >
                <option value="">-- Ninguno --</option>
                {proveedores.map((p) => (
                  <option key={p.proveedor_id} value={p.proveedor_id}>{p.nombre_apellido}</option>
                ))}
              </select>
            </div>

            {/* Grupo */}
            <div>
              <label className={labelClass}>Grupo</label>
              <select
                {...register("grupo_id")}
                className={inputClass}
                onChange={(e) => {
                  setValue("grupo_id", e.target.value);
                  if (e.target.value) setValue("proveedor_id", "");
                }}
              >
                <option value="">-- Ninguno --</option>
                {grupos.map((g) => (
                  <option key={g.grupo_id} value={g.grupo_id}>{g.nombre_apellido}</option>
                ))}
              </select>
            </div>

            {/* Importe */}
            <div className="col-span-2">
              <label className={labelClass}>Importe Total *</label>
              <input type="number" step="0.01" {...register("importe_total", { required: true })} className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="px-4 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow cursor-pointer disabled:opacity-60">
              {isPending ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}