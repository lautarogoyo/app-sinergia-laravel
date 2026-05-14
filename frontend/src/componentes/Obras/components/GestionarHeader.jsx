import React from "react";
import Icon from "../../Icons/Icons";

export default function GestionarHeader({ obraData, estadoObraIdActual, estadosObraDisponibles, pedidosActivosCount, pedidosArchivadosCount, onEstadoChange, onVolver }) {
  const normalizeEstadoDescription = (description) => {
    if (!description) return "Sin definir";
    return description.replace(/_/g, " ").toUpperCase();
  };

  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onVolver} className="text-gray-600 hover:text-gray-800" type="button">
            <Icon name="arrow-left" className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Obra #{obraData?.nro_obra} – {obraData?.detalle}
          </h1>
        </div>
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold">
              Estado actual: {normalizeEstadoDescription(estadosObraDisponibles.find(e => e.estado_obra_id === estadoObraIdActual)?.descripcion)}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 text-sm">
              Activos: {pedidosActivosCount}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 text-sm">
              Archivados: {pedidosArchivadosCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 mr-2">Estado:</label>
            <select value={estadoObraIdActual || ""} onChange={onEstadoChange} className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px]">
              <option value="">Selecciona un estado</option>
              {estadosObraDisponibles.map((estado) => (
                <option key={estado.estado_obra_id} value={estado.estado_obra_id}>
                  {normalizeEstadoDescription(estado.descripcion)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
