import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "../Icons/Icons";
import RubrosSelect from "../shared/RubrosSelect.jsx";
import GruposSelect from "../shared/GruposSelect.jsx";
import ProveedorSelect from "../shared/ProveedorSelect.jsx";
import useGestionarObra from "./hooks/useGestionarObra";

export default function PedidoCompraPage() {
  const { id, pedidoId } = useParams();
  const navigate = useNavigate();

  const {
    obraData,
    isLoading,
    isError,
    editarPedido,
    abrirModalPedido,
    actualizarPedidoCampo,
    handleGuardarPedido,
    pedidoForm,
    pedidoEditando,
    mostrarInputNuevoRubro,
    setMostrarInputNuevoRubro,
    nuevoRubroTexto,
    setNuevoRubroTexto,
    handleCrearRubro,
    creandoRubro,
    estadosContratista,
    estadosPedido,
    estadosRegistro,
    rolesPedido,
    handleEliminarPresupuesto,
    pedidosCompra,
  } = useGestionarObra();

  useEffect(() => {
    if (!obraData) return;
    if (pedidoId) {
      const pedido = pedidosCompra.find((p) => String(p.pedido_compra_id) === String(pedidoId));
      if (pedido) editarPedido(pedido);
    } else {
      abrirModalPedido();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obraData, pedidoId]);

  const volver = () => navigate(`/obra/${id}/gestionar`);

  const onGuardar = async () => {
    await handleGuardarPedido();
    volver();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Cargando...</div>
      </div>
    );
  }
  if (isError || !obraData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">Error al cargar la obra</div>
      </div>
    );
  }

  const normalize = (str) => str?.replace(/_/g, " ").toUpperCase() || "";

  const handleArchivosPresupuesto = (e) => {
    const files = Array.from(e.target.files || []);
    actualizarPedidoCampo("archivos_presupuesto", files);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-gray-50 to-white">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-3">
          <button type="button" onClick={volver} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md" title="Volver">
            <Icon name="arrowhide" className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{pedidoEditando ? "Editar pedido de compra" : "Nuevo pedido de compra"}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">Rol del pedido</label>
              <select value={pedidoForm.rol_pedido_id} onChange={(e) => actualizarPedidoCampo("rol_pedido_id", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">— Seleccionar —</option>
                {rolesPedido.map((r) => (
                  <option key={r.rol_id} value={r.rol_id}>{normalize(r.descripcion)}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-base font-semibold text-gray-700 mb-1">Archivos de presupuesto</label>

              {pedidoEditando?.presupuestos?.length > 0 && (
                <div className="mb-2 space-y-1">
                  {pedidoEditando.presupuestos.map((p) => (
                    <div key={p.presupuesto_id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 gap-2">

                      <a
                        href={`${import.meta.env.VITE_API_URL}/storage/${p.path_archivo}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-base text-blue-600 hover:underline flex-1 min-w-0 truncate"
                      >
                        📎 {p.nombre_archivo || p.path_archivo.split("/").pop()}
                      </a>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleEliminarPresupuesto(p.presupuesto_id); }}
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

              <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 rounded-md py-3 cursor-pointer transition-colors">
                <Icon name="upload" className="w-4 h-4 text-blue-600" />
                <span className="text-base text-blue-700 font-medium">Seleccionar archivos de presupuesto</span>
                <input type="file" multiple onChange={handleArchivosPresupuesto} className="hidden" />
              </label>

              {pedidoForm.archivos_presupuesto?.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {pedidoForm.archivos_presupuesto.map((f, i) => (
                    <li key={i} className="text-sm text-gray-500">+ {f.name}</li>
                  ))}
                </ul>
              )}

              <div>
                <label className="block text-base font-semibold text-gray-700 mt-3 mb-1">Archivo de material</label>
                {pedidoEditando?.path_material && (
                  <div className="mb-1"><a href={`${import.meta.env.VITE_API_URL}/storage/${pedidoEditando.path_material}`} target="_blank" rel="noreferrer" className="text-base text-blue-600 hover:underline">📎 {pedidoEditando.path_material.split("/").pop()}</a></div>
                )}
                <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 rounded-md py-3 cursor-pointer transition-colors">
                  <Icon name="upload" className="w-4 h-4 text-gray-600" />
                  <span className="text-base text-gray-700 font-medium">Seleccionar archivo de material</span>
                  <input type="file" onChange={(e) => actualizarPedidoCampo("archivo_material", e.target.files?.[0] || null)} className="hidden" />
                </label>
                {pedidoForm.archivo_material?.name && (<p className="text-sm text-gray-500 mt-1">Nuevo: {pedidoForm.archivo_material.name}</p>)}
              </div>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">Fecha del pedido</label>
              <input type="date" value={pedidoForm.fecha_pedido} onChange={(e) => actualizarPedidoCampo("fecha_pedido", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-base" />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">Fecha entrega estimada</label>
              <input type="date" value={pedidoForm.fecha_entrega_estimada} onChange={(e) => actualizarPedidoCampo("fecha_entrega_estimada", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-base" />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">Estado del contratista</label>
              <select value={pedidoForm.estado_contratista_id} onChange={(e) => actualizarPedidoCampo("estado_contratista_id", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-base">
                <option value="">— Sin asignar —</option>
                {estadosContratista.map((e) => (
                  <option key={e.estado_contratista_id} value={e.estado_contratista_id}>{normalize(e.descripcion)}</option>
                ))}
              </select>
            

           
              <label className="block text-base font-semibold text-gray-700 mb-1 mt-5">Estado del pedido</label>
              <select value={pedidoForm.estado_pedido_id} onChange={(e) => actualizarPedidoCampo("estado_pedido_id", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-base">
                <option value="">— Seleccionar —</option>
                {estadosPedido.map((e) => (
                  <option key={e.estado_pedido_id} value={e.estado_pedido_id}>{normalize(e.descripcion)}</option>
                ))}
              </select>
           

              {/* <div className="hidden">
              <label className="block text-base font-semibold text-gray-700 mb-1 mt-5 ">Estado del registro</label>
              <select value={pedidoForm.estado_registro_id} onChange={(e) => actualizarPedidoCampo("estado_registro_id", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-base">
                <option value="Actri">— Seleccionar —</option>
                {estadosRegistro.map((e) => (
                  <option key={e.estado_registro_id} value={e.estado_registro_id}>{normalize(e.descripcion)}</option>
                ))}
              </select>
              </div> */}
            </div>

            <div className="md:col-span-2">
              <label className="block text-base font-semibold text-gray-700 mb-1">Observaciones</label>
              <textarea value={pedidoForm.observaciones} onChange={(e) => actualizarPedidoCampo("observaciones", e.target.value)} rows={2} className="w-full border border-gray-300 rounded-md px-3 py-2 text-base" />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-base font-semibold text-gray-700">Rubros <span className="text-sm font-normal text-gray-400">(seleccioná uno o más)</span></label>
                <button type="button" onClick={() => { setMostrarInputNuevoRubro(!mostrarInputNuevoRubro); setNuevoRubroTexto(""); }} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">{mostrarInputNuevoRubro ? "Cancelar" : "+ Nuevo rubro"}</button>
              </div>
              {mostrarInputNuevoRubro && (
                <div className="flex gap-2 mb-2">
                  <input type="text" value={nuevoRubroTexto} onChange={(e) => setNuevoRubroTexto(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCrearRubro()} placeholder="Nombre del nuevo rubro..." className="flex-1 border border-blue-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" autoFocus />
                  <button type="button" onClick={handleCrearRubro} disabled={creandoRubro || !nuevoRubroTexto.trim()} className="px-3 py-2 bg-blue-600 text-white text-base rounded-md hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap">{creandoRubro ? "Creando..." : "Crear y agregar"}</button>
                </div>
              )}
              <RubrosSelect value={pedidoForm.rubros_ids} onChange={(ids) => actualizarPedidoCampo("rubros_ids", ids)} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-base font-semibold text-gray-700 mb-1">Proveedores<span className="text-sm font-normal text-gray-400">(seleccioná uno o más)</span></label>
              <ProveedorSelect value={pedidoForm.proveedores_ids} onChange={(ids) => actualizarPedidoCampo("proveedores_ids", ids)} />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">Contratistas<span className="text-sm font-normal text-gray-400">(seleccioná uno o más)</span></label>
              <GruposSelect value={pedidoForm.grupos_ids} onChange={(ids) => actualizarPedidoCampo("grupos_ids", ids)} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={volver} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-base font-medium">Cancelar</button>
            <button type="button" onClick={onGuardar} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-base font-medium">{pedidoEditando ? "Actualizar pedido" : "Guardar pedido"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
