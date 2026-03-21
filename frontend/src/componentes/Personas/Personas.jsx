import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGrupos, useEstadosGrupo } from "../hooks/useGrupos";
import { useProveedores } from "../hooks/useProveedores";

const estadoBadge = {
  pendiente: "bg-amber-100 text-amber-700 border-amber-300",
  apto: "bg-emerald-100 text-emerald-700 border-emerald-300",
  activo: "bg-blue-100 text-blue-700 border-blue-300",
};

const thClass = "px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500";
const tdClass = "text-lg text-gray-800 px-4 py-3";
const btnBlue = "bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer";
const btnRed = "bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer";

function TableEmpty({ cols, mensaje }) {
  return (
    <tr>
      <td colSpan={cols} className="px-6 py-4 text-center text-gray-500">{mensaje}</td>
    </tr>
  );
}

export default function Personas() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");

  const { data: grupos = [], isLoading: loadingGrupos, isError: errorGrupos } = useGrupos();
  const { data: proveedores = [], isLoading: loadingProveedores } = useProveedores();
  const { data: estadosData, isLoading: isLoadingEstados } = useEstadosGrupo();
  const estados = estadosData?.estados ?? [];

  const getEstadoNombre = (id_estado) => {
    const estado = estados.find((e) => e.estado_grupo_id === id_estado);
    return estado?.descripcion ?? "SIN ESTADO";
  };

  const filtro = busqueda.trim().toLowerCase();

  const filtrar = (items, campos) =>
    !filtro ? items : items.filter((item) =>
      campos.some((c) => String(item[c] || "").toLowerCase().includes(filtro))
    );

  const proveedoresFiltrados = useMemo(
    () => filtrar(proveedores, ["nombre", "apellido", "telefono", "email", "direccion", "comentario", "fecha_ingreso"]),
    [proveedores, filtro]
  );

  const gruposFiltrados = useMemo(
    () => filtrar(grupos, ["denominacion", "estado", "id"]),
    [grupos, filtro]
  );

  return (
    <div className="p-8 bg-gray-100 lg:w-full flex flex-col">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide">Panel de Personas</h2>

      <div className="mb-6 w-full max-w-2xl flex flex-col">
        <label htmlFor="filtro" className="mb-2 text-lg font-medium text-gray-700">Filtrar:</label>
        <input
          id="filtro"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Filtrar por proveedor, contacto, estado o grupo..."
          className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400 mb-4"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <button type="button" onClick={() => navigate("/crear-persona")} className={btnBlue}>Nuevo Proveedor</button>
          <button type="button" onClick={() => navigate("/crear-grupo")} className={btnBlue}>Nuevo Contratista</button>
        </div>
      </div>

      {/* Tabla Proveedores */}
      <div className="mb-8 p-4 bg-white rounded-xl border border-gray-300 shadow-2xl">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Proveedores</h3>
        <div className="shadow-2xl rounded-xl border border-gray-300 bg-white overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
              <tr>
                {["Proveedor", "Teléfono", "Email", "Estado Fiscal", "Ingreso", "Acciones"].map((h) => (
                  <th key={h} className={thClass}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-50 divide-y divide-gray-200 text-center">
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
      </div>

      {/* Tabla Grupos */}
      {loadingGrupos || isLoadingEstados ? (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
          <div className="relative">
            <div className="mt-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Personas</h2>
              <div className="w-80 h-3 bg-gray-700 rounded-full overflow-hidden shadow-lg">
                <div className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full animate-loading-bar"></div>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="shadow-2xl rounded-xl border border-gray-300 bg-white overflow-x-auto">
          <h3 className="text-2xl font-bold p-4 text-gray-800">Grupos</h3>
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
              <tr>
                {["Denominación", "Estado", "Acciones"].map((h) => (
                  <th key={h} className={thClass}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-50 divide-y divide-gray-200 text-center">
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
      )}
    </div>
  );
}