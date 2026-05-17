import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { useObraById } from "../../hooks/useObras";
import { useGrupos } from "../../hooks/useGrupos";
import { UpdateObra } from "../../api/obras";
import { fetchEstadosObra } from "../../api/estadosObra";
import { createPedidoCotizacion, updatePedidoCotizacion } from "../../api/pedidosCotizacion";
import { createOrdenCompra, updateOrdenCompra } from "../../api/ordenesCompra";
import { createPedidoCompra, updatePedidoCompra, deletePedidoCompra } from "../../api/pedidosCompra";

const normalizeEstadoDescription = (description) => {
  if (!description) return "Sin definir";
  return description.replace(/_/g, " ").toUpperCase();
};

const ESTADOS_FIJOS = ["debe_pasar", "pasada", ""];
const PEDIDO_FORM_INICIAL = {
  rol_pedido_id: "",
  archivo_presupuesto: null,
  archivo_material: null,
  fecha_pedido: new Date().toISOString().slice(0, 10),
  fecha_entrega_estimada: "",
  estado_contratista_id: "",
  estado_pedido_id: "",
  estado_registro_id: "",
  observaciones: "",
  grupos_ids: [],
  proveedores_ids: [],
  rubros_ids: [],
};

export default function useGestionarObra() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: obraData, isLoading, isError } = useObraById(id);
  const { data: gruposDisponibles = [] } = useGrupos();

  const { data: estadosObraDisponibles = [] } = useQuery({
    queryKey: ["estados-obra"],
    queryFn: fetchEstadosObra,
    refetchOnWindowFocus: false,
  });

  const { data: rubrosDisponibles = [], refetch: refetchRubros } = useQuery({
    queryKey: ["rubros"],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/rubros`);
      return data.rubros;
    },
    refetchOnWindowFocus: false,
  });
  const { data: estadosContratista = [] } = useQuery({
    queryKey: ["estado-contratista"],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/estado-contratista`);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: estadosPedido = [] } = useQuery({
    queryKey: ["estado-pedido"],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/estado-pedido`);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: estadosRegistro = [] } = useQuery({
    queryKey: ["estado-registro"],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/estado-registro`);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: rolesPedido = [] } = useQuery({
    queryKey: ["rol-pedido"],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/rol-pedido`);
      return data;
    },
    refetchOnWindowFocus: false,
  });
  const [tabActiva, setTabActiva] = useState("datos");
  const [estadoObraIdActual, setEstadoObraIdActual] = useState(null);
  const [mostrarModalPedido, setMostrarModalPedido] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);
  const [pedidoForm, setPedidoForm] = useState(PEDIDO_FORM_INICIAL);
  const [guardando, setGuardando] = useState(false);
  const [nuevoRubroTexto, setNuevoRubroTexto] = useState("");
  const [mostrarInputNuevoRubro, setMostrarInputNuevoRubro] = useState(false);
  const [creandoRubro, setCreandoRubro] = useState(false);

  const { register, handleSubmit, watch, setValue, reset } = useForm();

  // Mutations
  const createPedidoCompraMutation = useMutation({
    mutationFn: (formData) => createPedidoCompra(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["obra", id] }),
  });

  const updatePedidoCompraMutation = useMutation({
    mutationFn: ({ pedidoId, formData }) => updatePedidoCompra(pedidoId, formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["obra", id] }),
  });

  const deletePedidoCompraMutation = useMutation({
    mutationFn: (pedidoId) => deletePedidoCompra(pedidoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["obra", id] }),
  });

  useEffect(() => {
    if (obraData) {
      setEstadoObraIdActual(obraData.estado_obra_id);
      const pedidoCot = obraData.pedidos_cotizacion?.[0];
      const descCot = pedidoCot?.estado_cotizacion?.descripcion || "";
      const esFijo = ESTADOS_FIJOS.includes(descCot);

      reset({
        estado_obra_id: obraData.estado_obra_id,
        fecha_cierre_cotizacion: pedidoCot?.fecha_cierre_cotizacion?.split("T")[0] || "",
        estado_cotizacion: esFijo ? descCot : "otro",
        estado_cotizacion_otro: esFijo ? "" : descCot,
        estado_comparativa: pedidoCot?.estado_comparativa?.descripcion || "",
        detalle_caratula: obraData.detalle_caratula || "",
        nro_orden_compra_oc: obraData.orden_compra?.nro_orden_compra || "",
        detalle_oc: obraData.orden_compra?.detalle || "",
        fecha_inicio_oc: obraData.orden_compra?.fecha_inicio_orden_compra?.split("T")[0] || "",
        fecha_fin_oc: obraData.orden_compra?.fecha_fin_orden_compra?.split("T")[0] || "",
        fecha_programacion_inicio: obraData.fecha_programacion_inicio?.split("T")[0] || "",
        fecha_recepcion_provisoria: obraData.fecha_recepcion_provisoria?.split("T")[0] || "",
        fecha_recepcion_definitiva: obraData.fecha_recepcion_definitiva?.split("T")[0] || "",
      });
    }
  }, [obraData, reset]);

  const handleCrearRubro = async () => {
    if (!nuevoRubroTexto.trim()) return;
    setCreandoRubro(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/rubros`, {
        descripcion: nuevoRubroTexto.trim(),
      });
      await refetchRubros();
      actualizarPedidoCampo("rubros_ids", [...pedidoForm.rubros_ids, data.rubro.id]);
      setNuevoRubroTexto("");
      setMostrarInputNuevoRubro(false);
    } catch (err) {
      await Swal.fire({ icon: "error", title: "Error al crear rubro", text: err.response?.data?.message || err.message });
    } finally {
      setCreandoRubro(false);
    }
  };

  const onSubmit = async (data) => {
    setGuardando(true);
    try {
      const archivoCotizacion = data.archivo_cotizacion?.[0] || null;
      const archivoManoObra = data.archivo_mano_obra?.[0] || null;
      const pedidoCotExistente = obraData.pedidos_cotizacion?.[0];
      const obraPayload = {
        estado_obra_id: estadoObraIdActual,
        fecha_visto: new Date().toISOString().split("T")[0],
        detalle_caratula: data.detalle_caratula || null,
        fecha_programacion_inicio: data.fecha_programacion_inicio || null,
        fecha_recepcion_provisoria: data.fecha_recepcion_provisoria || null,
        fecha_recepcion_definitiva: data.fecha_recepcion_definitiva || null,
      };
      await UpdateObra(id, obraPayload);

      const fechaCierreCotizacion = data.fecha_cierre_cotizacion || pedidoCotExistente?.fecha_cierre_cotizacion?.split("T")[0] || "";
      const estadoCotizacion = data.estado_cotizacion || pedidoCotExistente?.estado_cotizacion?.descripcion || "";
      const estadoComparativa = data.estado_comparativa || pedidoCotExistente?.estado_comparativa?.descripcion || "";
      const debeGuardarPedidoCotizacion =
        Boolean(fechaCierreCotizacion && estadoCotizacion) &&
        (Boolean(archivoCotizacion) || Boolean(archivoManoObra) || Boolean(data.fecha_cierre_cotizacion) || Boolean(data.estado_cotizacion) || Boolean(data.estado_comparativa));

      if (debeGuardarPedidoCotizacion) {
        const formData = new FormData();
        formData.append("fecha_cierre_cotizacion", fechaCierreCotizacion);

        if (data.estado_cotizacion === "otro" && data.estado_cotizacion_otro) {
          const { data: res } = await axios.post(`${import.meta.env.VITE_API_URL}/api/estados_cotizacion`, { descripcion: data.estado_cotizacion_otro });
          formData.append("estado_cotizacion_id", res.estado.estado_cotizacion_id);
        } else {
          formData.append("estado_cotizacion", estadoCotizacion);
        }

        formData.append("estado_comparativa", estadoComparativa);
        if (archivoCotizacion) formData.append("archivo_cotizacion", archivoCotizacion);
        if (archivoManoObra) formData.append("archivo_mano_obra", archivoManoObra);

        if (pedidoCotExistente) {
          await updatePedidoCotizacion(id, pedidoCotExistente.pedido_cotizacion_id, formData);
        } else {
          await createPedidoCotizacion(id, formData);
        }
      }

      const estadoActualDesc = estadosObraDisponibles.find((e) => e.estado_obra_id === estadoObraIdActual)?.descripcion?.toLowerCase() || "";
      if (estadoActualDesc.includes("curso") || estadoActualDesc.includes("finalizada")) {
        const ordenExistente = obraData.orden_compra;
        const ordenPayload = {
          nro_orden_compra: data.nro_orden_compra_oc || null,
          detalle: data.detalle_oc || null,
          fecha_inicio_orden_compra: data.fecha_inicio_oc || null,
          fecha_fin_orden_compra: data.fecha_fin_oc || null,
        };
        if (ordenExistente) {
          await updateOrdenCompra(id, ordenExistente.id, ordenPayload);
        } else {
          await createOrdenCompra(id, ordenPayload);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["obra", id] });
      queryClient.invalidateQueries({ queryKey: ["obras"] });
      await Swal.fire({ icon: "success", title: "Guardado", text: "Cambios guardados correctamente" });
    } catch (err) {
      console.error(err);
      await Swal.fire({ icon: "error", title: "Error al guardar", text: err.response?.data?.message || err.message });
    } finally {
      setGuardando(false);
    }
  };

  const handleEstadoChange = async (e) => {
    const nuevoEstadoId = parseInt(e.target.value);
    if (nuevoEstadoId !== estadoObraIdActual) {
      const estadoActualDesc = normalizeEstadoDescription(estadosObraDisponibles.find((e) => e.estado_obra_id === estadoObraIdActual)?.descripcion);
      const nuevoEstadoDesc = normalizeEstadoDescription(estadosObraDisponibles.find((e) => e.estado_obra_id === nuevoEstadoId)?.descripcion);
      const result = await Swal.fire({
        icon: "question",
        title: "Confirmar cambio de estado",
        text: `Esta seguro de cambiar el estado de "${estadoActualDesc}" a "${nuevoEstadoDesc}"?`,
        showCancelButton: true,
        confirmButtonText: "Si, cambiar",
        cancelButtonText: "Cancelar",
      });
      if (result.isConfirmed) {
        setEstadoObraIdActual(nuevoEstadoId);
        setValue("estado_obra_id", nuevoEstadoId);
      }
    }
  };

  // Pedidos handlers
  const abrirModalPedido = () => {
    setPedidoEditando(null);
    setPedidoForm(PEDIDO_FORM_INICIAL);
    setMostrarModalPedido(true);
  };

  const editarPedido = (pedido) => {
    setPedidoEditando(pedido);
    setPedidoForm({
      rol_pedido_id: pedido.rol_pedido_id || "",
      archivo_presupuesto: null,
      archivo_material: null,
      fecha_pedido: pedido.fecha_pedido?.split("T")[0] || "",
      fecha_entrega_estimada: pedido.fecha_entrega_estimada?.split("T")[0] || "",
      estado_contratista_id: pedido.estado_contratista_id || "",
      estado_pedido_id: pedido.estado_pedido_id || "",
      estado_registro_id: pedido.estado_registro_id || "",
      observaciones: pedido.observaciones || "",
      grupos_ids: pedido.grupos?.map((g) => g.grupo_id) || [], 
      proveedores_ids: pedido.proveedores?.map((p) => p.proveedor_id) || [], 
      rubros_ids: pedido.rubros?.map((r) => r.rubro_id) || [], 
    });
    setMostrarModalPedido(true);
  };

  const cerrarModalPedido = () => {
    setMostrarModalPedido(false);
    setPedidoEditando(null);
  };

  const actualizarPedidoCampo = (field, value) => {
    setPedidoForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEliminarPedido = async (pedidoId) => {
    const result = await Swal.fire({ icon: "warning", title: "Eliminar pedido", text: "Esta seguro de eliminar este pedido de compra?", showCancelButton: true, confirmButtonText: "Si, eliminar", cancelButtonText: "Cancelar" });
    if (!result.isConfirmed) return;
    try {
      await deletePedidoCompraMutation.mutateAsync(pedidoId);
    } catch (err) {
      await Swal.fire({ icon: "error", title: "Error al eliminar pedido", text: err.response?.data?.message || err.message });
    }
  };

  const handleArchivarPedido = async (pedido) => {
    const estaArchivado = Boolean(pedido.archivado_at);
    const msg = estaArchivado ? "¿Desarchivar este pedido?" : "¿Archivar este pedido?";
    const result = await Swal.fire({ icon: "question", title: "Confirmar acción", text: msg, showCancelButton: true, confirmButtonText: "Sí, continuar", cancelButtonText: "Cancelar" });
    if (!result.isConfirmed) return;
    try {
      const formData = new FormData();
      formData.append("archivado_at", estaArchivado ? "" : new Date().toISOString().split("T")[0]);
      await updatePedidoCompraMutation.mutateAsync({ pedidoId: pedido.id, formData });
    } catch (err) {
      await Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || err.message });
    }
  };
 
  const handleGuardarPedido = async () => {
    const formData = new FormData();
    formData.append("rol_pedido_id", pedidoForm.rol_pedido_id);
    formData.append("fecha_pedido", pedidoForm.fecha_pedido || new Date().toISOString().slice(0, 10));
    if (pedidoForm.fecha_entrega_estimada) formData.append("fecha_entrega_estimada", pedidoForm.fecha_entrega_estimada);
    if (pedidoForm.estado_contratista_id) formData.append("estado_contratista_id", pedidoForm.estado_contratista_id);
    formData.append("estado_pedido_id", pedidoForm.estado_pedido_id);
    formData.append("estado_registro_id", pedidoForm.estado_registro_id);
    formData.append("observaciones", pedidoForm.observaciones || "");
    if (pedidoForm.archivo_presupuesto) formData.append("archivo", pedidoForm.archivo_presupuesto);
    if (pedidoForm.archivo_material) formData.append("archivo_material", pedidoForm.archivo_material);
    pedidoForm.rubros_ids.forEach((rubroId) => formData.append("rubros_ids[]", rubroId));
    pedidoForm.grupos_ids.forEach((grupoId) => formData.append("grupos_ids[]", grupoId));
    pedidoForm.proveedores_ids.forEach((proveedorId) => formData.append("proveedores_ids[]", proveedorId));

    try {
      if (pedidoEditando) {
        await updatePedidoCompraMutation.mutateAsync({ pedidoId: pedidoEditando.id, formData });
      } else {
        formData.append("nro_obra", id);
        await createPedidoCompraMutation.mutateAsync(formData);
      }
      setMostrarModalPedido(false);
      setPedidoEditando(null);
    } catch (err) {
      await Swal.fire({ icon: "error", title: "Error al guardar pedido", text: err.response?.data?.message || err.message });
    }
  };

  const pedidosCompra = obraData?.pedido_compra || [];
  const pedidosFiltrados = pedidosCompra.filter((p) => (mostrarArchivados ? Boolean(p.archivado_at) : !p.archivado_at));
  const pedidosActivosCount = pedidosCompra.filter((p) => !p.archivado_at).length;
  const pedidosArchivadosCount = pedidosCompra.filter((p) => Boolean(p.archivado_at)).length;

  return {
    id,
    navigate,
    obraData,
    isLoading,
    isError,
    estadosObraDisponibles,
    gruposDisponibles,
    rubrosDisponibles,
    tabActiva,
    setTabActiva,
    estadoObraIdActual,
    setEstadoObraIdActual,
    mostrarModalPedido,
    setMostrarModalPedido,
    pedidoEditando,
    setPedidoEditando,
    mostrarArchivados,
    setMostrarArchivados,
    pedidoForm,
    setPedidoForm,
    guardando,
    nuevoRubroTexto,
    setNuevoRubroTexto,
    mostrarInputNuevoRubro,
    setMostrarInputNuevoRubro,
    creandoRubro,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    abrirModalPedido,
    editarPedido,
    cerrarModalPedido,
    actualizarPedidoCampo,
    handleEliminarPedido,
    handleArchivarPedido,
    handleGuardarPedido,
    handleEstadoChange,
    onSubmit,
    handleCrearRubro,
    pedidosFiltrados,
    pedidosActivosCount,
    pedidosArchivadosCount,
    pedidosCompra,
    normalizeEstadoDescription,
    estadosContratista,
    estadosPedido,
    estadosRegistro,
    rolesPedido,

  };
}
