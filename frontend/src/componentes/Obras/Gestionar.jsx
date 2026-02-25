import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Icon from "../Icons/Icons";
import PedidoCotizacion from "./PedidoCotizacion";
import EnCurso from "./EnCurso";
import Cotizada from "./Cotizada";
import Finalizada from "./Finalizada";
import { useObraById } from "../hooks/useObras";
import { useGrupos } from "../hooks/useGrupos";
import { UpdateObra } from "../api/obras";
import { createPedidoCotizacion, updatePedidoCotizacion } from "../api/pedidosCotizacion";
import { createOrdenCompra, updateOrdenCompra } from "../api/ordenesCompra";
import { createPedidoCompra, updatePedidoCompra, deletePedidoCompra } from "../api/pedidosCompra";

const estadosFlujo = [
	{ id: 1, nombre: "pedida", label: "Pedido de cotización" },
	{ id: 2, nombre: "cotizada", label: "Cotizada" },
	{ id: 3, nombre: "enCurso", label: "En curso" },
	{ id: 4, nombre: "finalizada", label: "Finalizada" }
];

const labelEstado = (estado) => {
	const map = {
		pedida: "Pedido de Cotización",
		cotizada: "Cotizada",
		enCurso: "En Curso",
		finalizada: "Finalizada"
	};
	return map[estado] || estado;
};

const PEDIDO_FORM_INICIAL = {
	rol: "cotizar",
	archivo_presupuesto: null,
	archivo_material: null,
	fecha_pedido: new Date().toISOString().slice(0, 10),
	fecha_entrega_estimada: "",
	estado_contratista: "Falta Cargar",
	estado_pedido: "pendiente",
	estado: "activo",
	observaciones: "",
	grupo_id: "",
	rubros_ids: [],
	proveedores: [""],
};

export default function Gestionar() {
	const { id } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: obraData, isLoading, isError } = useObraById(id);

	const [tabActiva, setTabActiva] = useState("datos");
	const [estadoActual, setEstadoActual] = useState(null);
	const [mostrarModalPedido, setMostrarModalPedido] = useState(false);
	const [pedidoEditando, setPedidoEditando] = useState(null);
	const [mostrarArchivados, setMostrarArchivados] = useState(false);
	const [pedidoForm, setPedidoForm] = useState(PEDIDO_FORM_INICIAL);
	const [guardando, setGuardando] = useState(false);
	const [nuevoRubroTexto, setNuevoRubroTexto] = useState("");
	const [mostrarInputNuevoRubro, setMostrarInputNuevoRubro] = useState(false);
	const [creandoRubro, setCreandoRubro] = useState(false);

	const { register, handleSubmit, watch, setValue, reset } = useForm();

	// --- Data para selects ---
	const { data: gruposDisponibles = [] } = useGrupos();

	const { data: rubrosDisponibles = [], refetch: refetchRubros } = useQuery({
		queryKey: ["rubros"],
		queryFn: async () => {
			const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/rubros`);
			return data.rubros;
		},
		refetchOnWindowFocus: false,
	});

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
			alert("Error al crear el rubro: " + (err.response?.data?.message || err.message));
		} finally {
			setCreandoRubro(false);
		}
	};

	// --- Sincronizar estado cuando llegan los datos de la obra ---
	useEffect(() => {
		if (obraData) {
			setEstadoActual(obraData.estado);
			const pedidoCot = obraData.pedidos_cotizacion?.[0];
			reset({
				estado: obraData.estado,
				fecha_cierre: pedidoCot?.fecha_cierre_cotizacion?.split("T")[0] || "",
				estado_cotizacion: pedidoCot?.estado_cotizacion || "",
				estado_comparativa: pedidoCot?.estado_comparativa || "",
				detalle_caratula: obraData.detalle_caratula || "",
				detalle_oc: obraData.orden_compra?.detalle || "",
				fecha_inicio_oc: obraData.orden_compra?.fecha_inicio_orden_compra?.split("T")[0] || "",
				fecha_fin_oc: obraData.orden_compra?.fecha_fin_orden_compra?.split("T")[0] || "",
				fecha_programacion_inicio: obraData.fecha_programacion_inicio?.split("T")[0] || "",
				fecha_recepcion_provisoria: obraData.fecha_recepcion_provisoria?.split("T")[0] || "",
				fecha_recepcion_definitiva: obraData.fecha_recepcion_definitiva?.split("T")[0] || "",
			});
		}
	}, [obraData, reset]);

	// --- Mutations ---
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

	// --- Handlers obra ---
	const onSubmit = async (data) => {
		setGuardando(true);
		try {
			const archivoCotizacion = data.archivo_cotizacion?.[0] || null;
			const archivoManoObra = data.archivo_mano_obra?.[0] || null;
			const pedidoCotExistente = obraData.pedidos_cotizacion?.[0];

			const obraPayload = {
				estado: estadoActual,
				detalle_caratula: data.detalle_caratula || null,
				fecha_programacion_inicio: data.fecha_programacion_inicio || null,
				fecha_recepcion_provisoria: data.fecha_recepcion_provisoria || null,
				fecha_recepcion_definitiva: data.fecha_recepcion_definitiva || null,
			};
			await UpdateObra(id, obraPayload);

			const fechaCierreCotizacion =
				data.fecha_cierre || pedidoCotExistente?.fecha_cierre_cotizacion?.split("T")[0] || "";
			const estadoCotizacion = data.estado_cotizacion || pedidoCotExistente?.estado_cotizacion || "";
			const estadoComparativa = data.estado_comparativa || pedidoCotExistente?.estado_comparativa || "hacer_planilla";
			const debeGuardarPedidoCotizacion =
				Boolean(fechaCierreCotizacion && estadoCotizacion) &&
				(Boolean(archivoCotizacion) || Boolean(archivoManoObra) || Boolean(data.fecha_cierre) || Boolean(data.estado_cotizacion) || Boolean(data.estado_comparativa));

			if (debeGuardarPedidoCotizacion) {
				const formData = new FormData();
				formData.append("fecha_cierre_cotizacion", fechaCierreCotizacion);
				formData.append("estado_cotizacion", estadoCotizacion);
				formData.append("estado_comparativa", estadoComparativa);
				if (archivoCotizacion) formData.append("archivo_cotizacion", archivoCotizacion);
				if (archivoManoObra) formData.append("archivo_mano_obra", archivoManoObra);

				if (pedidoCotExistente) {
					await updatePedidoCotizacion(id, pedidoCotExistente.id, formData);
				} else {
					await createPedidoCotizacion(id, formData);
				}
			}

			if (estadoActual === "enCurso" || estadoActual === "finalizada") {
				const ordenExistente = obraData.orden_compra;
				const ordenPayload = {
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
			alert("Cambios guardados correctamente");
		} catch (err) {
			console.error(err);
			alert("Error al guardar: " + (err.response?.data?.message || err.message));
		} finally {
			setGuardando(false);
		}
	};

	const handleEstadoChange = (e) => {
		const nuevoEstado = e.target.value;
		if (nuevoEstado !== estadoActual) {
			const confirmar = window.confirm(
				`¿Está seguro de cambiar el estado de "${labelEstado(estadoActual)}" a "${labelEstado(nuevoEstado)}"?`
			);
			if (confirmar) {
				setEstadoActual(nuevoEstado);
				setValue("estado", nuevoEstado);
			} else {
				e.target.value = estadoActual;
			}
		}
	};

	// --- Handlers pedidos de compra ---
	const abrirModalPedido = () => {
		setPedidoEditando(null);
		setPedidoForm(PEDIDO_FORM_INICIAL);
		setMostrarModalPedido(true);
	};

	const editarPedido = (pedido) => {
		setPedidoEditando(pedido);
		setPedidoForm({
			rol: pedido.rol || "cotizar",
			archivo_presupuesto: null,
			archivo_material: null,
			fecha_pedido: pedido.fecha_pedido?.split("T")[0] || "",
			fecha_entrega_estimada: pedido.fecha_entrega_estimada?.split("T")[0] || "",
			estado_contratista: pedido.estado_contratista || "Falta Cargar",
			estado_pedido: pedido.estado_pedido || "pendiente",
			estado: pedido.estado || "activo",
			observaciones: pedido.observaciones || "",
			grupo_id: pedido.grupo_id || "",
			rubros_ids: pedido.rubros?.map((r) => r.id) || [],
			proveedores: pedido.proveedores?.length ? pedido.proveedores : [""],
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
		if (!window.confirm("¿Está seguro de eliminar este pedido de compra?")) return;
		try {
			await deletePedidoCompraMutation.mutateAsync(pedidoId);
		} catch (err) {
			alert("Error al eliminar pedido: " + (err.response?.data?.message || err.message));
		}
	};

	const handleArchivarPedido = async (pedido) => {
		const nuevoEstado = pedido.estado === "archivado" ? "activo" : "archivado";
		const msg = nuevoEstado === "archivado" ? "¿Archivar este pedido de compra?" : "¿Desarchivar este pedido de compra?";
		if (!window.confirm(msg)) return;
		try {
			const formData = new FormData();
			formData.append("estado", nuevoEstado);
			await updatePedidoCompraMutation.mutateAsync({ pedidoId: pedido.id, formData });
		} catch (err) {
			alert("Error al archivar pedido: " + (err.response?.data?.message || err.message));
		}
	};

	const handleGuardarPedido = async () => {
		const formData = new FormData();
		formData.append("rol", pedidoForm.rol);
		formData.append("fecha_pedido", pedidoForm.fecha_pedido || new Date().toISOString().slice(0, 10));
		if (pedidoForm.fecha_entrega_estimada) formData.append("fecha_entrega_estimada", pedidoForm.fecha_entrega_estimada);
		formData.append("estado_contratista", pedidoForm.estado_contratista);
		formData.append("estado_pedido", pedidoForm.estado_pedido);
		formData.append("estado", pedidoForm.estado);
		formData.append("observaciones", pedidoForm.observaciones || "");
		if (pedidoForm.archivo_presupuesto) formData.append("archivo", pedidoForm.archivo_presupuesto);
		if (pedidoForm.archivo_material) formData.append("archivo_material", pedidoForm.archivo_material);

		// Nuevos campos
		if (pedidoForm.grupo_id) formData.append("grupo_id", pedidoForm.grupo_id);
		pedidoForm.rubros_ids.forEach((rubroId) => formData.append("rubros_ids[]", rubroId));
		const proveedoresFiltrados = pedidoForm.proveedores.filter((p) => p.trim() !== "");
		proveedoresFiltrados.forEach((p) => formData.append("proveedores[]", p));

		try {
			if (pedidoEditando) {
				await updatePedidoCompraMutation.mutateAsync({ pedidoId: pedidoEditando.id, formData });
			} else {
				formData.append("obra_id", id);
				await createPedidoCompraMutation.mutateAsync(formData);
			}
			setMostrarModalPedido(false);
			setPedidoEditando(null);
		} catch (err) {
			alert("Error al guardar pedido de compra: " + (err.response?.data?.message || err.message));
		}
	};

	// --- Sub-componentes ---
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
		if (estadoActual === "pedida") {
			return <PedidoCotizacion obraData={obraDataForComponents} register={register} watch={watch} tabActiva={tabActiva} setTabActiva={setTabActiva} />;
		} else if (estadoActual === "cotizada") {
			return <Cotizada obraData={obraDataForComponents} register={register} watch={watch} tabActiva={tabActiva} setTabActiva={setTabActiva} />;
		} else if (estadoActual === "enCurso") {
			return <EnCurso obraData={obraDataForComponents} register={register} />;
		} else if (estadoActual === "finalizada") {
			return <Finalizada obraData={obraDataForComponents} register={register} />;
		}
	};

	const pedidosCompra = obraData?.pedido_compra || [];
	const pedidosFiltrados = pedidosCompra.filter((p) =>
		mostrarArchivados ? p.estado === "archivado" : p.estado !== "archivado"
	);

	// --- Loading / Error ---
	if (isLoading) {
		return (
			<div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
				<div className="relative">
					<div className="mt-8 text-center">
						<h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Obra</h2>
						<div className="w-80 h-3 bg-gray-700 rounded-full overflow-hidden shadow-lg">
							<div className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full animate-loading-bar"></div>
						</div>
						<div className="mt-4 flex justify-center gap-2">
							<span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
							<span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
							<span className="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
						</div>
					</div>
				</div>
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

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="min-h-screen bg-gray-50">

					{/* Header */}
					<div className="bg-white border-b border-gray-200 px-8 py-6">
						<div className="flex items-center gap-3 mb-4">
							<button onClick={() => navigate("/obras")} className="text-gray-600 hover:text-gray-800" type="button">
								<Icon name="arrow-left" className="w-6 h-6" />
							</button>
							<h1 className="text-3xl font-bold text-gray-900">
								Obra #{obraData.nro_obra} – {obraData.detalle}
							</h1>
						</div>
						<div className="mt-4">
							<label className="text-sm font-medium text-gray-700 mr-2">Estado:</label>
							<select
								value={estadoActual || ""}
								onChange={handleEstadoChange}
								className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="pedida">Pedido de Cotización</option>
								<option value="cotizada">Cotizada</option>
								<option value="enCurso">En Curso</option>
								<option value="finalizada">Finalizada</option>
							</select>
						</div>
					</div>

					{/* Contenido principal */}
					<div className="flex">

						{/* Sidebar — Flujo de estados */}
						<div className="w-80 bg-gray-50 border-r border-gray-200 p-6">
							<h3 className="text-lg font-semibold mb-4 text-gray-800">Flujo de estados</h3>
							<div className="space-y-4">
								{estadosFlujo.map((estado, index) => {
									const estadoIndex = estadosFlujo.findIndex((e) => e.nombre === estadoActual);
									const currentIndex = estadosFlujo.findIndex((e) => e.nombre === estado.nombre);
									const isActivo = estado.nombre === estadoActual;
									const isCompletado = currentIndex < estadoIndex;
									return (
										<div key={estado.id} className="flex items-start gap-3">
											<div className="flex flex-col items-center">
												<div className={`w-6 h-6 rounded-full flex items-center justify-center ${
													isActivo ? "bg-blue-600 text-white" : isCompletado ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"
												}`}>
													{isActivo ? "●" : isCompletado ? "✓" : "○"}
												</div>
												{index < estadosFlujo.length - 1 && (
													<div className={`w-0.5 h-8 mt-1 ${isCompletado ? "bg-green-500" : "bg-gray-300"}`}></div>
												)}
											</div>
											<div className={`flex-1 pt-0.5 ${
												isActivo ? "font-medium text-gray-900" : isCompletado ? "text-green-700" : "text-gray-500"
											}`}>
												{estado.label}
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Contenido central */}
						<div className="flex-1 p-8">

							{/* ── Pedidos de compra ── */}
							<div className="mb-8">
								<div className="flex items-center justify-between mb-3">
									<h3 className="text-xl font-semibold text-gray-900">Pedidos de compra</h3>
									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => setMostrarArchivados(!mostrarArchivados)}
											className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md border border-gray-200 ${
												mostrarArchivados ? "bg-blue-100 hover:bg-blue-200 text-blue-700" : "bg-gray-100 hover:bg-gray-200"
											}`}
											title={mostrarArchivados ? "Ocultar archivados" : "Mostrar archivados"}
										>
											<Icon name="archive" className="w-4 h-4" />
										</button>
										<button
											type="button"
											onClick={abrirModalPedido}
											className="flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-200"
										>
											<Icon name="plus" className="w-4 h-4" />
											Nuevo pedido
										</button>
									</div>
								</div>

								{pedidosFiltrados.length > 0 ? (
									<div className="space-y-3">
										{pedidosFiltrados.map((pedido) => (
											<div key={pedido.id} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2 bg-gray-50">

												{/* Cabecera */}
												<div className="flex justify-between items-start gap-3">
													<div>
														<p className="text-sm text-gray-500">Rol</p>
														<p className="text-base font-semibold text-gray-900 uppercase">{pedido.rol}</p>
													</div>
													<div className="flex items-center gap-2">
														<span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700 uppercase">
															{pedido.estado_pedido || pedido.estado}
														</span>
														<button type="button" onClick={() => editarPedido(pedido)} className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" title="Editar">
															<Icon name="pencil" className="w-4 h-4" />
														</button>
														<button type="button" onClick={() => handleArchivarPedido(pedido)} className="p-1 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded" title={pedido.estado === "archivado" ? "Desarchivar" : "Archivar"}>
															<Icon name="archive" className="w-4 h-4" />
														</button>
														<button type="button" onClick={() => handleEliminarPedido(pedido.id)} className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="Eliminar">
															<Icon name="trash" className="w-4 h-4" />
														</button>
													</div>
												</div>

												{/* Fechas */}
												<div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
													<div>
														<p className="text-gray-500">Fecha pedido</p>
														<p className="font-medium">
															{pedido.fecha_pedido ? new Date(pedido.fecha_pedido).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "-"}
														</p>
													</div>
													<div>
														<p className="text-gray-500">Entrega estimada</p>
														<p className="font-medium">
															{pedido.fecha_entrega_estimada ? new Date(pedido.fecha_entrega_estimada).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "-"}
														</p>
													</div>
												</div>

												{/* Contratista */}
												{pedido.grupo && (
													<div className="text-sm">
														<p className="text-gray-500">Contratista</p>
														<span className="inline-block bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded mt-0.5">
															{pedido.grupo.denominacion}
														</span>
													</div>
												)}

												{/* Rubros */}
												{pedido.rubros?.length > 0 && (
													<div className="text-sm">
														<p className="text-gray-500 mb-1">Rubros</p>
														<div className="flex flex-wrap gap-1">
															{pedido.rubros.map((r) => (
																<span key={r.id} className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded border border-blue-100">
																	{r.descripcion}
																</span>
															))}
														</div>
													</div>
												)}

												{/* Proveedores */}
												{pedido.proveedores?.length > 0 && (
													<div className="text-sm">
														<p className="text-gray-500 mb-1">Proveedores</p>
														<div className="flex flex-wrap gap-1">
															{pedido.proveedores.map((prov, idx) => (
																<span key={idx} className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded border border-green-100">
																	{prov}
																</span>
															))}
														</div>
													</div>
												)}

												{/* Archivos */}
												{pedido.path_presupuesto && (
													<div className="text-sm">
														<p className="text-gray-500">Presupuesto</p>
														<a href={`${import.meta.env.VITE_API_URL}/storage/${pedido.path_presupuesto}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
															📎 {pedido.path_presupuesto.split("/").pop()}
														</a>
													</div>
												)}
												{pedido.path_material && (
													<div className="text-sm">
														<p className="text-gray-500">Material</p>
														<a href={`${import.meta.env.VITE_API_URL}/storage/${pedido.path_material}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
															📎 {pedido.path_material.split("/").pop()}
														</a>
													</div>
												)}

												{/* Observaciones */}
												{pedido.observaciones && (
													<div className="text-sm">
														<p className="text-gray-500">Observaciones</p>
														<p className="text-gray-700">{pedido.observaciones}</p>
													</div>
												)}
											</div>
										))}
									</div>
								) : (
									<p className="text-sm text-gray-500">
										{mostrarArchivados ? "No hay pedidos archivados" : "No hay pedidos de compra activos"}
									</p>
								)}
							</div>

							{/* Contenido según estado */}
							{renderContenidoSegunEstado()}

							{/* Botones */}
							<div className="mt-6 flex gap-3 justify-end">
								<button type="button" onClick={() => navigate("/obras")} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
									Cancelar
								</button>
								<button type="submit" disabled={guardando} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50">
									{guardando ? "Guardando..." : "Guardar Cambios"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</form>

			{/* ── Modal Pedido de compra ── */}
			{mostrarModalPedido && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={cerrarModalPedido}></div>
					<div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-4">

						{/* Header */}
						<div className="flex items-center justify-between">
							<h3 className="text-2xl font-bold text-gray-900">
								{pedidoEditando ? "Editar pedido de compra" : "Nuevo pedido de compra"}
							</h3>
							<button type="button" onClick={cerrarModalPedido} className="text-gray-500 hover:text-gray-800">
								<Icon name="x" className="w-6 h-6" />
							</button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

							{/* Rol */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Rol del pedido</label>
								<select value={pedidoForm.rol} onChange={(e) => actualizarPedidoCampo("rol", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
									<option value="cotizar">Cotizar</option>
									<option value="comprar">Comprar</option>
								</select>
							</div>

							{/* Contratista */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Contratista</label>
								<select value={pedidoForm.grupo_id} onChange={(e) => actualizarPedidoCampo("grupo_id", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
									<option value="">— Sin asignar —</option>
									{gruposDisponibles.map((g) => (
										<option key={g.id} value={g.id}>{g.denominacion}</option>
									))}
								</select>
							</div>

							{/* Archivo presupuesto */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Archivo de presupuesto</label>
								{pedidoEditando?.path_presupuesto && (
									<div className="mb-1">
										<a href={`${import.meta.env.VITE_API_URL}/storage/${pedidoEditando.path_presupuesto}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
											📎 {pedidoEditando.path_presupuesto.split("/").pop()}
										</a>
									</div>
								)}
								<input type="file" onChange={(e) => actualizarPedidoCampo("archivo_presupuesto", e.target.files?.[0] || null)} className="w-full text-sm" />
								{pedidoForm.archivo_presupuesto?.name && (
									<p className="text-xs text-gray-500 mt-1">Nuevo: {pedidoForm.archivo_presupuesto.name}</p>
								)}
							</div>

							{/* Archivo material */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Archivo de material</label>
								{pedidoEditando?.path_material && (
									<div className="mb-1">
										<a href={`${import.meta.env.VITE_API_URL}/storage/${pedidoEditando.path_material}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
											📎 {pedidoEditando.path_material.split("/").pop()}
										</a>
									</div>
								)}
								<input type="file" onChange={(e) => actualizarPedidoCampo("archivo_material", e.target.files?.[0] || null)} className="w-full text-sm" />
								{pedidoForm.archivo_material?.name && (
									<p className="text-xs text-gray-500 mt-1">Nuevo: {pedidoForm.archivo_material.name}</p>
								)}
							</div>

							{/* Fecha pedido */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Fecha del pedido</label>
								<input type="date" value={pedidoForm.fecha_pedido} onChange={(e) => actualizarPedidoCampo("fecha_pedido", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
							</div>

							{/* Fecha entrega */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Fecha entrega estimada</label>
								<input type="date" value={pedidoForm.fecha_entrega_estimada} onChange={(e) => actualizarPedidoCampo("fecha_entrega_estimada", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
							</div>

							{/* Estado contratista */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Estado del contratista</label>
								<select value={pedidoForm.estado_contratista} onChange={(e) => actualizarPedidoCampo("estado_contratista", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
									<option value="Falta Cargar">Falta Cargar</option>
									<option value="Solicitado">Solicitado</option>
									<option value="Entregado">Entregado</option>
								</select>
							</div>

							{/* Estado pedido */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Estado del pedido</label>
								<select value={pedidoForm.estado_pedido} onChange={(e) => actualizarPedidoCampo("estado_pedido", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
									<option value="pendiente">Pendiente</option>
									<option value="pedido">Pedido</option>
								</select>
							</div>

							{/* Observaciones */}
							<div className="md:col-span-2">
								<label className="block text-sm font-semibold text-gray-700 mb-1">Observaciones</label>
								<textarea value={pedidoForm.observaciones} onChange={(e) => actualizarPedidoCampo("observaciones", e.target.value)} rows={2} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
							</div>

							{/* Rubros */}
							<div className="md:col-span-2">
								<div className="flex items-center justify-between mb-1">
									<label className="block text-sm font-semibold text-gray-700">
										Rubros <span className="text-xs font-normal text-gray-400">(seleccioná uno o más)</span>
									</label>
									<button
										type="button"
										onClick={() => { setMostrarInputNuevoRubro(!mostrarInputNuevoRubro); setNuevoRubroTexto(""); }}
										className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
									>
										{mostrarInputNuevoRubro ? "Cancelar" : "+ Nuevo rubro"}
									</button>
								</div>

								{/* Input para crear nuevo rubro */}
								{mostrarInputNuevoRubro && (
									<div className="flex gap-2 mb-2">
										<input
											type="text"
											value={nuevoRubroTexto}
											onChange={(e) => setNuevoRubroTexto(e.target.value)}
											onKeyDown={(e) => e.key === "Enter" && handleCrearRubro()}
											placeholder="Nombre del nuevo rubro..."
											className="flex-1 border border-blue-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
											autoFocus
										/>
										<button
											type="button"
											onClick={handleCrearRubro}
											disabled={creandoRubro || !nuevoRubroTexto.trim()}
											className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
										>
											{creandoRubro ? "Creando..." : "Crear y agregar"}
										</button>
									</div>
								)}

								{/* Lista de rubros existentes */}
								<div className="border border-gray-300 rounded-md p-3 max-h-36 overflow-y-auto space-y-1 bg-gray-50">
									{rubrosDisponibles.length === 0 ? (
										<p className="text-sm text-gray-400">No hay rubros. Creá uno nuevo arriba.</p>
									) : (
										rubrosDisponibles.map((rubro) => (
											<label key={rubro.id} className="flex items-center gap-2 cursor-pointer hover:bg-white px-2 py-1 rounded transition-colors">
												<input
													type="checkbox"
													checked={pedidoForm.rubros_ids.includes(rubro.id)}
													onChange={(e) => {
														const ids = e.target.checked
															? [...pedidoForm.rubros_ids, rubro.id]
															: pedidoForm.rubros_ids.filter((rid) => rid !== rubro.id);
														actualizarPedidoCampo("rubros_ids", ids);
													}}
													className="rounded accent-blue-600"
												/>
												<span className="text-sm text-gray-700">{rubro.descripcion}</span>
											</label>
										))
									)}
								</div>
							</div>

							{/* Proveedores — texto libre */}
							<div className="md:col-span-2">
								<div className="flex items-center justify-between mb-1">
									<label className="block text-sm font-semibold text-gray-700">
										Proveedores <span className="text-xs font-normal text-gray-400">(uno o más)</span>
									</label>
									<button
										type="button"
										onClick={() => actualizarPedidoCampo("proveedores", [...pedidoForm.proveedores, ""])}
										className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
									>
										+ Agregar proveedor
									</button>
								</div>
								<div className="space-y-2">
									{pedidoForm.proveedores.map((prov, idx) => (
										<div key={idx} className="flex gap-2 items-center">
											<input
												type="text"
												value={prov}
												onChange={(e) => {
													const nueva = [...pedidoForm.proveedores];
													nueva[idx] = e.target.value;
													actualizarPedidoCampo("proveedores", nueva);
												}}
												placeholder={`Proveedor ${idx + 1}`}
												className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
											/>
											{pedidoForm.proveedores.length > 1 && (
												<button
													type="button"
													onClick={() => actualizarPedidoCampo("proveedores", pedidoForm.proveedores.filter((_, i) => i !== idx))}
													className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
												>
													<Icon name="x" className="w-4 h-4" />
												</button>
											)}
										</div>
									))}
								</div>
							</div>

						</div>

						{/* Botones modal */}
						<div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
							<button type="button" onClick={cerrarModalPedido} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm font-medium">
								Cancelar
							</button>
							<button
								type="button"
								onClick={handleGuardarPedido}
								disabled={createPedidoCompraMutation.isPending || updatePedidoCompraMutation.isPending}
								className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
							>
								{(createPedidoCompraMutation.isPending || updatePedidoCompraMutation.isPending)
									? "Guardando..."
									: pedidoEditando ? "Actualizar pedido" : "Guardar pedido"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
