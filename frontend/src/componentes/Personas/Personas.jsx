import { useMemo, useState } from "react";
import { useGrupos, useDeleteGrupo } from "../hooks/useGrupos";
import { useProveedores, useDeleteProveedor } from "../hooks/useProveedores";
import { useRubros, useDeleteRubro } from "../hooks/useRubros";
import ProveedorDetailModal from "./Proveedores/ProveedorDetailModal.jsx";
import GrupoDetailModal from "./Grupos/GrupoDetailModal.jsx";
import RubroDetailModal from "./Rubros/RubroDetailModal.jsx";
import PaginationControls from "../shared/PaginationControls.jsx";
import { usePagination } from "../shared/usePagination.jsx";
import Swal from "sweetalert2";
import Icon from "../Icons/Icons.jsx";


const thClass = "px-6 py-3 text-left text-xl font-bold text-gray-100 border-b border-gray-500";
const tdClass = "text-lg text-gray-800 px-4 py-3 text-left max-w-xs";
const btnBlue = "bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer";
const btnRed = "bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer";

function LupaIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

const estadoBadge = {
  pendiente: "bg-amber-100 text-amber-700 border-amber-300",
  apto: "bg-emerald-100 text-emerald-700 border-emerald-300",
  activo: "bg-blue-100 text-blue-700 border-blue-300",
};

function TableEmpty({ cols, mensaje }) {
  return (
    <tr>
      <td colSpan={cols} className="px-6 py-4 text-center text-gray-500">{mensaje}</td>
    </tr>
  );
}



export default function Personas() {
  const [seccion, setSeccion] = useState("proveedores");
  const [busqueda, setBusqueda] = useState("");
  const { mutate: eliminarProveedor } = useDeleteProveedor();
  const { mutate: eliminarGrupo } = useDeleteGrupo();
  const { mutate: eliminarRubro } = useDeleteRubro();

  const [proveedorModal, setProveedorModal] = useState(null); // { proveedor, mode }
  const [grupoModal, setGrupoModal] = useState(null); // { grupo, mode }
  const [rubroModal, setRubroModal] = useState(null); // { rubro, mode }
  const [rubroFiltro, setRubroFiltro] = useState("");
  const [sortProv, setSortProv] = useState({ key: null, dir: "asc" });
  const [sortGrup, setSortGrup] = useState({ key: null, dir: "asc" });
  const [sortProf, setSortProf] = useState({ key: null, dir: "asc" });
  const [sortRubr, setSortRubr] = useState({ key: null, dir: "asc" });

  const { data: grupos = [], isLoading: loadingGrupos, isError: errorGrupos } = useGrupos();
  const { data: proveedores = [], isLoading: loadingProveedores } = useProveedores();
  const { data: rubros = [], isLoading: loadingRubros } = useRubros();

  const makeSort = (setter) => (key) =>
    setter((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );

  const SortIcon = ({ config, col }) => {
    if (config.key !== col) return <span className="ml-1 text-gray-400 text-xs">⇅</span>;
    return <span className="ml-1 text-xs">{config.dir === "asc" ? "↑" : "↓"}</span>;
  };

  const applySort = (lista, config, getVal) => {
    if (!config.key) return lista;
    return [...lista].sort((a, b) => {
      const aVal = (getVal(a, config.key) ?? "").toString().toLowerCase();
      const bVal = (getVal(b, config.key) ?? "").toString().toLowerCase();
      if (aVal < bVal) return config.dir === "asc" ? -1 : 1;
      if (aVal > bVal) return config.dir === "asc" ? 1 : -1;
      return 0;
    });
  };
  const filtro = busqueda.trim().toLowerCase();
  const handleEliminarProveedor = async (p) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Eliminar proveedor",
      text: `¿Estás seguro de eliminar a ${p.nombre_apellido}?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    eliminarProveedor(p.proveedor_id, {
      onError: () => Swal.fire("Error", "No se pudo eliminar el proveedor", "error"),
    });
  };

  const handleEliminarGrupo = async (g) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Eliminar grupo",
      text: `¿Estás seguro de eliminar a ${g.nombre_apellido}?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    eliminarGrupo(g.grupo_id ?? g.id, {
      onError: () => Swal.fire("Error", "No se pudo eliminar el grupo", "error"),
    });
  };

  const handleEliminarRubro = async (r) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Eliminar rubro",
      text: `¿Estás seguro de eliminar el rubro ${r.descripcion}?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    eliminarRubro(r.rubro_id, {
      onError: () => Swal.fire("Error", "No se pudo eliminar el rubro", "error"),
    });
  };
  const proveedoresFiltrados = useMemo(() => {
    let lista = proveedores;
    if (rubroFiltro) {
      const rf = rubroFiltro.trim().toLowerCase();
      lista = lista.filter((p) => (p.rubros ?? []).some((r) => (r.descripcion ?? "").toLowerCase().includes(rf)));
    }
    if (filtro) {
      lista = lista.filter((p) =>
        ["nombre_apellido", "telefono", "email", "direccion", "observacion", "fecha_ingreso"]
          .some((c) => String(p[c] || "").toLowerCase().includes(filtro))
      );
    }
    return applySort(lista, sortProv, (p, k) => p[k]);
  }, [proveedores, filtro, rubroFiltro, sortProv]);

  const gruposFiltrados = useMemo(() => {
    const base = grupos.filter((g) => !g.rol_profesional);
    const filtrados = !filtro ? base : base.filter((g) =>
      ["nombre_apellido", "telefono", "email", "ciudad", "contacto"].some((c) => String(g[c] || "").toLowerCase().includes(filtro))
    );
    return applySort(filtrados, sortGrup, (g, k) =>
      k === "estado" ? g.estado_grupo?.descripcion : g[k]
    );
  }, [grupos, filtro, sortGrup]);

  const profesionalesFiltrados = useMemo(() => {
    const base = grupos.filter((g) => g.rol_profesional);
    const filtrados = !filtro ? base : base.filter((g) =>
      ["nombre_apellido", "telefono", "email", "ciudad", "contacto", "especialidad"].some((c) => String(g[c] || "").toLowerCase().includes(filtro))
    );
    return applySort(filtrados, sortProf, (g, k) =>
      k === "estado" ? g.estado_grupo?.descripcion : g[k]
    );
  }, [grupos, filtro, sortProf]);

  const rubrosFiltrados = useMemo(() => {
    const filtrados = !filtro ? rubros : rubros.filter((r) =>
      (r.descripcion ?? "").toLowerCase().includes(filtro) || String(r.rubro_id ?? "").includes(filtro)
    );
    return applySort(filtrados, sortRubr, (r, k) => r[k]);
  }, [rubros, filtro, sortRubr]);
  const proveedoresPage = usePagination(proveedoresFiltrados, 8);
  const gruposPage = usePagination(gruposFiltrados, 8);
  const profesionalesPage = usePagination(profesionalesFiltrados, 8);
  const rubrosPage = usePagination(rubrosFiltrados, 8);
  const isLoadingAny = loadingProveedores || loadingGrupos || loadingRubros;

  if (isLoadingAny) return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
      <div className="relative">
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Personas</h2>
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
    </div>
  );

  return (
    <div className="p-8 bg-gray-100 lg:w-full flex flex-col">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide">Panel de Personas</h2>

      {/* ── CONTROLES SUPERIORES ── */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex flex-col gap-1">
            <label htmlFor="seccion" className="text-lg font-medium text-gray-700">Ver sección:</label>
            <select
              id="seccion"
              value={seccion}
              onChange={(e) => { setSeccion(e.target.value); setBusqueda(""); }}
              className="px-4 py-2 rounded border border-gray-300 text-lg bg-white focus:outline-none focus:ring focus:border-blue-400 cursor-pointer"
            >
              <option value="proveedores">Proveedores</option>
              <option value="grupos">Grupos</option>
              <option value="rubros">Rubros</option>
              <option value="profesionales">Profesionales</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1 max-w-xl">
            <label htmlFor="filtro" className="text-lg font-medium text-gray-700">Filtrar:</label>
            <input
              id="filtro"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar..."
              className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>

          {(seccion === "proveedores" || seccion === "grupos" || seccion === "profesionales") && (
            <div className="flex flex-col gap-1">
              <label className="text-lg font-medium text-gray-700">Rubro:</label>
              <input
                value={rubroFiltro}
                onChange={(e) => setRubroFiltro(e.target.value)}
                placeholder="Buscar por rubro..."
                className="px-4 py-2 rounded border border-gray-300 text-lg bg-white focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>
          )}
        </div>

        {seccion !== "profesionales" && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (seccion === "proveedores") setProveedorModal({ proveedor: null, mode: "create" });
                if (seccion === "grupos") setGrupoModal({ grupo: null, mode: "create" });
                if (seccion === "rubros") setRubroModal({ rubro: null, mode: "create" });
              }}
              className={btnBlue}
            >
              Agregar
            </button>
          </div>
        )}
      </div>

      {/* ── PROVEEDORES ── */}
      {seccion === "proveedores" && (
        <div className="table-card">
          <div className="table-card__viewport overflow-x-auto">
            <table className="min-w-max w-full">
              <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
                <tr>
                  <th className={thClass}></th>
                  {[["Proveedor", "nombre_apellido"], ["Teléfono", "telefono"], ["Email", "email"]].map(([label, key]) => (
                    <th key={key} onClick={() => makeSort(setSortProv)(key)} className={`${thClass} cursor-pointer select-none hover:bg-gray-600 transition`}>
                      {label}<SortIcon config={sortProv} col={key} />
                    </th>
                  ))}
                  <th className={thClass}>Rubros</th>
                </tr>
              </thead>
              <tbody className="bg-gray-50 divide-y divide-gray-200">
                {loadingProveedores ? (
                  <TableEmpty cols={5} mensaje="Cargando proveedores..." />
                ) : proveedoresPage.paginatedItems.length === 0 ? (
                  <TableEmpty cols={5} mensaje="No hay proveedores para mostrar." />
                ) : (
                  proveedoresPage.paginatedItems.map((p) => (
                    <tr key={p.proveedor_id} className="hover:bg-gray-200 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center flex-wrap">
                          <button type="button" onClick={() => setProveedorModal({ proveedor: p, mode: "read" })} className={btnBlue} title="Ver detalle"><LupaIcon /></button>
                          <button type="button" onClick={() => handleEliminarProveedor(p)} className="group bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center">
                            <Icon name="trash" className="h-6 w-6 text-white group-hover:text-yellow-200 transition-colors" />
                            <span className="sr-only">Eliminar</span>
                          </button>

                        </div>
                      </td>
                      <td className={tdClass}>{p.nombre_apellido || "-"}</td>
                      <td className={tdClass}>{p.telefono || "-"}</td>
                      <td className={tdClass}>{p.email || "-"}</td>
                      <td className={tdClass}>
                        {(p.rubros ?? []).length > 0
                          ? <span className="text-sm font-semibold break-words whitespace-normal">
                            {(p.rubros ?? []).map((r) => r.descripcion?.toUpperCase() || "-").join(", ")}
                          </span>
                          : <span className="text-gray-400 text-sm">-</span>
                        }
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <PaginationControls
            currentPage={proveedoresPage.currentPage}
            totalPages={proveedoresPage.totalPages}
            totalItems={proveedoresPage.totalItems}
            startItem={proveedoresPage.startItem}
            endItem={proveedoresPage.endItem}
            pageSize={proveedoresPage.pageSize}
            onPageSizeChange={proveedoresPage.setPageSize}
            hasPrevious={proveedoresPage.hasPrevious}
            hasNext={proveedoresPage.hasNext}
            onPrevious={() => proveedoresPage.setCurrentPage((page) => Math.max(1, page - 1))}
            onNext={() => proveedoresPage.setCurrentPage((page) => Math.min(proveedoresPage.totalPages, page + 1))}
          />
        </div>
      )}

      {/* ── GRUPOS ── */}
      {seccion === "grupos" && (
        loadingGrupos ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-xl text-gray-500 animate-pulse">Cargando grupos...</p>
          </div>
        ) : (
          <div className="table-card">
            <div className="table-card__viewport overflow-x-auto">
              <table className="min-w-max w-full">
                <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
                  <tr>
                    <th className={thClass}></th>
                    {[["Nombre", "nombre_apellido"], ["Teléfono", "telefono"], ["Email", "email"]].map(([label, key]) => (
                      <th key={key} onClick={() => makeSort(setSortGrup)(key)} className={`${thClass} cursor-pointer select-none hover:bg-gray-600 transition`}>
                        {label}<SortIcon config={sortGrup} col={key} />
                      </th>
                    ))}
                    <th className={thClass}>Rubros</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-50 divide-y divide-gray-200">
                  {errorGrupos ? (
                    <tr><td colSpan={6} className="px-6 py-4 text-center text-red-500">No se pudieron cargar los grupos.</td></tr>
                  ) : gruposPage.paginatedItems.length === 0 ? (
                    <TableEmpty cols={6} mensaje="No hay grupos para mostrar." />
                  ) : (
                    gruposPage.paginatedItems.map((g) => {
                      const grupoId = g.grupo_id ?? g.id;
                      /* const estadoNombre = g.estado_grupo?.descripcion ?? "SIN ESTADO"; */
                      return (
                        <tr key={grupoId} className="hover:bg-gray-200 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center flex-wrap">
                              <button type="button" onClick={() => setGrupoModal({ grupo: g, mode: "read" })} className={btnBlue} title="Ver detalle"><LupaIcon /></button>
                              <button type="button" onClick={() => handleEliminarGrupo(g)} className="group bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center">
                                <Icon name="trash" className="h-6 w-6 text-white group-hover:text-yellow-200 transition-colors" />
                                <span className="sr-only">Eliminar</span>
                              </button>
                            </div>
                          </td>
                          <td className={tdClass}>{g.nombre_apellido || "-"}</td>
                          <td className={tdClass}>{g.telefono || "-"}</td>
                          <td className={tdClass}>{g.email || "-"}</td>
                          {/* <td className="px-6 py-4 text-center">
                            <span className={`rounded px-3 py-1 text-sm font-bold uppercase border ${estadoBadge[estadoNombre.toLowerCase()] ?? estadoBadge.pendiente}`}>
                              {estadoNombre.toUpperCase()}
                            </span>
                          </td> */}
                          <td className={tdClass}>
                            {(g.rubros ?? []).length > 0
                              ? <span className="text-sm font-semibold break-words whitespace-normal">
                                {(g.rubros ?? []).map((r) => r.descripcion?.toUpperCase() || "-").join(", ")}
                              </span>
                              : <span className="text-gray-400 text-sm">-</span>
                            }
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <PaginationControls
              currentPage={gruposPage.currentPage}
              totalPages={gruposPage.totalPages}
              totalItems={gruposPage.totalItems}
              startItem={gruposPage.startItem}
              endItem={gruposPage.endItem}
              pageSize={gruposPage.pageSize}
              onPageSizeChange={gruposPage.setPageSize}
              hasPrevious={gruposPage.hasPrevious}
              hasNext={gruposPage.hasNext}
              onPrevious={() => gruposPage.setCurrentPage((page) => Math.max(1, page - 1))}
              onNext={() => gruposPage.setCurrentPage((page) => Math.min(gruposPage.totalPages, page + 1))}
            />
          </div>
        )
      )}
      {seccion === "profesionales" && (
        loadingGrupos ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-xl text-gray-500 animate-pulse">Cargando profesionales...</p>
          </div>
        ) : (
          <div className="table-card">
            <div className="table-card__viewport overflow-x-auto">
              <table className="min-w-max w-full">
                <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
                  <tr>
                    <th className={thClass}></th>
                    {[["Nombre", "nombre_apellido"], ["Teléfono", "telefono"], ["Email", "email"], ["Especialidad", "especialidad"]].map(([label, key]) => (
                      <th key={key} onClick={() => makeSort(setSortProf)(key)} className={`${thClass} cursor-pointer select-none hover:bg-gray-600 transition`}>
                        {label}<SortIcon config={sortProf} col={key} />
                      </th>
                    ))}
                    <th className={thClass}>Rubros</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-50 divide-y divide-gray-200">
                  {errorGrupos ? (
                    <tr><td colSpan={7} className="px-6 py-4 text-center text-red-500">No se pudieron cargar los profesionales.</td></tr>
                  ) : profesionalesPage.paginatedItems.length === 0 ? (
                    <TableEmpty cols={7} mensaje="No hay profesionales para mostrar." />
                  ) : (
                    profesionalesPage.paginatedItems.map((g) => {
                      const grupoId = g.grupo_id ?? g.id;
                      /* const estadoNombre = g.estado_grupo?.descripcion ?? "SIN ESTADO"; */
                      return (
                        <tr key={grupoId} className="hover:bg-gray-200 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center flex-wrap">
                              <button type="button" onClick={() => setGrupoModal({ grupo: g, mode: "read" })} className={btnBlue} title="Ver detalle"><LupaIcon /></button>
                              <button type="button" onClick={() => handleEliminarGrupo(g)} className="group bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center">
                                <Icon name="trash" className="h-6 w-6 text-white group-hover:text-yellow-200 transition-colors" />
                                <span className="sr-only">Eliminar</span>
                              </button>
                            </div>
                          </td>
                          <td className={tdClass}>{g.nombre_apellido || "-"}</td>
                          <td className={tdClass}>{g.telefono || "-"}</td>
                          <td className={tdClass}>{g.email || "-"}</td>
                          <td className={tdClass}>{g.especialidad || "-"}</td>
                          {/* <td className="px-6 py-4 text-center">
                            <span className={`rounded px-3 py-1 text-sm font-bold uppercase border ${estadoBadge[estadoNombre.toLowerCase()] ?? estadoBadge.pendiente}`}>
                              {estadoNombre.toUpperCase()}
                            </span>
                          </td> */}
                          <td className={tdClass}>
                            {(g.rubros ?? []).length > 0
                              ? <span className="text-sm font-semibold break-words whitespace-normal">
                                {(g.rubros ?? []).map((r) => r.descripcion?.toUpperCase() || "-").join(", ")}
                              </span>
                              : <span className="text-gray-400 text-sm">-</span>
                            }
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <PaginationControls
              currentPage={profesionalesPage.currentPage}
              totalPages={profesionalesPage.totalPages}
              totalItems={profesionalesPage.totalItems}
              startItem={profesionalesPage.startItem}
              endItem={profesionalesPage.endItem}
              pageSize={profesionalesPage.pageSize}
              onPageSizeChange={profesionalesPage.setPageSize}
              hasPrevious={profesionalesPage.hasPrevious}
              hasNext={profesionalesPage.hasNext}
              onPrevious={() => profesionalesPage.setCurrentPage((page) => Math.max(1, page - 1))}
              onNext={() => profesionalesPage.setCurrentPage((page) => Math.min(profesionalesPage.totalPages, page + 1))}
            />
          </div>
        )
      )}

      {/* ── RUBROS ── */}
      {seccion === "rubros" && (
        <div className="table-card">
          <div className="table-card__viewport overflow-x-auto">
            <table className="min-w-max w-full">
              <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
                <tr>
                  <th className={thClass}></th>

                  <th onClick={() => makeSort(setSortRubr)("descripcion")} className={`${thClass} cursor-pointer select-none hover:bg-gray-600 transition`}>
                    Descripción<SortIcon config={sortRubr} col="descripcion" />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-50 divide-y divide-gray-200">
                {loadingRubros ? (
                  <TableEmpty cols={3} mensaje="Cargando rubros..." />
                ) : rubrosPage.paginatedItems.length === 0 ? (
                  <TableEmpty cols={3} mensaje="No hay rubros para mostrar." />
                ) : (
                  rubrosPage.paginatedItems.map((r) => (
                    <tr key={r.rubro_id} className="hover:bg-gray-200 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center flex-wrap">
                          <button type="button" onClick={() => setRubroModal({ rubro: r, mode: "read" })} className={btnBlue} title="Ver detalle"><LupaIcon /></button>
                          <button type="button" onClick={() => handleEliminarRubro(r)} className="group bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center">
                            <Icon name="trash" className="h-6 w-6 text-white group-hover:text-yellow-200 transition-colors" />
                            <span className="sr-only">Eliminar</span>
                          </button>
                        </div>
                      </td>
                      <td className={tdClass}>{r.descripcion ?? "Sin descripción"}</td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <PaginationControls
            currentPage={rubrosPage.currentPage}
            totalPages={rubrosPage.totalPages}
            totalItems={rubrosPage.totalItems}
            startItem={rubrosPage.startItem}
            endItem={rubrosPage.endItem}
            pageSize={rubrosPage.pageSize}
            onPageSizeChange={rubrosPage.setPageSize}
            hasPrevious={rubrosPage.hasPrevious}
            hasNext={rubrosPage.hasNext}
            onPrevious={() => rubrosPage.setCurrentPage((page) => Math.max(1, page - 1))}
            onNext={() => rubrosPage.setCurrentPage((page) => Math.min(rubrosPage.totalPages, page + 1))}
          />
        </div>
      )}

      {/* ── MODAL PROVEEDOR ── */}
      {proveedorModal && (
        <ProveedorDetailModal
          proveedor={proveedorModal.proveedor}
          initialMode={proveedorModal.mode}
          onClose={() => setProveedorModal(null)}
        />
      )}

      {/* ── MODAL GRUPO ── */}
      {grupoModal && (
        <GrupoDetailModal
          grupo={grupoModal.grupo}
          initialMode={grupoModal.mode}
          onClose={() => setGrupoModal(null)}
        />
      )}

      {/* ── MODAL RUBRO ── */}
      {rubroModal && (
        <RubroDetailModal
          rubro={rubroModal.rubro}
          initialMode={rubroModal.mode}
          onClose={() => setRubroModal(null)}
        />
      )}
    </div>
  );
}