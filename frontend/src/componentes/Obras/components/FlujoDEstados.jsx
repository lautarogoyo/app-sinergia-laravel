import React from "react";

export default function FlujoDEstados({ estadosObraDisponibles = [], estadoObraIdActual }) {
  const ETIQUETAS_ESTADO = {
    pedida: "Pedida para cotizar",
    cotizada: "Cotizada",
    en_curso: "En Curso",
    finalizada: "Finalizada",
  };

  const normalize = (d) => (d ? ETIQUETAS_ESTADO[d.toLowerCase()] || d.replace(/_/g, " ").toUpperCase() : "Sin definir");

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm lg:sticky lg:top-28">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Flujo de estados</h3>
      <div className="space-y-4">
        {estadosObraDisponibles.map((estado, index) => {
          const estadoIndex = estadosObraDisponibles.findIndex((e) => e.estado_obra_id === estadoObraIdActual);
          const currentIndex = index;
          const isActivo = estado.estado_obra_id === estadoObraIdActual;
          const isCompletado = currentIndex < estadoIndex;
          return (
            <div key={estado.estado_obra_id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActivo ? "bg-blue-600 text-white" : isCompletado ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"}`}>
                  {isActivo ? "●" : isCompletado ? "✓" : "○"}
                </div>
                {index < estadosObraDisponibles.length - 1 && (
                  <div className={`w-0.5 h-8 mt-1 ${isCompletado ? "bg-green-500" : "bg-gray-300"}`}></div>
                )}
              </div>
              <div className={`flex-1 pt-0.5 ${isActivo ? "font-medium text-gray-900" : isCompletado ? "text-green-700" : "text-gray-500"}`}>
                {normalize(estado.descripcion)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
