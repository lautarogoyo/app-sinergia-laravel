import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Icon from '../Icons/Icons';
import { fetchObras } from "../api/obras";
import ObraSelect from "../shared/ObrasSelect";
import { fetchOrdenesByObra, createOrden, updateOrden, deleteOrden } from "../api/ordenesCompra";
import axios from "axios";

const base = import.meta.env.VITE_API_URL;

const thClass = "px-4 py-3 text-center text-sm font-bold text-gray-100 border-b border-gray-500";
const tdClass = "px-4 py-3 text-center text-sm text-gray-800";

export default function OrdenesDeCompra() {
  const [obraSeleccionada, setObraSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState(null);
  const queryClient = useQueryClient();

  const { data: obras = [] } = useQuery({
    queryKey: ["obras"],
    queryFn: fetchObras,
    refetchOnWindowFocus: false,
  });

  const { data: ordenes = [], isLoading } = useQuery({
    queryKey: ["ordenes_compra", obraSeleccionada],
    queryFn: () => fetchOrdenesByObra(obraSeleccionada),
    enabled: !!obraSeleccionada,
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

  const createMutation = useMutation({
    mutationFn: ({ obraId, payload }) => createOrden(obraId, payload),
    onSuccess: (_, { obraId }) => {
      queryClient.invalidateQueries({ queryKey: ["ordenes_compra", obraId] });
      setModal(null);
    },
    onError: (e) => Swal.fire({ icon: "error", title: "Error", text: e.response?.data?.message || e.message }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ obraId, nroOc, payload }) => updateOrden(obraId, nroOc, payload),
    onSuccess: (_, { obraId }) => {
      queryClient.invalidateQueries({ queryKey: ["ordenes_compra", obraId] });
      setModal(null);
    },
    onError: (e) => Swal.fire({ icon: "error", title: "Error", text: e.response?.data?.message || e.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: (nroOc) => deleteOrden(obraSeleccionada, nroOc),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ordenes_compra", obraSeleccionada] }),
    onError: (e) => Swal.fire({ icon: "error", title: "Error", text: e.response?.data?.message || e.message }),
  });

  const handleEliminar = async (orden) => {
    const res = await Swal.fire({
      icon: "warning",
      title: "Eliminar orden",
      text: `¿Eliminar OC ${orden.nro_oc}?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (res.isConfirmed) deleteMutation.mutate(orden.nro_oc);
  };

  const ordenesFiltradas = useMemo(() => {
    const val = busqueda.trim().toLowerCase();
    if (!val) return ordenes;
    return ordenes.filter(
      (o) =>
        o.nro_oc?.toLowerCase().includes(val) ||
        o.grupo?.nombre_apellido?.toLowerCase().includes(val) ||
        o.detalle?.toLowerCase().includes(val)
    );
  }, [ordenes, busqueda]);

  return (
    <div className="flex-1 min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="purchase" className="w-8 h-8 text-amber-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Órdenes de Compra</h2>
          <p className="text-sm text-gray-500">Gestión de órdenes de compra por obra</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap items-center gap-4">
        <label className="text-sm font-semibold text-gray-700">Obra:</label>
        <div className="w-64">
          <ObraSelect
            obras={obras}
            value={obraSeleccionada}
            onChange={(val) => { setObraSeleccionada(val); setBusqueda(""); }}
          />
        </div>

        {obraSeleccionada && (
          <input
            type="text"
            placeholder="Buscar orden..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 w-56"
          />
        )}

        <button
          onClick={() => setModal({ mode: "create" })}
          className="ml-auto bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition cursor-pointer"
        >
          + Nueva OC
        </button>
      </div>

      {!obraSeleccionada ? (
        <div className="text-center text-gray-400 mt-20 text-sm">Seleccioná una obra para ver sus órdenes de compra.</div>
      ) : isLoading ? (
        <div className="text-center text-gray-400 mt-20 text-sm animate-pulse">Cargando órdenes...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#2c4d81]">
              <tr>
                <th className={thClass}>Nro. OC</th>
                <th className={thClass}>Grupo</th>
                <th className={thClass}>Detalle</th>
                <th className={thClass}>Importe</th>
                <th className={thClass}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No hay órdenes de compra para esta obra.
                  </td>
                </tr>
              ) : (
                ordenesFiltradas.map((o, i) => (
                  <tr key={o.nro_oc} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className={`${tdClass} font-semibold`}>{o.nro_oc}</td>
                    <td className={tdClass}>{o.grupo?.nombre_apellido ?? "-"}</td>
                    <td className={`${tdClass} text-left max-w-xs truncate`}>{o.detalle}</td>
                    <td className={`${tdClass} font-semibold`}>
                      ${Number(o.importe).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className={tdClass}>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setModal({ mode: "edit", data: o })}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded shadow cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(o)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded shadow cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <OrdenModal
          mode={modal.mode}
          orden={modal.data}
          grupos={grupos}
          obras={obras}
          obraIdInicial={obraSeleccionada}
          onClose={() => setModal(null)}
          onSubmit={(obraId, payload) => {
            if (modal.mode === "create") {
              createMutation.mutate({ obraId, payload });
            } else {
              updateMutation.mutate({ obraId, nroOc: modal.data.nro_oc, payload });
            }
          }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}

function OrdenModal({ mode, orden, grupos, obras, obraIdInicial, onClose, onSubmit, isPending }) {
  const [obraIdLocal, setObraIdLocal] = useState(orden?.nro_obra ?? obraIdInicial ?? "");

  const { register, handleSubmit } = useForm({
    defaultValues: {
      nro_oc: orden?.nro_oc ?? "",
      grupo_id: orden?.grupo_id ?? "",
      detalle: orden?.detalle ?? "",
      importe: orden?.importe ?? "",
    },
  });

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  const handleFormSubmit = (data) => {
    if (!obraIdLocal) return Swal.fire({ icon: "warning", title: "Seleccioná una obra" });
    onSubmit(obraIdLocal, {
      ...data,
      grupo_id: Number(data.grupo_id),
      importe: Number(data.importe),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">
            {mode === "create" ? "Nueva Orden de Compra" : "Editar Orden de Compra"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">

          {/* Obra */}
          <div>
            <label className={labelClass}>Obra *</label>
            <select
              value={obraIdLocal}
              onChange={(e) => setObraIdLocal(e.target.value)}
              disabled={mode === "edit"}
              className={inputClass + (mode === "edit" ? " bg-gray-100 cursor-not-allowed" : "")}
            >
              <option value="">— Seleccionar obra —</option>
              {obras.map((o) => (
                <option key={o.nro_obra} value={o.nro_obra}>
                  #{o.nro_obra} — {o.detalle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Nro. OC *</label>
            <input
              {...register("nro_oc", { required: true })}
              disabled={mode === "edit"}
              className={inputClass + (mode === "edit" ? " bg-gray-100 cursor-not-allowed" : "")}
            />
          </div>

          <div>
            <label className={labelClass}>Grupo *</label>
            <select {...register("grupo_id", { required: true })} className={inputClass}>
              <option value="">-- Seleccionar grupo --</option>
              {grupos.map((g) => (
                <option key={g.grupo_id} value={g.grupo_id}>{g.nombre_apellido}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Detalle *</label>
            <textarea {...register("detalle", { required: true })} rows={3} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Importe *</label>
            <input type="number" step="0.01" {...register("importe", { required: true })} className={inputClass} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="px-4 py-2 text-sm rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow cursor-pointer disabled:opacity-60">
              {isPending ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}