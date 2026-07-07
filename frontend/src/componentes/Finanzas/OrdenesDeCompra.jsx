import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Icon from '../Icons/Icons';
import { fetchObras } from "../api/obras";
import ObraSelect from "../shared/ObrasSelect";
import { fetchOrdenesByObra, createOrden, updateOrden, deleteOrden } from "../api/ordenesCompra";
import axios from "axios";
import PaginationControls from "../shared/PaginationControls.jsx";
import { usePagination } from "../shared/usePagination.jsx";

const base = import.meta.env.VITE_API_URL;

const thClass = "px-6 py-3 text-center text-lg font-bold text-gray-100 border-b border-gray-500";
const tdClass = "px-6 py-4 text-center text-lg text-gray-800";

export default function OrdenesDeCompra() {
  const [obraSeleccionada, setObraSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState(null);
  const queryClient = useQueryClient();
  const [sortConfig, setSortConfig] = useState({ key: null, dir: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  };

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col) return <span className="ml-1 text-gray-400 text-xs">⇅</span>;
    return <span className="ml-1 text-xs">{sortConfig.dir === "asc" ? "↑" : "↓"}</span>;
  };
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
    let result = ordenes.filter(
      (o) =>
        !val ||
        o.nro_oc?.toLowerCase().includes(val) ||
        o.grupo?.nombre_apellido?.toLowerCase().includes(val) ||
        o.detalle?.toLowerCase().includes(val)
    );

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let aVal, bVal;
        if (sortConfig.key === "grupo") {
          aVal = (a.grupo?.nombre_apellido ?? "").toLowerCase();
          bVal = (b.grupo?.nombre_apellido ?? "").toLowerCase();
        } else if (sortConfig.key === "importe") {
          aVal = Number(a.importe);
          bVal = Number(b.importe);
        } else {
          aVal = (a[sortConfig.key] ?? "").toString().toLowerCase();
          bVal = (b[sortConfig.key] ?? "").toString().toLowerCase();
        }
        if (aVal < bVal) return sortConfig.dir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.dir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [ordenes, busqueda, sortConfig]);
  const ordenesPage = usePagination(ordenesFiltradas, 8);

  return (
    <div className="flex-1 min-h-0 bg-gray-50 p-6 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="purchase" className="w-8 h-8 text-amber-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Órdenes de Compra</h2>
          <p className="text-sm text-gray-500">Gestión de órdenes de compra por obra</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Obra:</label>
            <div className="w-full">
              <ObraSelect
                obras={obras}
                value={obraSeleccionada}
                onChange={(val) => { setObraSeleccionada(val); setBusqueda(""); }}
              />
            </div>
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
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-start">
          <button
            onClick={() => setModal({ mode: "create" })}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
          >
            Agregar
          </button>
        </div>
      </div>

      {!obraSeleccionada ? (
        <div className="text-center text-gray-400 mt-20 text-sm">Seleccioná una obra para ver sus órdenes de compra.</div>
      ) : isLoading ? (
        <div className="text-center text-gray-400 mt-20 text-sm animate-pulse">Cargando órdenes...</div>
      ) : (
        <div className="table-card">
          <div className="table-card__viewport overflow-x-auto">
          <table className="min-w-max w-full">
            <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
              <tr>
                <th className={thClass}></th>
                {[
                  { label: "Nro. OC", key: "nro_oc" },
                  { label: "Grupo", key: "grupo" },
                  { label: "Detalle", key: "detalle" },
                  { label: "Importe", key: "importe" },
                ].map(({ label, key }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className={`${thClass} cursor-pointer select-none hover:bg-gray-600 transition`}
                  >
                    {label}<SortIcon col={key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-50 divide-y divide-gray-200">
              {ordenesPage.paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No hay órdenes de compra para esta obra.
                  </td>
                </tr>
              ) : (
                ordenesPage.paginatedItems.map((o, i) => (
                  <tr key={o.nro_oc} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className={tdClass}>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setModal({ mode: "edit", data: o })}
                          className="group bg-yellow-300 hover:bg-yellow-400 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center"
                        >
                          <Icon name="pencil" className="h-6 w-6 text-white group-hover:text-blue-200 transition-colors" />
                        </button>
                        <button
                          onClick={() => handleEliminar(o)}
                          className="group bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center"
                        >
                          <Icon name="trash" className="h-6 w-6 text-white group-hover:text-yellow-200 transition-colors" />
                        </button>
                      </div>
                    </td>
                    <td className={`${tdClass} font-semibold`}>{o.nro_oc}</td>
                    <td className={tdClass}>{o.grupo?.nombre_apellido ?? "-"}</td>
                    <td className={`${tdClass} text-left max-w-xs truncate`}>{o.detalle}</td>
                    <td className={`${tdClass} font-semibold`}>
                      ${Number(o.importe).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
          <PaginationControls
            currentPage={ordenesPage.currentPage}
            totalPages={ordenesPage.totalPages}
            totalItems={ordenesPage.totalItems}
            startItem={ordenesPage.startItem}
            endItem={ordenesPage.endItem}
            pageSize={ordenesPage.pageSize}
            onPageSizeChange={ordenesPage.setPageSize}
            hasPrevious={ordenesPage.hasPrevious}
            hasNext={ordenesPage.hasNext}
            onPrevious={() => ordenesPage.setCurrentPage((page) => Math.max(1, page - 1))}
            onNext={() => ordenesPage.setCurrentPage((page) => Math.min(ordenesPage.totalPages, page + 1))}
          />
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
  const [obraIdLocal, setObraIdLocal] = useState(orden?.obra_id ?? obraIdInicial ?? "");

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
                <option key={o.obra_id} value={o.obra_id}>
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