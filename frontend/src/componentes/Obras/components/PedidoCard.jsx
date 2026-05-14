import React from "react";
import Icon from "../../Icons/Icons";

export default function PedidoCard({ pedido, onEditar, onArchivar, onEliminar }) {
  return (
    <div
      onClick={() => onEditar?.(pedido)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onEditar?.(pedido); } }}
      className="border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col gap-3 bg-gradient-to-b from-white to-gray-50 cursor-pointer hover:border-blue-300 hover:shadow-sm transition"
    >
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className="text-sm text-gray-500">Rol</p>
          <p className="text-base font-semibold text-gray-900 uppercase">{pedido.rol}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700 uppercase">{pedido.archivado_at ? "archivado" : (pedido.estado_pedido || "pendiente")}</span>
          <button type="button" onClick={(e) => { e.stopPropagation(); onEditar?.(pedido); }} className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" title="Editar">
            <Icon name="pencil" className="w-4 h-4" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onArchivar?.(pedido); }} className="p-1 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded" title="Archivar">
            <Icon name="archive" className="w-4 h-4" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onEliminar?.(pedido.id); }} className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="Eliminar">
            <Icon name="trash" className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
        <div>
          <p className="text-gray-500">Fecha pedido</p>
          <p className="font-medium">{pedido.fecha_pedido ? new Date(pedido.fecha_pedido).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "-"}</p>
        </div>
        <div>
          <p className="text-gray-500">Entrega estimada</p>
          <p className="font-medium">{pedido.fecha_entrega_estimada ? new Date(pedido.fecha_entrega_estimada).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "-"}</p>
        </div>
      </div>

      {pedido.grupo && (
        <div className="text-sm">
          <p className="text-gray-500">Contratista</p>
          <span className="inline-block bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded mt-0.5">{pedido.grupo.nombre_apellido}</span>
        </div>
      )}

      {pedido.rubros?.length > 0 && (
        <div className="text-sm">
          <p className="text-gray-500 mb-1">Rubros</p>
          <div className="flex flex-wrap gap-1">
            {pedido.rubros.map((r) => (
              <span key={r.id} className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded border border-blue-100">{r.descripcion}</span>
            ))}
          </div>
        </div>
      )}

      {pedido.proveedores?.length > 0 && (
        <div className="text-sm">
          <p className="text-gray-500 mb-1">Proveedores</p>
          <div className="flex flex-wrap gap-1">
            {pedido.proveedores.map((prov, idx) => (
              <span key={idx} className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded border border-green-100">{prov}</span>
            ))}
          </div>
        </div>
      )}

      {pedido.path_presupuesto && (
        <div className="text-sm">
          <p className="text-gray-500">Presupuesto</p>
          <a href={`${import.meta.env.VITE_API_URL}/storage/${pedido.path_presupuesto}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:underline">📎 {pedido.path_presupuesto.split("/").pop()}</a>
        </div>
      )}

      {pedido.path_material && (
        <div className="text-sm">
          <p className="text-gray-500">Material</p>
          <a href={`${import.meta.env.VITE_API_URL}/storage/${pedido.path_material}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:underline">📎 {pedido.path_material.split("/").pop()}</a>
        </div>
      )}

      {pedido.observaciones && (
        <div className="text-sm">
          <p className="text-gray-500">Observaciones</p>
          <p className="text-gray-700">{pedido.observaciones}</p>
        </div>
      )}
    </div>
  );
}
