import React from "react";
import Icon from "../../Icons/Icons";
import PedidoCard from "./PedidoCard";

export default function PedidosCompraSection({ pedidosFiltrados = [], mostrarArchivados, setMostrarArchivados, abrirModalPedido, pedidosActivosCount, pedidosArchivadosCount, onEditar, onArchivar, onEliminar, handleEliminarPresupuesto }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Pedidos de compra</h3>
          <p className="text-sm text-gray-500">Gestiona pedidos activos y archivados de esta obra.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setMostrarArchivados(!mostrarArchivados)} className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md border border-gray-200 ${mostrarArchivados ? "bg-blue-100 hover:bg-blue-200 text-blue-700" : "bg-gray-100 hover:bg-gray-200"}`} title={mostrarArchivados ? "Ocultar archivados" : "Mostrar archivados"}>
            <Icon name="archive" className="w-4 h-4" />
            <span className="hidden sm:inline">{mostrarArchivados ? "Ocultar" : "Archivados"}</span>
          </button>
          <button type="button" onClick={abrirModalPedido} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md border border-blue-600">
            <Icon name="plus" className="w-4 h-4" />
            Nuevo pedido
          </button>
        </div>
      </div>

      {pedidosFiltrados.length > 0 ? (
        <div className="space-y-3">
          {pedidosFiltrados.map((pedido) => (
            <PedidoCard key={pedido.pedido_compra_id} pedido={pedido} onEditar={onEditar} onArchivar={onArchivar} onEliminar={onEliminar}  onEliminarPresupuesto={handleEliminarPresupuesto}
 />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg bg-gray-50 px-4 py-3">
          {mostrarArchivados ? "No hay pedidos archivados" : "No hay pedidos de compra activos"}
        </p>
      )}
    </div>
  );
}
