import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import Icon from "../Icons/Icons";
import { fetchOrdenesByObra } from "../api/ordenesCompra";
import { fetchFacturasByObra, createFactura, updateFactura } from "../api/facturas";
import { fetchObras } from "../api/obras";
import ObraSelect from "../shared/ObrasSelect";
import OcSelect from "../shared/OcSelect";

const base = import.meta.env.VITE_API_URL;

const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400";
const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

export default function FacturaPage() {
  const { nroFactura } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const mode = nroFactura ? "edit" : "create";
  const obraIdInicial = location.state?.obraId ?? "";

  const [obraIdLocal, setObraIdLocal] = useState(obraIdInicial);

  const { data: obras = [] } = useQuery({
    queryKey: ["obras"],
    queryFn: fetchObras,
    refetchOnWindowFocus: false,
  });

  const { data: proveedores = [] } = useQuery({
    queryKey: ["proveedores"],
    queryFn: async () => {
      const { data } = await axios.get(`${base}/api/proveedores`);
      return data.proveedores;
    },
    refetchOnWindowFocus: false,
  });

  const { data: grupos = [] } = useQuery({
    queryKey: ["grupos"],
    queryFn: async () => {
      const { data } = await axios.get(`${base}/api/grupos`);
      return data.grupos;
    },
    refetchOnWindowFocus: false,
  });

  const { data: facturasObra = [] } = useQuery({
    queryKey: ["facturas", obraIdLocal],
    queryFn: () => fetchFacturasByObra(obraIdLocal),
    enabled: !!obraIdLocal,
    refetchOnWindowFocus: false,
  });

  const factura = mode === "edit"
    ? facturasObra.find((f) => String(f.nro_factura) === String(nroFactura))
    : null;

  const { data: ordenesCompra = [] } = useQuery({
    queryKey: ["ordenes_compra", obraIdLocal],
    queryFn: () => fetchOrdenesByObra(obraIdLocal),
    enabled: !!obraIdLocal,
    refetchOnWindowFocus: false,
  });

  const { register, handleSubmit, watch, setValue, control, reset } = useForm({
    defaultValues: {
      nro_factura: "",
      nro_oc: "",
      fecha: new Date().toISOString().slice(0, 10),
      tipo_factura: "A",
      empresa: "GOYOAGA",
      forma_pago: "TRANSFERENCIA",
      cantidad_dias: "",
      email: "",
      importe_total: "",
      proveedor_id: "",
      grupo_id: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && factura) {
      reset({
        nro_factura: factura.nro_factura ?? "",
        nro_oc: factura.nro_oc ?? "",
        fecha: factura.fecha?.split("T")[0] ?? factura.fecha ?? new Date().toISOString().slice(0, 10),
        tipo_factura: factura.tipo_factura ?? "A",
        empresa: factura.empresa ?? "GOYOAGA",
        forma_pago: factura.forma_pago ?? "TRANSFERENCIA",
        cantidad_dias: factura.cantidad_dias ?? "",
        email: factura.email ?? "",
        importe_total: factura.importe_total ?? "",
        proveedor_id: factura.proveedor_id ?? "",
        grupo_id: factura.grupo_id ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [factura]);

  const formaPago = watch("forma_pago");
  const nroOcSeleccionada = watch("nro_oc");
  const esEcheq = formaPago === "ECHEQ";

  const ocSeleccionada = ordenesCompra.find((oc) => oc.nro_oc === nroOcSeleccionada);

  const { data: facturasOC = [] } = useQuery({
    queryKey: ["facturas", obraIdLocal, nroOcSeleccionada],
    queryFn: () => fetchFacturasByObra(obraIdLocal),
    enabled: !!obraIdLocal && !!nroOcSeleccionada,
    refetchOnWindowFocus: false,
    select: (data) => data.filter((f) =>
      f.nro_oc === nroOcSeleccionada &&
      f.nro_factura !== factura?.nro_factura
    ),
  });

  const importeUsado = facturasOC.reduce((acc, f) => acc + Number(f.importe_total), 0);
  const saldoDisponible = ocSeleccionada ? Number(ocSeleccionada.importe) - importeUsado : null;

  const volver = () => navigate("/finanzas/facturas", { state: { obraId: obraIdLocal } });

  const createMutation = useMutation({
    mutationFn: ({ obraId, payload }) => createFactura(obraId, payload),
    onSuccess: (_, { obraId }) => {
      queryClient.invalidateQueries({ queryKey: ["facturas", obraId] });
      volver();
    },
    onError: (e) => Swal.fire({ icon: "error", title: "Error", text: e.response?.data?.message || e.message }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ obraId, nroFactura, payload }) => updateFactura(obraId, nroFactura, payload),
    onSuccess: (_, { obraId }) => {
      queryClient.invalidateQueries({ queryKey: ["facturas", obraId] });
      volver();
    },
    onError: (e) => Swal.fire({ icon: "error", title: "Error", text: e.response?.data?.message || e.message }),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleFormSubmit = (data) => {
    if (!obraIdLocal) return Swal.fire({ icon: "warning", title: "Seleccioná una obra" });
    const payload = {
      ...data,
      nro_oc: data.nro_oc || null,
      cantidad_dias: esEcheq && data.cantidad_dias ? Number(data.cantidad_dias) : null,
      email: esEcheq ? data.email : null,
      proveedor_id: data.proveedor_id || null,
      grupo_id: data.grupo_id || null,
    };
    if (mode === "create") {
      createMutation.mutate({ obraId: obraIdLocal, payload });
    } else {
      updateMutation.mutate({ obraId: obraIdLocal, nroFactura: factura.nro_factura, payload });
    }
  };

  if (mode === "edit" && !factura && obraIdLocal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Cargando factura...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-gray-50 to-white">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-3">
          <button type="button" onClick={volver} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md" title="Volver">
            <Icon name="arrowhide" className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === "create" ? "Nueva Factura" : "Editar Factura"}
          </h1>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
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
                    onChange={(val) => {
                      field.onChange(val);
                      const oc = ordenesCompra.find((o) => o.nro_oc === val);
                      if (oc) {
                        setValue("proveedor_id", oc.proveedor_id ?? "");
                        setValue("grupo_id", oc.grupo_id ?? "");
                      } else {
                        setValue("proveedor_id", factura?.proveedor_id ?? "");
                        setValue("grupo_id", factura?.grupo_id ?? "");
                      }
                    }}
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
            {!nroOcSeleccionada && (
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
            )}

            {/* Grupo */}
            {!!nroOcSeleccionada && (
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
            )}

            {/* Importe */}
            <div className="col-span-2">
              <label className={labelClass}>Importe Total *</label>
              <input type="number" step="0.01" {...register("importe_total", { required: true })} className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={volver} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer">
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
