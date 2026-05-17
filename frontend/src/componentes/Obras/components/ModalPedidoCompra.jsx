import React from "react";
import Icon from "../../Icons/Icons";
import RubrosSelect from "../../shared/RubrosSelect.jsx";
import GruposSelect from "../../shared/GruposSelect.jsx";
import ProveedorSelect from "../../shared/ProveedorSelect.jsx";

export default function ModalPedidoCompra({ pedidoForm, actualizarPedidoCampo, onGuardar, onCerrar, gruposDisponibles = [], pedidoEditando, mostrarInputNuevoRubro, setMostrarInputNuevoRubro, nuevoRubroTexto, setNuevoRubroTexto, handleCrearRubro, creandoRubro, estadosContratista = [], estadosPedido = [], estadosRegistro = [], rolesPedido = [], onEliminarPresupuesto }) {
  const normalize = (str) => str?.replace(/_/g, " ").toUpperCase() || "";

  const handleArchivosPresupuesto = (e) => {
    const files = Array.from(e.target.files || []);
    actualizarPedidoCampo("archivos_presupuesto", files);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onCerrar}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">{pedidoEditando ? "Editar pedido de compra" : "Nuevo pedido de compra"}</h3>
          <button type="button" onClick={onCerrar} className="text-gray-500 hover:text-gray-800"><Icon name="x" className="w-6 h-6" /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rol del pedido</label>
            <select value={pedidoForm.rol_pedido_id} onChange={(e) => actualizarPedidoCampo("rol_pedido_id", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">— Seleccionar —</option>
              {rolesPedido.map((r) => (
                <option key={r.rol_id} value={r.rol_id}>{normalize(r.descripcion)}</option>
              ))}
            </select>
          </div>

          {/* Presupuestos */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Archivos de presupuesto</label>

            {/* Presupuestos existentes */}
            {pedidoEditando?.presupuestos?.length > 0 && (
            <div className="mb-2 space-y-1">
              {pedidoEditando.presupuestos.map((p) => (
                <div key={p.presupuesto_id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 gap-2">
                  <a 
                    href={`${import.meta.env.VITE_API_URL}/storage/${p.path_archivo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline flex-1 min-w-0 truncate"
                  >
                    📎 {p.nombre_archivo || p.path_archivo.split("/").pop()}
                  </a>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onEliminarPresupuesto(p.presupuesto_id); }}
                    className="flex-shrink-0 ml-2 p-1 text-red-600 bg-white border border-red-100 hover:text-white hover:bg-red-600 rounded shadow-sm"
                    title="Eliminar presupuesto"
                    aria-label="Eliminar presupuesto"
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

            {/* Input múltiple */}
            <input
              type="file"
              multiple
              onChange={handleArchivosPresupuesto}
              className="w-full text-sm"
            />
            {pedidoForm.archivos_presupuesto?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {pedidoForm.archivos_presupuesto.map((f, i) => (
                  <li key={i} className="text-xs text-gray-500">+ {f.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Archivo de material</label>
            {pedidoEditando?.path_material && (
              <div className="mb-1"><a href={`${import.meta.env.VITE_API_URL}/storage/${pedidoEditando.path_material}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">📎 {pedidoEditando.path_material.split("/").pop()}</a></div>
            )}
            <input type="file" onChange={(e) => actualizarPedidoCampo("archivo_material", e.target.files?.[0] || null)} className="w-full text-sm" />
            {pedidoForm.archivo_material?.name && (<p className="text-xs text-gray-500 mt-1">Nuevo: {pedidoForm.archivo_material.name}</p>)}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha del pedido</label>
            <input type="date" value={pedidoForm.fecha_pedido} onChange={(e) => actualizarPedidoCampo("fecha_pedido", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha entrega estimada</label>
            <input type="date" value={pedidoForm.fecha_entrega_estimada} onChange={(e) => actualizarPedidoCampo("fecha_entrega_estimada", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Estado del contratista</label>
            <select value={pedidoForm.estado_contratista_id} onChange={(e) => actualizarPedidoCampo("estado_contratista_id", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">— Sin asignar —</option>
              {estadosContratista.map((e) => (
                <option key={e.estado_contratista_id} value={e.estado_contratista_id}>{normalize(e.descripcion)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Estado del pedido</label>
            <select value={pedidoForm.estado_pedido_id} onChange={(e) => actualizarPedidoCampo("estado_pedido_id", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">— Seleccionar —</option>
              {estadosPedido.map((e) => (
                <option key={e.estado_pedido_id} value={e.estado_pedido_id}>{normalize(e.descripcion)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Estado del registro</label>
            <select value={pedidoForm.estado_registro_id} onChange={(e) => actualizarPedidoCampo("estado_registro_id", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">— Seleccionar —</option>
              {estadosRegistro.map((e) => (
                <option key={e.estado_registro_id} value={e.estado_registro_id}>{normalize(e.descripcion)}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Observaciones</label>
            <textarea value={pedidoForm.observaciones} onChange={(e) => actualizarPedidoCampo("observaciones", e.target.value)} rows={2} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-semibold text-gray-700">Rubros <span className="text-xs font-normal text-gray-400">(seleccioná uno o más)</span></label>
              <button type="button" onClick={() => { setMostrarInputNuevoRubro(!mostrarInputNuevoRubro); setNuevoRubroTexto(""); }} className="text-xs text-blue-600 hover:text-blue-800 font-semibold">{mostrarInputNuevoRubro ? "Cancelar" : "+ Nuevo rubro"}</button>
            </div>
            {mostrarInputNuevoRubro && (
              <div className="flex gap-2 mb-2">
                <input type="text" value={nuevoRubroTexto} onChange={(e) => setNuevoRubroTexto(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCrearRubro()} placeholder="Nombre del nuevo rubro..." className="flex-1 border border-blue-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" autoFocus />
                <button type="button" onClick={handleCrearRubro} disabled={creandoRubro || !nuevoRubroTexto.trim()} className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap">{creandoRubro ? "Creando..." : "Crear y agregar"}</button>
              </div>
            )}
            <RubrosSelect value={pedidoForm.rubros_ids} onChange={(ids) => actualizarPedidoCampo("rubros_ids", ids)} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Proveedores</label>
            <ProveedorSelect value={pedidoForm.proveedores_ids} onChange={(ids) => actualizarPedidoCampo("proveedores_ids", ids)} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contratista</label>
            <GruposSelect value={pedidoForm.grupos_ids} onChange={(ids) => actualizarPedidoCampo("grupos_ids", ids)} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button type="button" onClick={onCerrar} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm font-medium">Cancelar</button>
          <button type="button" onClick={onGuardar} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">{pedidoEditando ? "Actualizar pedido" : "Guardar pedido"}</button>
        </div>
      </div>
    </div>
  );
}