import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Icon from '../Icons/Icons';
import { fetchObras } from "../api/obras";
import { fetchFacturasByObra, createFactura, updateFactura, deleteFactura } from "../api/facturas";
import FacturaModal from "./FacturasModal";
import axios from "axios";
import ObraSelect from "../shared/ObrasSelect";
import ReporteMensualModal from "./ReporteMensualModal";
import FacturaImpuestosModal from "./FacturaImpuestosModal";
import PaginationControls from "../shared/PaginationControls.jsx";
import { usePagination } from "../shared/usePagination.jsx";



const base = import.meta.env.VITE_API_URL;

const thClass = "px-6 py-3 text-center text-lg font-bold text-gray-100 border-b border-gray-500";
const tdClass = "px-6 py-4 text-center text-lg text-gray-800";

export default function Facturas() {
  const [obraSeleccionada, setObraSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState(null);
  const queryClient = useQueryClient();
  const [modalReporte, setModalReporte] = useState(false);
  const [modalImpuestos, setModalImpuestos] = useState(null); // factura seleccionada
  const [sortConfig, setSortConfig] = useState({ key: null, dir: "asc" });


  const { data: obras = [] } = useQuery({
    queryKey: ["obras"],
    queryFn: fetchObras,
    refetchOnWindowFocus: false,
  });

  const { data: facturas = [], isLoading: loadingFacturas } = useQuery({
    queryKey: ["facturas", obraSeleccionada],
    queryFn: () => fetchFacturasByObra(obraSeleccionada),
    enabled: !!obraSeleccionada,
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

  const createMutation = useMutation({
    mutationFn: ({ obraId, payload }) => createFactura(obraId, payload),
    onSuccess: (_, { obraId }) => {
      queryClient.invalidateQueries({ queryKey: ["facturas", obraId] });
      setModal(null);
    },
    onError: (e) => Swal.fire({ icon: "error", title: "Error", text: e.response?.data?.message || e.message }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ obraId, nroFactura, payload }) => updateFactura(obraId, nroFactura, payload),
    onSuccess: (_, { obraId }) => {
      queryClient.invalidateQueries({ queryKey: ["facturas", obraId] });
      setModal(null);
    },
    onError: (e) => Swal.fire({ icon: "error", title: "Error", text: e.response?.data?.message || e.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ obraId, nroFactura }) => deleteFactura(obraId, nroFactura),
    onSuccess: (_, { obraId }) => queryClient.invalidateQueries({ queryKey: ["facturas", obraId] }),
    onError: (e) => Swal.fire({ icon: "error", title: "Error", text: e.response?.data?.message || e.message }),
  });

  const handleEliminar = async (f) => {
    const res = await Swal.fire({
      icon: "warning",
      title: "Eliminar factura",
      text: `¿Eliminar factura ${f.nro_factura}?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (res.isConfirmed) deleteMutation.mutate({ obraId: f.nro_obra, nroFactura: f.nro_factura });
  };
  
  const handleSort = (key) => {
  setSortConfig((prev) =>
    prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
  );
  };

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col) return <span className="ml-1 text-gray-400 text-xs">⇅</span>;
    return <span className="ml-1 text-xs">{sortConfig.dir === "asc" ? "↑" : "↓"}</span>;
  };

  const facturasFiltradas = useMemo(() => {
    const val = busqueda.trim().toLowerCase();
    let result = facturas.filter(
      (f) =>
        !val ||
        f.nro_factura?.toLowerCase().includes(val) ||
        f.empresa?.toLowerCase().includes(val) ||
        f.proveedor?.nombre_apellido?.toLowerCase().includes(val) ||
        f.grupo?.nombre_apellido?.toLowerCase().includes(val)
    );

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let aVal, bVal;
        if (sortConfig.key === "entidad") {
          aVal = (a.proveedor?.nombre_apellido || a.grupo?.nombre_apellido || "").toLowerCase();
          bVal = (b.proveedor?.nombre_apellido || b.grupo?.nombre_apellido || "").toLowerCase();
        } else if (sortConfig.key === "importe_total") {
          aVal = Number(a.importe_total);
          bVal = Number(b.importe_total);
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
  }, [facturas, busqueda, sortConfig]);
  const facturasPage = usePagination(facturasFiltradas, 8);

  
  return (
    <div className="flex-1 min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="invoice" className="w-8 h-8 text-emerald-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Facturas</h2>
          <p className="text-sm text-gray-500">Gestión de facturas por obra</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Obra:</label>
          <div className="w-80">
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
            placeholder="Buscar factura..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 w-56"
          />
        )}

        <button
          onClick={() => setModal({ mode: "create" })}
          className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition cursor-pointer"
        >
          + Nueva factura
        </button>
        <button
        onClick={() => setModalReporte(true)}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-300 shadow-sm transition cursor-pointer flex items-center gap-2"
      >
        🖨️ Imprimir mes
      </button>
      </div>

      {!obraSeleccionada ? (
        <div className="text-center text-gray-400 mt-20 text-sm">Seleccioná una obra para ver sus facturas.</div>
      ) : loadingFacturas ? (
        <div className="text-center text-gray-400 mt-20 text-sm animate-pulse">Cargando facturas...</div>
      ) : (
        <div className="table-card">
          <div className="table-card__viewport overflow-x-auto">
          <table className="min-w-max w-full">
            <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
            <tr>
              <th className={thClass}></th>
              {[
                { label: "Nro. Factura",      key: "nro_factura"   },
                { label: "Fecha",             key: "fecha"         },
                { label: "Tipo",              key: "tipo_factura"  },
                { label: "Empresa",           key: "empresa"       },
                { label: "Forma Pago",        key: "forma_pago"    },
                { label: "Proveedor / Grupo", key: "entidad"       },
                { label: "Importe",           key: "importe_total" },
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
              {facturasPage.paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    No hay facturas para esta obra.
                  </td>
                </tr>
              ) : (
                facturasPage.paginatedItems.map((f, i) => (
                  <tr key={f.nro_factura} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className={tdClass}>
                      <div className="flex gap-2 justify-center">
                        {f.tipo_factura !== "C" && (
                          <button
                            onClick={() => setModalImpuestos(f)}
                            title="Datos fiscales"
                            className={`p-1.5 rounded text-xs font-bold ${
                                f.tiene_impuestos
                                    ? "bg-emerald-100 text-emerald-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                          {f.tiene_impuestos ? "$ ✓" : "$ ?"}
                      </button>
                      )}
                        <button
                          className="group bg-yellow-300 hover:bg-yellow-400 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center"
                          onClick={() => setModal({ mode: "edit", data: f })}
                        >
                          <Icon name="pencil" className="h-6 w-6 text-white group-hover:text-blue-200 transition-colors" />
                        </button>
                        <button
                          className="group bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center"
                          onClick={() => handleEliminar(f)}
                        >
                          <Icon name="trash" className="h-6 w-6 text-white group-hover:text-yellow-200 transition-colors" />
                        </button>
                      </div>
                    </td>
                    <td className={`${tdClass} font-semibold`}>{f.nro_factura}</td>
                    <td className={tdClass}>
                      {f.fecha ? new Date(f.fecha).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit", timeZone: "America/Argentina/Buenos_Aires" }) : "-"}
                    </td>
                    <td className={tdClass}>
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold text-xs">
                        {f.tipo_factura}
                      </span>
                    </td>
                    <td className={tdClass}>{f.empresa}</td>
                    <td className={tdClass}>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${f.forma_pago === "ECHEQ" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                        {f.forma_pago}
                      </span>
                    </td>
                    <td className={tdClass}>
                      {f.proveedor ? (
                        <div className="text-left space-y-0.5">
                          <div className="font-semibold">{f.proveedor.nombre_apellido}</div>
                          {f.proveedor.cuit  && <div className="text-xs text-gray-500">CUIT: {f.proveedor.cuit}</div>}
                          {f.proveedor.cbu   && <div className="text-xs text-gray-500">CBU: {f.proveedor.cbu}</div>}
                          {f.proveedor.alias && <div className="text-xs text-gray-500">Alias: {f.proveedor.alias}</div>}
                        </div>
                      ) : f.grupo ? (
                        <div className="text-left space-y-0.5">
                          <div className="font-semibold">{f.grupo.nombre_apellido}</div>
                          {f.grupo.cbu   && <div className="text-xs text-gray-500">CBU: {f.grupo.cbu}</div>}
                          {f.grupo.alias && <div className="text-xs text-gray-500">Alias: {f.grupo.alias}</div>}
                        </div>
                      ) : "-"}
                    </td>
                    <td className={`${tdClass} font-semibold`}>
                      ${Number(f.importe_total).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
          <PaginationControls
            currentPage={facturasPage.currentPage}
            totalPages={facturasPage.totalPages}
            totalItems={facturasPage.totalItems}
            startItem={facturasPage.startItem}
            endItem={facturasPage.endItem}
            pageSize={facturasPage.pageSize}
            onPageSizeChange={facturasPage.setPageSize}
            hasPrevious={facturasPage.hasPrevious}
            hasNext={facturasPage.hasNext}
            onPrevious={() => facturasPage.setCurrentPage((page) => Math.max(1, page - 1))}
            onNext={() => facturasPage.setCurrentPage((page) => Math.min(facturasPage.totalPages, page + 1))}
          />
        </div>
      )}

      {modal && (
        <FacturaModal
          mode={modal.mode}
          factura={modal.data}
          proveedores={proveedores}
          grupos={grupos}
          obras={obras}
          obraIdInicial={obraSeleccionada}
          onClose={() => setModal(null)}
          onSubmit={(obraId, payload) => {
            if (modal.mode === "create") {
              createMutation.mutate({ obraId, payload });
            } else {
              updateMutation.mutate({ obraId, nroFactura: modal.data.nro_factura, payload });
            }
          }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
      {modalReporte && (
        <ReporteMensualModal onClose={() => setModalReporte(false)} accentColor="emerald" />
      )}
      {modalImpuestos && (
        <FacturaImpuestosModal
            factura={modalImpuestos}
            obraId={obraSeleccionada}
            onClose={() => setModalImpuestos(null)}
        />
      )}
    </div>
    
  );
}