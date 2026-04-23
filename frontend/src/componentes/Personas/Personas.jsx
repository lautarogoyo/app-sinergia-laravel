import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGrupos, useEstadosGrupo } from "../hooks/useGrupos";
import { useProveedores } from "../hooks/useProveedores";
import { useRubros } from "../hooks/useRubros";

const thClass = "px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500";
const tdClass = "text-lg text-gray-800 px-4 py-3 text-center";
const btnBlue = "bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer";
const btnRed = "bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer";

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
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState("proveedores");
  const [busqueda, setBusqueda] = useState("");

  const { data: grupos = [], isLoading: loadingGrupos, isError: errorGrupos } = useGrupos();
  const { data: proveedores = [], isLoading: loadingProveedores } = useProveedores();
  const { data: estadosData, isLoading: isLoadingEstados } = useEstadosGrupo();
  const { data: rubros = [], isLoading: loadingRubros } = useRubros();
  const estados = estadosData?.estados ?? [];

  const getEstadoNombre = (id_estado) => {
    const estado = estados.find((e) => e.estado_grupo_id === id_estado);
    return estado?.descripcion ?? "SIN ESTADO";
  };

  const filtro = busqueda.trim().toLowerCase();

  const proveedoresFiltrados = useMemo(
    () => !filtro ? proveedores : proveedores.filter((p) =>
      ["nombre", "apellido", "telefono", "email", "direccion", "comentario", "fecha_ingreso"]
        .some((c) => String(p[c] || "").toLowerCase().includes(filtro))
    ),
    [proveedores, filtro]
  );

  const gruposFiltrados = useMemo(
    () => !filtro ? grupos : grupos.filter((g) =>
      ["denominacion", "estado", "id"].some((c) => String(g[c] || "").toLowerCase().includes(filtro))
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
            <button type="button" onClick={() => navigate("/crear-persona")} className={btnBlue}>Nuevo Proveedor</button>
          )}
          {seccion === "grupos" && (
            <button type="button" onClick={() => navigate("/crear-grupo")} className={btnBlue}>Nuevo Grupo</button>
          )}
          {seccion === "rubros" && (
            <button type="button" onClick={() => navigate("/rubros")} className={btnBlue}>Gestionar Rubros</button>
          )}
        </div>
      </div>

      {seccion === "proveedores" && (
        <div className="bg-white rounded-xl border border-gray-300 shadow-2xl overflow-x-auto">
          <h3 className="text-2xl font-bold p-4 text-gray-800">Proveedores</h3>
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
              <tr>
                {["Proveedor", "Teléfono", "Email", "Estado Fiscal", "Ingreso", "Acciones"].map((h) => (
                  <th key={h} className={thClass}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-50 divide-y divide-gray-200">
              {loadingProveedores ? (
                <TableEmpty cols={6} mensaje="Cargando proveedores..." />
              ) : proveedoresFiltrados.length === 0 ? (
                <TableEmpty cols={6} mensaje="No hay proveedores para mostrar." />
              ) : (
                proveedoresFiltrados.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-200 transition-colors duration-150">
                    <td className={tdClass}>{[p.nombre, p.apellido].filter(Boolean).join(" ") || "-"}</td>
                    <td className={tdClass}>{p.telefono || "-"}</td>
                    <td className={tdClass}>{p.email || "-"}</td>
                    <td className={tdClass}>{p.monotributista ? "Monotributista" : "Responsable"}</td>
                    <td className={tdClass}>{p.fecha_ingreso || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button type="button" onClick={() => navigate(`/editarpersona/${p.id}`)} className={btnBlue}>Editar</button>
                        <button type="button" onClick={() => navigate(`/eliminarpersona/${p.id}`)} className={btnRed}>Eliminar</button>
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
        loadingGrupos || isLoadingEstados ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-xl text-gray-500 animate-pulse">Cargando grupos...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-300 shadow-2xl overflow-x-auto">
            <h3 className="text-2xl font-bold p-4 text-gray-800">Grupos</h3>
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
                <tr>
                  {["Denominación", "Estado", "Acciones"].map((h) => (
                    <th key={h} className={thClass}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-50 divide-y divide-gray-200">
                {errorGrupos ? (
                  <tr><td colSpan={3} className="px-6 py-4 text-center text-red-500">No se pudieron cargar los grupos.</td></tr>
                ) : gruposFiltrados.length === 0 ? (
                  <TableEmpty cols={3} mensaje="No hay grupos para mostrar." />
                ) : (
                  gruposFiltrados.map((g) => {
                    const grupoId = g.grupo_id ?? g.id;
                    return (
                      <tr key={grupoId} className="hover:bg-gray-200 transition-colors duration-150">
                        <td className={tdClass}>{g.denominacion || "Sin nombre"}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`rounded px-3 py-1 text-sm font-bold uppercase border ${estadoBadge[getEstadoNombre(g.id_estado)?.toLowerCase()] ?? estadoBadge.pendiente}`}>
                            {getEstadoNombre(g.id_estado)?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center flex-wrap">
                            <button type="button" onClick={() => navigate(`/editargrupo/${grupoId}`)} className={btnBlue}>Editar</button>
                            <button type="button" onClick={() => navigate(`/eliminargrupo/${grupoId}`)} className={btnRed}>Eliminar</button>
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
                        <button type="button" onClick={() => navigate(`/editarrubro/${r.rubro_id}`)} className={btnBlue}>Editar</button>
                        <button type="button" onClick={() => navigate(`/eliminarrubro/${r.rubro_id}`)} className={btnRed}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
