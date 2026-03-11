import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGrupos } from "../hooks/useGrupos.jsx";
import { obtenerProveedores } from "./proveedoresStorage.js";

const ESTADOS_GRUPO = ["pendiente", "en trabajo"];

const estadoBadge = {
  pendiente: "bg-amber-100 text-amber-700 border-amber-300",
  "en trabajo": "bg-emerald-100 text-emerald-700 border-emerald-300",
};

function normalizarEstado(valor) {
  if (typeof valor !== "string") return "pendiente";
  const base = valor.trim().toLowerCase();
  return ESTADOS_GRUPO.includes(base) ? base : "pendiente";
}

export default function Personas() {
  const navigate = useNavigate();
  const { data: grupos = [], isLoading, isError } = useGrupos();

  const [busqueda, setBusqueda] = useState("");
  const [proveedores] = useState(() => obtenerProveedores());
  const [estadoGrupo, setEstadoGrupo] = useState({});

  const gruposConEstado = useMemo(
    () =>
      grupos.map((grupo) => ({
        ...grupo,
        estado: normalizarEstado(estadoGrupo[grupo.id] ?? grupo.estado ?? grupo.status),
      })),
    [grupos, estadoGrupo]
  );

  const filtro = busqueda.trim().toLowerCase();

  const proveedoresFiltrados = useMemo(
    () =>
      proveedores.filter((p) => {
        if (!filtro) return true;
        return [p.nombre, p.apellido, p.telefono, p.email, p.direccion, p.comentario, p.fecha_ingreso].some((valor) =>
          String(valor || "")
            .toLowerCase()
            .includes(filtro)
        );
      }),
    [proveedores, filtro]
  );

  const gruposFiltrados = useMemo(
    () =>
      gruposConEstado.filter((g) => {
        if (!filtro) return true;
        return [g.denominacion, g.estado, g.id].some((valor) =>
          String(valor || "")
            .toLowerCase()
            .includes(filtro)
        );
      }),
    [gruposConEstado, filtro]
  );

  return (
    <div className="p-8 bg-gray-100 lg:w-full flex flex-col">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide">Panel de Personas</h2>

      <div className="mb-6 w-full max-w-2xl flex flex-col">
        <label htmlFor="filtro-personas" className="mb-2 text-lg font-medium text-gray-700">
          Filtrar:
        </label>
        <input
          id="filtro-personas"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Filtrar por proveedor, contacto, estado o grupo..."
          className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400 mb-4"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => navigate("/crear-persona")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
          >
            Nuevo Proveedor
          </button>
          <button
            type="button"
            onClick={() => navigate("/crear-grupo")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
          >
            Agregar Grupo
          </button>
        </div>
      </div>

      <div className="mb-8 p-4 bg-white rounded-xl border border-gray-300 shadow-2xl">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Proveedores</h3>

        <div className="shadow-2xl rounded-xl border border-gray-300 bg-white flex flex-col overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
              <tr>
                <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Proveedor</th>
                <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Telefono</th>
                <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Email</th>
                <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Estado Fiscal</th>
                <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Ingreso</th>
                <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-50 divide-y divide-gray-200 text-center">
              {proveedoresFiltrados.length > 0 ? (
                proveedoresFiltrados.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-200 transition-colors duration-150">
                    <td className="text-lg text-gray-800 px-4 py-3">{[p.nombre, p.apellido].filter(Boolean).join(" ") || "-"}</td>
                    <td className="text-lg text-gray-800 px-4 py-3">{p.telefono || "-"}</td>
                    <td className="text-lg text-gray-800 px-4 py-3">{p.email || "-"}</td>
                    <td className="text-lg text-gray-800 px-4 py-3">{p.monotributista ? "Monotributista" : "Responsable"}</td>
                    <td className="text-lg text-gray-800 px-4 py-3">{p.fecha_ingreso || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button
                          type="button"
                          onClick={() => navigate(`/editarpersona/${p.id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/eliminarpersona/${p.id}`)}
                          className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No hay proveedores para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="shadow-2xl rounded-xl border border-gray-300 bg-white flex flex-col overflow-x-auto">
        <h3 className="text-2xl font-bold p-4 text-gray-800">Grupos</h3>
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
            <tr>
              <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Denominacion</th>
              <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Estado</th>
              <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 divide-y divide-gray-200 text-center">
            {isLoading ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  Cargando grupos...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-red-500">
                  No se pudieron cargar los grupos.
                </td>
              </tr>
            ) : gruposFiltrados.length > 0 ? (
              gruposFiltrados.map((g) => (
                <tr key={g.id} className="hover:bg-gray-200 transition-colors duration-150">
                  <td className="text-lg text-gray-800 px-4 py-3">{g.denominacion || "Sin nombre"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`rounded px-3 py-1 text-sm font-bold uppercase border ${estadoBadge[g.estado]}`}>
                        {g.estado}
                      </span>
                      <select
                        value={g.estado}
                        onChange={(e) => setEstadoGrupo((prev) => ({ ...prev, [g.id]: e.target.value }))}
                        className="px-3 py-2 rounded border border-gray-300 text-sm font-semibold focus:outline-none focus:ring focus:border-blue-400"
                      >
                        {ESTADOS_GRUPO.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        type="button"
                        onClick={() => navigate(`/editargrupo/${g.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/eliminargrupo/${g.id}`)}
                        className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No hay grupos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
