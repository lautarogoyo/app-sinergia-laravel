import React from "react";
import Icon from "../Icons/Icons";
import PedidoCotizacion from "./Estados/PedidoCotizacion";
import EnCurso from "./Estados/EnCurso";
import Cotizada from "./Estados/Cotizada";
import Finalizada from "./Estados/Finalizada";
import useGestionarObra from "./hooks/useGestionarObra";
import GestionarHeader from "./components/GestionarHeader";
import FlujoDEstados from "./components/FlujoDEstados";
import PedidosCompraSection from "./components/PedidosCompraSection";
import ModalPedidoCompra from "./components/ModalPedidoCompra";

export default function Gestionar() {
    
  const hook = useGestionarObra();
  
  const {
    obraData,
    isLoading,
    isError,
    estadosObraDisponibles,
    gruposDisponibles,
    rubrosDisponibles,
    estadoObraIdActual,
    handleEstadoChange,
    abrirModalPedido,
    editarPedido,
    cerrarModalPedido,
    actualizarPedidoCampo,
    handleGuardarPedido,
    handleArchivarPedido,
    handleEliminarPedido,
    mostrarArchivados,
    setMostrarArchivados,
    pedidosFiltrados,
    pedidosActivosCount,
    pedidosArchivadosCount,
    pedidoForm,
    pedidoEditando,
    mostrarModalPedido,
    handleSubmit,
    onSubmit,
    guardando,
    navigate,
    tabActiva,
    setTabActiva,
    handleCrearRubro,
    nuevoRubroTexto,
    setNuevoRubroTexto,
    mostrarInputNuevoRubro,
    setMostrarInputNuevoRubro,
    creandoRubro,
    register,
    watch,
    estadosContratista,
    estadosPedido,
    estadosRegistro,
    rolesPedido,

  } = hook;

  if (isLoading) return <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50"><div className="relative"><h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Obra</h2></div></div>;
  if (isError || !obraData) return <div className="min-h-screen flex items-center justify-center"><div className="text-red-500 text-lg">Error al cargar la obra</div></div>;

  const obraDataForComponents = obraData
    ? {
        ...obraData,
        pedido_cotizacion: obraData.pedidos_cotizacion?.[0]
          ? {
              ...obraData.pedidos_cotizacion[0],
              path_archivo_cotizacion: obraData.pedidos_cotizacion[0].path_archivo_cotizacion || null,
              path_archivo_mano_obra: obraData.pedidos_cotizacion[0].path_archivo_mano_obra || null,
            }
          : null,
        caratula: obraData.detalle_caratula || "",
      }
    : null;

  const renderContenidoSegunEstado = () => {
    if (!obraDataForComponents) return null;
    const estadoDesc = estadosObraDisponibles.find((e) => e.estado_obra_id === estadoObraIdActual)?.descripcion?.toLowerCase() || "";
    if (estadoDesc.includes("pedida") || estadoDesc.includes("cotización"))
        return <PedidoCotizacion obraData={obraDataForComponents} register={register} watch={watch} tabActiva={tabActiva} setTabActiva={setTabActiva} />;
    if (estadoDesc.includes("cotizada"))
        return <Cotizada obraData={obraDataForComponents} register={register} watch={watch} tabActiva={tabActiva} setTabActiva={setTabActiva} />;
    if (estadoDesc.includes("curso"))
        return <EnCurso obraData={obraDataForComponents} register={register} />;
    if (estadoDesc.includes("finalizada"))
        return <Finalizada obraData={obraDataForComponents} register={register} />;
    return null;
    };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="min-h-screen bg-gradient-to-b from-slate-100 via-gray-50 to-white">
          <GestionarHeader
            obraData={obraData}
            estadoObraIdActual={estadoObraIdActual}
            estadosObraDisponibles={estadosObraDisponibles}
            pedidosActivosCount={pedidosActivosCount}
            pedidosArchivadosCount={pedidosArchivadosCount}
            onEstadoChange={handleEstadoChange}
            onVolver={() => navigate('/obras')}
          />

          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-80 lg:shrink-0">
                <FlujoDEstados estadosObraDisponibles={estadosObraDisponibles} estadoObraIdActual={estadoObraIdActual} />
              </div>

              <div className="flex-1 min-w-0 space-y-6">
                <PedidosCompraSection
                  pedidosFiltrados={pedidosFiltrados}
                  mostrarArchivados={mostrarArchivados}
                  setMostrarArchivados={setMostrarArchivados}
                  abrirModalPedido={abrirModalPedido}
                  pedidosActivosCount={pedidosActivosCount}
                  pedidosArchivadosCount={pedidosArchivadosCount}
                  onEditar={editarPedido}
                  onArchivar={handleArchivarPedido}
                  onEliminar={handleEliminarPedido}
                />

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">{renderContenidoSegunEstado()}</div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <button type="button" onClick={() => navigate('/obras')} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
                  <button type="submit" disabled={guardando} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50">{guardando ? 'Guardando...' : 'Guardar Cambios'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {mostrarModalPedido && (
        <ModalPedidoCompra
          pedidoForm={pedidoForm}
          actualizarPedidoCampo={actualizarPedidoCampo}
          onGuardar={handleGuardarPedido}
          onCerrar={cerrarModalPedido}
          gruposDisponibles={gruposDisponibles}
          rubrosDisponibles={rubrosDisponibles}
          pedidoEditando={pedidoEditando}
          mostrarInputNuevoRubro={mostrarInputNuevoRubro}
          setMostrarInputNuevoRubro={setMostrarInputNuevoRubro}
          nuevoRubroTexto={nuevoRubroTexto}
          setNuevoRubroTexto={setNuevoRubroTexto}
          handleCrearRubro={handleCrearRubro}
          creandoRubro={creandoRubro}
          estadosContratista={estadosContratista}
          estadosPedido={estadosPedido}
          rolesPedido={rolesPedido}
          estadosRegistro={estadosRegistro}
        />
      )}
    </>
  );
}
