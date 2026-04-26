import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useGrupos } from "../hooks/useGrupos";
import { useProveedores } from "../hooks/useProveedores";
import { useRubros, useCreateRubro, useUpdateRubro } from "../hooks/useRubros";
import RubroFormModal from "./Rubros/RubroFormModal.jsx";
import RubroDeleteModal from "./Rubros/RubroDeleteModal.jsx";
import ProveedorEditModal from "./Proveedores/ProveedorEditModal.jsx";
import ProveedorDeleteModal from "./Proveedores/ProveedorDeleteModal.jsx";
import ProveedorDetailModal from "./Proveedores/ProveedorDetailModal.jsx";
import GrupoDetailModal from "./Grupos/GrupoDetailModal.jsx";

const thClass = "px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500";
const tdClass = "text-lg text-gray-800 px-4 py-3 text-center";
const btnBlue = "bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer";
const btnRed = "bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer";
const btnGray = "bg-gray-200 hover:bg-gray-300 text-gray-700 text-lg font-bold py-2 px-3 rounded shadow transition duration-150 cursor-pointer flex items-center gap-1";

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

  // Proveedor modals
  const [showProveedorCreate, setShowProveedorCreate] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [proveedorEliminando, setProveedorEliminando] = useState(null);
  const [proveedorDetalle, setProveedorDetalle] = useState(null);

  // Grupo modal
  const [grupoModal, setGrupoModal] = useState(null); // { grupo, mode }

  // Rubro modals
  const [showRubroCreate, setShowRubroCreate] = useState(false);
  const [rubroEditando, setRubroEditando] = useState(null);
  const [rubroEliminando, setRubroEliminando] = useState(null);

  const { data: grupos = [], isLoading: loadingGrupos, isError: errorGrupos } = useGrupos();
  const { data: proveedores = [], isLoading: loadingProveedores } = useProveedores();
  const { data: rubros = [], isLoading: loadingRubros } = useRubros();
  const { mutate: crearRubro, isPending: creandoRubro } = useCreateRubro();
  const { mutate: actualizarRubro } = useUpdateRubro(
    rubroEditando?.rubro_id,
    () => setRubroEditando(null)
  );

  const handleCreateRubro = (data) => {
    crearRubro(data, {
      onSuccess: () => setShowRubroCreate(false),
      onError: () => Swal.fire("Error", "No se pudo crear el rubro", "error"),
    });
  };

  const handleUpdateRubro = ({ descripcion }) => {
    actualizarRubro({ descripcion }, {
      onError: () => Swal.fire("Error", "No se pudo actualizar el rubro", "error"),
    });
  };

  const filtro = busqueda.trim().toLowerCase();

  const proveedoresFiltrados = useMemo(
    () => !filtro ? proveedores : proveedores.filter((p) =>
      ["nombre_apellido", "telefono", "email", "direccion", "observacion", "fecha_ingreso"]
        .some((c) => String(p[c] || "").toLowerCase().includes(filtro))
    ),
    [proveedores, filtro]
  );

  const gruposFiltrados = useMemo(
    () => !filtro ? grupos : grupos.filter((g) =>
      ["nombre_apellido", "telefono", "email", "ciudad", "contacto"]
        .some((c) => String(g[c] || "").toLowerCase().includes(filtro))
    ),
    [grupos, filtro]
  );

  const rubrosFiltrados = useMemo(
    () => !filtro ? rubros : rubros.filter((r) =>
      (r.descripcion ?? "").toLowerCase().includes(filtro) ||
      String(r.rubro_id ?? "").includes(filtro)
    ),
    [rubros, filtro]
  );

  return (
    <div className="p-8 bg-gray-100 lg:w-full flex flex-col">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide">Panel de Personas</h2>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-end">
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

        <div className="flex gap-2 pb-0.5">
          {seccion === "proveedores" && (
            <button type="button" onClick={() => setShowProveedorCreate(true)} className={btnBlue}>
              Nuevo Proveedor
            </button>
          )}
          {seccion === "grupos" && (
            <button type="button" onClick={() => setGrupoModal({ grupo: null, mode: "create" })} className={btnBlue}>
              Nuevo Grupo
            </button>
          )}
          {seccion === "rubros" && (
            <button
              type="button"
              onClick={() => setShowRubroCreate(true)}
              className={btnBlue}
              disabled={creandoRubro}
            >
              {creandoRubro ? "Guardando..." : "Agregar Rubro"}
            </button>
          )}
        </div>
      </div>

      {seccion === "proveedores" && (
        <div className="bg-white rounded-xl border border-gray-300 shadow-2xl overflow-x-auto">
          <h3 className="text-2xl font-bold p-4 text-gray-800">Proveedores</h3>
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
              <tr>
                {["Proveedor", "Teléfono", "Email", "Acciones"].map((h) => (
                  <th key={h} className={thClass}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-50 divide-y divide-gray-200">
              {loadingProveedores ? (
                <TableEmpty cols={4} mensaje="Cargando proveedores..." />
              ) : proveedoresFiltrados.length === 0 ? (
                <TableEmpty cols={4} mensaje="No hay proveedores para mostrar." />
              ) : (
                proveedoresFiltrados.map((p) => (
                  <tr key={p.proveedor_id} className="hover:bg-gray-200 transition-colors duration-150">
                    <td className={tdClass}>{p.nombre_apellido || "-"}</td>
                    <td className={tdClass}>{p.telefono || "-"}</td>
                    <td className={tdClass}>{p.email || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button type="button" onClick={() => setProveedorDetalle(p)} className={btnGray} title="Ver detalle"><LupaIcon /></button>
                        <button type="button" onClick={() => setProveedorEditando(p)} className={btnBlue}>Editar</button>
                        <button type="button" onClick={() => setProveedorEliminando(p)} className={btnRed}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {seccion === "grupos" && (
        loadingGrupos ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-xl text-gray-500 animate-pulse">Cargando grupos...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-300 shadow-2xl overflow-x-auto">
            <h3 className="text-2xl font-bold p-4 text-gray-800">Grupos</h3>
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
                <tr>
                  {["Nombre", "Teléfono", "Email", "Estado", "Acciones"].map((h) => (
                    <th key={h} className={thClass}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-50 divide-y divide-gray-200">
                {errorGrupos ? (
                  <tr><td colSpan={5} className="px-6 py-4 text-center text-red-500">No se pudieron cargar los grupos.</td></tr>
                ) : gruposFiltrados.length === 0 ? (
                  <TableEmpty cols={5} mensaje="No hay grupos para mostrar." />
                ) : (
                  gruposFiltrados.map((g) => {
                    const grupoId = g.grupo_id ?? g.id;
                    const estadoNombre = g.estado_grupo?.descripcion ?? "SIN ESTADO";
                    return (
                      <tr key={grupoId} className="hover:bg-gray-200 transition-colors duration-150">
                        <td className={tdClass}>{g.nombre_apellido || "-"}</td>
                        <td className={tdClass}>{g.telefono || "-"}</td>
                        <td className={tdClass}>{g.email || "-"}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`rounded px-3 py-1 text-sm font-bold uppercase border ${estadoBadge[estadoNombre.toLowerCase()] ?? estadoBadge.pendiente}`}>
                            {estadoNombre.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center flex-wrap">
                            <button type="button" onClick={() => setGrupoModal({ grupo: g, mode: "read" })} className={btnGray} title="Ver detalle"><LupaIcon /></button>
                            <button type="button" onClick={() => setGrupoModal({ grupo: g, mode: "edit" })} className={btnBlue}>Editar</button>
                            <button type="button" onClick={() => setGrupoModal({ grupo: g, mode: "delete" })} className={btnRed}>Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )
      )}

      {seccion === "rubros" && (
        <div className="bg-white rounded-xl border border-gray-300 shadow-2xl overflow-x-auto">
          <h3 className="text-2xl font-bold p-4 text-gray-800">Rubros</h3>
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
              <tr>
                {["ID", "Descripción", "Acciones"].map((h) => (
                  <th key={h} className={thClass}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-50 divide-y divide-gray-200">
              {loadingRubros ? (
                <TableEmpty cols={3} mensaje="Cargando rubros..." />
              ) : rubrosFiltrados.length === 0 ? (
                <TableEmpty cols={3} mensaje="No hay rubros para mostrar." />
              ) : (
                rubrosFiltrados.map((r) => (
                  <tr key={r.rubro_id} className="hover:bg-gray-200 transition-colors duration-150">
                    <td className={tdClass}>{r.rubro_id}</td>
                    <td className={tdClass}>{r.descripcion ?? "Sin descripción"}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button type="button" onClick={() => setRubroEditando(r)} className={btnBlue}>Editar</button>
                        <button type="button" onClick={() => setRubroEliminando(r)} className={btnRed}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Proveedor modals */}
      {showProveedorCreate && (
        <ProveedorEditModal
          proveedor={null}
          onClose={() => setShowProveedorCreate(false)}
        />
      )}

      {proveedorEditando && (
        <ProveedorEditModal
          proveedor={proveedorEditando}
          onClose={() => setProveedorEditando(null)}
        />
      )}

      {proveedorEliminando && (
        <ProveedorDeleteModal
          proveedor={proveedorEliminando}
          onClose={() => setProveedorEliminando(null)}
        />
      )}

      {proveedorDetalle && (
        <ProveedorDetailModal
          proveedor={proveedorDetalle}
          onClose={() => setProveedorDetalle(null)}
        />
      )}

      {/* Grupo modal */}
      {grupoModal && (
        <GrupoDetailModal
          grupo={grupoModal.grupo}
          initialMode={grupoModal.mode}
          onClose={() => setGrupoModal(null)}
        />
      )}

      {/* Rubro modals */}
      {showRubroCreate && (
        <RubroFormModal
          rubro={null}
          onClose={() => setShowRubroCreate(false)}
          onCreate={handleCreateRubro}
          onUpdate={() => {}}
        />
      )}

      {rubroEditando && (
        <RubroFormModal
          rubro={rubroEditando}
          onClose={() => setRubroEditando(null)}
          onCreate={() => {}}
          onUpdate={handleUpdateRubro}
        />
      )}

      {rubroEliminando && (
        <RubroDeleteModal
          rubro={rubroEliminando}
          onClose={() => setRubroEliminando(null)}
        />
      )}
    </div>
  );
}
