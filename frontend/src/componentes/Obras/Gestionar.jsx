import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Icon from "../Icons/Icons";
import PedidoCotizacion from "./PedidoCotizacion";
import EnCurso from "./EnCurso";
import Cotizada from "./Cotizada";
import Finalizada from "./Finalizada";
import { useObraById } from "../hooks/useObras";
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

export default function Gestionar() {
	const { id } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: obraData, isLoading, isError } = useObraById(id);

	const [tabActiva, setTabActiva] = useState("datos");
	const [estadoActual, setEstadoActual] = useState(null);
	const [mostrarModalPedido, setMostrarModalPedido] = useState(false);
	const [pedidoEditando, setPedidoEditando] = useState(null); // null = nuevo, objeto = editando
	const [mostrarArchivados, setMostrarArchivados] = useState(false);
	const [pedidoForm, setPedidoForm] = useState({
		rol: "cotizar",
		archivo_presupuesto: null,
		fecha_pedido: "",
		fecha_entrega_estimada: "",
		estado_contratista: "Falta Cargar",
		estado_pedido: "pendiente",
		estado: "activo",
		observaciones: "",
	});

	const { register, handleSubmit, watch, setValue, reset } = useForm();

	// Sincronizar estado cuando llegan los datos de la obra
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

	const [guardando, setGuardando] = useState(false);

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

	// --- Handlers ---
	const onSubmit = async (data) => {
		setGuardando(true);
		try {
			// Capturar archivos ANTES de cualquier mutación (el reset por invalidación los borra)
			const archivoCotizacion = data.archivo_cotizacion?.[0] || null;
			const archivoManoObra = data.archivo_mano_obra?.[0] || null;

			// 1) Actualizar datos de la obra (sin invalidar queries aún)
			const obraPayload = {
				estado: estadoActual,
				detalle_caratula: data.detalle_caratula || null,
				fecha_programacion_inicio: data.fecha_programacion_inicio || null,
				fecha_recepcion_provisoria: data.fecha_recepcion_provisoria || null,
				fecha_recepcion_definitiva: data.fecha_recepcion_definitiva || null,
			};
			await UpdateObra(id, obraPayload);

			// 2) Guardar/actualizar pedido de cotización si hay datos
			if (data.estado_cotizacion && data.fecha_cierre) {
				const pedidoCot = obraData.pedidos_cotizacion?.[0];
				const formData = new FormData();
				formData.append("fecha_cierre_cotizacion", data.fecha_cierre);
				formData.append("estado_cotizacion", data.estado_cotizacion);
				formData.append("estado_comparativa", data.estado_comparativa || "hacer_planilla");

				// Adjuntar archivo de cotización si se seleccionó uno nuevo
				if (archivoCotizacion) {
					formData.append("archivo_cotizacion", archivoCotizacion);
				}

				// Adjuntar archivo de mano de obra si se seleccionó uno nuevo
				if (archivoManoObra) {
					formData.append("archivo_mano_obra", archivoManoObra);
				}

				if (pedidoCot) {
					await updatePedidoCotizacion(id, pedidoCot.id, formData);
				} else {
					await createPedidoCotizacion(id, formData);
				}
			}

			// 3) Guardar/actualizar orden de compra si estamos en curso o finalizada
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

			// Invalidar queries al final, después de todas las operaciones
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

	const abrirModalPedido = () => {
		setPedidoEditando(null);
		setPedidoForm({
			rol: "cotizar",
			archivo_presupuesto: null,
			archivo_material: null,
			fecha_pedido: new Date().toISOString().slice(0, 10),
			fecha_entrega_estimada: "",
			estado_contratista: "Falta Cargar",
			estado_pedido: "pendiente",
			estado: "activo",
			observaciones: "",
		});
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
		});
		setMostrarModalPedido(true);
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

	const cerrarModalPedido = () => {
		setMostrarModalPedido(false);
		setPedidoEditando(null);
	};

	const actualizarPedidoCampo = (field, value) => {
		setPedidoForm((prev) => ({ ...prev, [field]: value }));
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
		if (pedidoForm.archivo_presupuesto) {
			formData.append("archivo", pedidoForm.archivo_presupuesto);
		}
		if (pedidoForm.archivo_material) {
			formData.append("archivo_material", pedidoForm.archivo_material);
		}

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

	// Preparar obraData compatible con sub-componentes
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

	// Renderizar contenido según el estado
	const renderContenidoSegunEstado = () => {
		if (!obraDataForComponents) return null;

		if (estadoActual === "pedida") {
			return (
				<PedidoCotizacion
					obraData={obraDataForComponents}
					register={register}
					watch={watch}
					tabActiva={tabActiva}
					setTabActiva={setTabActiva}
				/>
			);
		} else if (estadoActual === "cotizada") {
			return (
				<Cotizada
					obraData={obraDataForComponents}
					register={register}
					watch={watch}
					tabActiva={tabActiva}
					setTabActiva={setTabActiva}
				/>
			);
		} else if (estadoActual === "enCurso") {
			return <EnCurso obraData={obraDataForComponents} register={register} />;
		} else if (estadoActual === "finalizada") {
			return <Finalizada obraData={obraDataForComponents} />;
		}
	};

	const pedidosCompra = obraData?.pedido_compra || [];

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-gray-500 text-lg">Cargando obra...</div>
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
					<button 
						onClick={() => navigate("/obras")}
						className="text-gray-600 hover:text-gray-800"
						type="button"
					>
						<Icon name="arrow-left" className="w-6 h-6" />
					</button>
					<h1 className="text-3xl font-bold text-gray-900">
						Obra #{obraData.nro_obra} – {obraData.detalle}
					</h1>
				</div>
				
				{/* Selector de estado */}
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
				{/* Sidebar izquierda - Flujo de estados */}
				<div className="w-80 bg-gray-50 border-r border-gray-200 p-6">
					<h3 className="text-lg font-semibold mb-4 text-gray-800">Flujo de estados</h3>
					<div className="space-y-4">
						{estadosFlujo.map((estado, index) => {
							const estadoIndex = estadosFlujo.findIndex(e => e.nombre === estadoActual);
							const currentIndex = estadosFlujo.findIndex(e => e.nombre === estado.nombre);
							const isActivo = estado.nombre === estadoActual;
							const isCompletado = currentIndex < estadoIndex;
							
							return (
								<div key={estado.id} className="flex items-start gap-3">
									<div className="flex flex-col items-center">
										<div className={`w-6 h-6 rounded-full flex items-center justify-center ${
											isActivo
												? 'bg-blue-600 text-white' 
												: isCompletado
												? 'bg-green-500 text-white'
												: 'bg-gray-300 text-gray-500'
										}`}>
											{isActivo ? '●' : isCompletado ? '✓' : '○'}
										</div>
										{index < estadosFlujo.length - 1 && (
											<div className={`w-0.5 h-8 mt-1 ${
												isCompletado ? 'bg-green-500' : 'bg-gray-300'
											}`}></div>
										)}
									</div>
									<div className={`flex-1 pt-0.5 ${
										isActivo ? 'font-medium text-gray-900' : 
										isCompletado ? 'text-green-700' : 
										'text-gray-500'
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
					{/* Pedidos de compra */}
					<div className="mb-8">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-xl font-semibold text-gray-900">Pedidos de compra</h3>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setMostrarArchivados(!mostrarArchivados)}
								className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md border border-gray-200 ${
									mostrarArchivados 
										? 'bg-blue-100 hover:bg-blue-200 text-blue-700' 
										: 'bg-gray-100 hover:bg-gray-200'
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

					{pedidosCompra.filter(p => mostrarArchivados ? p.estado === "archivado" : p.estado !== "archivado").length > 0 ? (
							<div className="space-y-3">
							{pedidosCompra.filter(p => mostrarArchivados ? p.estado === "archivado" : p.estado !== "archivado").map((pedido) => (
									<div
										key={pedido.id}
										className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2 bg-gray-50"
									>
										<div className="flex justify-between items-start gap-3">
											<div>
												<p className="text-sm text-gray-600">Rol</p>
												<p className="text-base font-semibold text-gray-900 uppercase">{pedido.rol}</p>
											</div>
											<div className="flex items-center gap-2">
												<span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700 uppercase">
													{pedido.estado_pedido || pedido.estado}
												</span>
												<button
													type="button"
													onClick={() => editarPedido(pedido)}
													className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
													title="Editar pedido"
												>
													<Icon name="pencil" className="w-4 h-4" />
												</button>
												<button
													type="button"
													onClick={() => handleArchivarPedido(pedido)}
													className="p-1 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded"
													title={pedido.estado === "archivado" ? "Desarchivar pedido" : "Archivar pedido"}
												>
													<Icon name="archive" className="w-4 h-4" />
												</button>
												<button
													type="button"
													onClick={() => handleEliminarPedido(pedido.id)}
													className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
													title="Eliminar pedido"
												>
													<Icon name="trash" className="w-4 h-4" />
												</button>
											</div>
										</div>
										<div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
											<div>
												<p className="text-gray-500">Fecha pedido</p>
												<p className="font-medium">{pedido.fecha_pedido ? new Date(pedido.fecha_pedido).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "-"}</p>
											</div>
											<div>
												<p className="text-gray-500">Entrega estimada</p>
												<p className="font-medium">{pedido.fecha_entrega_estimada ? new Date(pedido.fecha_entrega_estimada).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "-"}</p>
											</div>
										</div>
										{pedido.path_presupuesto && (
											<div className="text-sm">
												<p className="text-gray-500">Presupuesto</p>
												<a
													href={`${import.meta.env.VITE_API_URL}/storage/${pedido.path_presupuesto}`}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-600 hover:underline"
												>
													📎 {pedido.path_presupuesto.split("/").pop()}
												</a>
											</div>
										)}
										{pedido.path_material && (
											<div className="text-sm">
												<p className="text-gray-500">Material</p>
												<a
													href={`${import.meta.env.VITE_API_URL}/storage/${pedido.path_material}`}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-600 hover:underline"
												>
													📎 {pedido.path_material.split("/").pop()}
												</a>
											</div>
										)}
										{pedido.observaciones && (
											<div className="text-sm text-gray-600">
												<p className="text-gray-500">Observaciones</p>
												<p>{pedido.observaciones}</p>
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-gray-500">{mostrarArchivados ? "No hay pedidos archivados" : "No hay pedidos de compra activos"}</p>
						)}
					</div>

					{/* Renderizar contenido según estado */}
					{renderContenidoSegunEstado()}

				{/* Botones de acción */}
				<div className="mt-6 flex gap-3 justify-end">
					<button
						type="button"
						onClick={() => navigate("/obras")}
						className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
					>
						Cancelar
					</button>
					<button
						type="submit"
						disabled={guardando}
						className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
					>
						{guardando ? "Guardando..." : "Guardar Cambios"}
					</button>
				</div>
			</div>
			</div>
		</div>
		</form>

			{/* Modal Nuevo Pedido de compra */}
			{mostrarModalPedido && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
					<div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-2xl font-bold text-gray-900">{pedidoEditando ? "Editar pedido de compra" : "Nuevo pedido de compra"}</h3>
							<button type="button" onClick={cerrarModalPedido} className="text-gray-500 hover:text-gray-800">
								<Icon name="x" className="w-6 h-6" />
							</button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Rol del pedido</label>
								<select
									value={pedidoForm.rol}
									onChange={(e) => actualizarPedidoCampo("rol", e.target.value)}
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								>
									<option value="cotizar">Cotizar</option>
									<option value="comprar">Comprar</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Archivo de presupuesto</label>
									{pedidoEditando?.path_presupuesto && (
										<div className="mb-1">
											<a
												href={`${import.meta.env.VITE_API_URL}/storage/${pedidoEditando.path_presupuesto}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-blue-600 hover:underline"
											>
												📎 {pedidoEditando.path_presupuesto.split("/").pop()}
											</a>
										</div>
									)}
									<input
										type="file"
										onChange={(e) => actualizarPedidoCampo("archivo_presupuesto", e.target.files?.[0] || null)}
										className="w-full"
									/>
									{pedidoForm.archivo_presupuesto?.name && (
										<p className="text-xs text-gray-600 mt-1">Nuevo archivo: {pedidoForm.archivo_presupuesto.name}</p>
									)}
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Archivo de material</label>
									{pedidoEditando?.path_material && (
										<div className="mb-1">
											<a
												href={`${import.meta.env.VITE_API_URL}/storage/${pedidoEditando.path_material}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-blue-600 hover:underline"
											>
												📎 {pedidoEditando.path_material.split("/").pop()}
											</a>
										</div>
									)}
									<input
										type="file"
										onChange={(e) => actualizarPedidoCampo("archivo_material", e.target.files?.[0] || null)}
										className="w-full"
									/>
									{pedidoForm.archivo_material?.name && (
										<p className="text-xs text-gray-600 mt-1">Nuevo archivo: {pedidoForm.archivo_material.name}</p>
									)}
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Fecha del pedido</label>
								<input
									type="date"
									value={pedidoForm.fecha_pedido}
									onChange={(e) => actualizarPedidoCampo("fecha_pedido", e.target.value)}
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Fecha entrega estimada</label>
								<input
									type="date"
									value={pedidoForm.fecha_entrega_estimada}
									onChange={(e) => actualizarPedidoCampo("fecha_entrega_estimada", e.target.value)}
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Estado del contratista</label>
								<select
									value={pedidoForm.estado_contratista}
									onChange={(e) => actualizarPedidoCampo("estado_contratista", e.target.value)}
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								>
									<option>Falta Cargar</option>
									<option>Solicitado</option>
									<option>Entregado</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Estado del pedido</label>
								<select
									value={pedidoForm.estado_pedido}
									onChange={(e) => actualizarPedidoCampo("estado_pedido", e.target.value)}
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								>
									<option value="pendiente">Pendiente</option>
									<option value="pedido">Pedido</option>
								</select>
							</div>

							<div className="md:col-span-2">
								<label className="block text-sm font-semibold text-gray-700 mb-1">Observaciones</label>
								<textarea
									value={pedidoForm.observaciones}
									onChange={(e) => actualizarPedidoCampo("observaciones", e.target.value)}
									rows={2}
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								/>
							</div>
						</div>

						<div className="flex justify-end gap-3 pt-2">
							<button
								type="button"
								onClick={cerrarModalPedido}
								className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
							>
								Cancelar
							</button>
							<button
								type="button"
								onClick={handleGuardarPedido}
								disabled={createPedidoCompraMutation.isPending || updatePedidoCompraMutation.isPending}
								className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
							>
								{(createPedidoCompraMutation.isPending || updatePedidoCompraMutation.isPending) ? "Guardando..." : pedidoEditando ? "Actualizar pedido" : "Guardar pedido"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
