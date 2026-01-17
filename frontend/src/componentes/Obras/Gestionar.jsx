import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Icon from "../Icons/Icons";
import PedidoCotizacion from "./PedidoCotizacion";
import EnCurso from "./EnCurso";
import Cotizada from "./Cotizada";
import Finalizada from "./Finalizada";

const obraData = {
	"id":1,"nro_obra":1001,"detalle":"comitente SAN CRISTOBAL SANTA FE - Baño accesible + sobretecho planta alta","estado":"Pedida para Cotizar",
    "direccion":"Calle Falsa 123, Ciudad", "fecha_visto" : "2023-01-15","fecha_ingreso":"2023-01-15","fecha_programacion_inicio":"2023-02-01",
    "fecha_recepcion_provisoria":"2024-01-15","fecha_recepcion_definitiva":"2024-06-30",
	"grupos": [
		{id: 1, nombre: "Stizza" },
		{id: 2, nombre: "Parroni"  }
	],
	"archivos": [
		{id: 1, nombre: "Plano planta baja.pdf", tamaño: "1.2 MB"},
		{id: 2, nombre: "Especificaciones iniciales.docx", tamaño: "90 KB"}
	],
	"pedidos_compra": [
		{
			id: 1,
			proveedor: "Proveedor Demo",
			estado: "Pendiente",
			fecha_pedido: "2024-02-01",
			total: "$ 120.000",
		}
	],
    "pedido_cotizacion": {
        "id": 1,
        "path_archivo": "documentos/pedido_cotizacion_1001.pdf",
        "fecha_cierre": "2023-01-31",
        "estado_cotizacion": "debe_pasar",
        "estado_comparativa": "hacer_planilla"
    },
    "caratula": "14-02 -VALERIA",
    "orden_compra": {
        "id": 1,
        "detalle": "4023 Parroni / Mozon / Romero / Vicente",
        "fecha_inicio_oc": "2023-02-01",
        "fecha_fin_oc": "2024-06-30",
    }
};

const estadosFlujo = [
	{id: 1, nombre: "Pedido de cotización", activo: true},
	{id: 2, nombre: "Cotizada", activo: false},
	{id: 3, nombre: "En curso", activo: false},
	{id: 4, nombre: "Finalizada", activo: false}
];

export default function Gestionar() {
	const [tabActiva, setTabActiva] = useState("datos");
	const [isLoading, setLoading] = useState(false);
	const [estadoActual, setEstadoActual] = useState(obraData.estado);
	const [pedidosCompra, setPedidosCompra] = useState(obraData.pedidos_compra || []);
	const [mostrarModalPedido, setMostrarModalPedido] = useState(false);
	const [pedidoForm, setPedidoForm] = useState({
		rol: "cotizar",
		archivo: null,
		fecha_pedido: "",
		fecha_entrega_estimada: "",
		estado_contratista: "Falta Cargar",
		estado_pedido: "pendiente",
		estado_registro: "activo",
		observaciones: "",
		rubros: [
			{ id: 1, nombre: "Rubro demo", proveedoresText: "Proveedor Demo" }
		]
	});
	const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm({
		defaultValues: {
			estado: obraData.estado,
			path_archivo: obraData.pedido_cotizacion.path_archivo,
			fecha_cierre: obraData.pedido_cotizacion.fecha_cierre,
			estado_cotizacion: obraData.pedido_cotizacion.estado_cotizacion,
			estado_comparativa: obraData.pedido_cotizacion.estado_comparativa,
		}
	});

	const onSubmit = (data) => {
		console.log("Datos del formulario:", data);
		// Aquí iría la lógica para enviar los datos al backend
	};

	const handleEstadoChange = (e) => {
		const nuevoEstado = e.target.value;
		if (nuevoEstado !== estadoActual) {
			const confirmar = window.confirm(`¿Está seguro de cambiar el estado de "${estadoActual}" a "${nuevoEstado}"?`);
			if (confirmar) {
				setEstadoActual(nuevoEstado);
				setValue("estado", nuevoEstado);
			} else {
				// Revertir el cambio
				e.target.value = estadoActual;
			}
		}
	};

	const handleActualizarEstadoPedido = (id, nuevoEstado) => {
		setPedidosCompra((prev) => prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)));
	};

	const abrirModalPedido = () => {
		setPedidoForm({
			rol: "cotizar",
			archivo: null,
			fecha_pedido: new Date().toISOString().slice(0, 10),
			fecha_entrega_estimada: "",
			estado_contratista: "Falta Cargar",
			estado_pedido: "pendiente",
			estado_registro: "activo",
			observaciones: "",
			rubros: [
				{ id: Date.now(), nombre: "", proveedoresText: "" }
			]
		});
		setMostrarModalPedido(true);
	};

	const cerrarModalPedido = () => setMostrarModalPedido(false);

	const actualizarPedidoCampo = (field, value) => {
		setPedidoForm((prev) => ({ ...prev, [field]: value }));
	};

	const actualizarArchivo = (file) => {
		setPedidoForm((prev) => ({ ...prev, archivo: file }));
	};

	const agregarRubro = () => {
		setPedidoForm((prev) => ({
			...prev,
			rubros: [...prev.rubros, { id: Date.now(), nombre: "", proveedoresText: "" }]
		}));
	};

	const actualizarRubro = (id, field, value) => {
		setPedidoForm((prev) => ({
			...prev,
			rubros: prev.rubros.map((r) => (r.id === id ? { ...r, [field]: value } : r))
		}));
	};

	const eliminarRubro = (id) => {
		setPedidoForm((prev) => ({
			...prev,
			rubros: prev.rubros.filter((r) => r.id !== id)
		}));
	};

	const handleGuardarPedido = () => {
		const rubrosNormalizados = pedidoForm.rubros.map((r) => ({
			nombre: r.nombre?.trim() || "Sin nombre",
			proveedores: (r.proveedoresText || "")
				.split(",")
				.map((p) => p.trim())
				.filter(Boolean)
		}));

		const nuevo = {
			id: Date.now(),
			rol: pedidoForm.rol,
			archivo_presupuesto: pedidoForm.archivo ? pedidoForm.archivo.name : null,
			fecha_pedido: pedidoForm.fecha_pedido || new Date().toISOString().slice(0, 10),
			fecha_entrega_estimada: pedidoForm.fecha_entrega_estimada || "-",
			estado_contratista: pedidoForm.estado_contratista,
			estado: pedidoForm.estado_pedido,
			estado_registro: pedidoForm.estado_registro,
			observaciones: pedidoForm.observaciones,
			total: "$ -",
			proveedor: rubrosNormalizados[0]?.proveedores?.[0] || "Proveedor sin definir",
			rubros: rubrosNormalizados,
		};

		setPedidosCompra((prev) => [nuevo, ...prev]);
		setMostrarModalPedido(false);
	};

	const estadoCotizacionValue = watch("estado_cotizacion");

	// Renderizar contenido según el estado
	const renderContenidoSegunEstado = () => {
		if (estadoActual === "Pedida para Cotizar") {
			return <Cotizada obraData={obraData} register={register} watch={watch} tabActiva={tabActiva} setTabActiva={setTabActiva} />;
		} else if (estadoActual === "En curso") {
			return <EnCurso obraData={obraData} register={register} />;
		} else if (estadoActual === "Cotizada") {
			return <Cotizada obraData={obraData} register={register} watch={watch} tabActiva={tabActiva} setTabActiva={setTabActiva} />;
		} else if (estadoActual === "Finalizada") {
			return <Finalizada obraData={obraData} />;
		}
	};

	return (
		<>
		{!isLoading &&
		<form onSubmit={handleSubmit(onSubmit)}>
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 px-8 py-6">
				<div className="flex items-center gap-3 mb-4">
					<button 
						onClick={() => window.history.back()}
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
						{...register("estado")}
						onChange={handleEstadoChange}
						className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option>Pedida para Cotizar</option>
						<option>Cotizada</option>
						<option>En curso</option>
						<option>Finalizada</option>
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
							// Determinar si el estado ya fue completado o está activo
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
										{estado.nombre}
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
							<button
								type="button"
								onClick={abrirModalPedido}
								className="flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-200"
							>
								<Icon name="plus" className="w-4 h-4" />
								Nuevo pedido
							</button>
						</div>

						{pedidosCompra.length > 0 ? (
							<div className="space-y-3">
								{pedidosCompra.map((pedido) => (
									<div
										key={pedido.id}
										className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2 bg-gray-50"
									>
										<div className="flex justify-between items-start gap-3">
											<div>
												<p className="text-sm text-gray-600">Proveedor</p>
												<p className="text-base font-semibold text-gray-900">{pedido.proveedor}</p>
											</div>
											<span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">{pedido.estado}</span>
										</div>
										<div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
											<div>
												<p className="text-gray-500">Fecha pedido</p>
												<p className="font-medium">{pedido.fecha_pedido}</p>
											</div>
											<div>
												<p className="text-gray-500">Total</p>
												<p className="font-medium">{pedido.total}</p>
											</div>
										</div>
										<div className="flex gap-2 justify-end">
											<button
												type="button"
												onClick={() => handleActualizarEstadoPedido(pedido.id, "En proceso")}
												className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-200"
											>
												Marcar en proceso
											</button>
											<button
												type="button"
												onClick={() => handleActualizarEstadoPedido(pedido.id, "Recibido")}
												className="px-3 py-1 text-sm rounded border border-green-300 text-green-700 hover:bg-green-50"
											>
												Marcar recibido
											</button>
										</div> 
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-gray-500">No hay pedidos de compra</p>
						)}
					</div>

					{/* Renderizar contenido según estado */}
					{renderContenidoSegunEstado()}

				{/* Botones de acción */}
				<div className="mt-6 flex gap-3 justify-end">
					<button
						type="button"
						onClick={() => window.history.back()}
						className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
					>
						Cancelar
					</button>
					<button
						type="submit"
						className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
					>
						Guardar Cambios
					</button>
				</div>
			</div>
			</div>
		</div>
		</form>
		}

			{/* Modal Nuevo Pedido de compra */}
			{mostrarModalPedido && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
					<div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-2xl font-bold text-gray-900">Nuevo pedido de compra</h3>
							<button onClick={cerrarModalPedido} className="text-gray-500 hover:text-gray-800">
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
								<input
									type="file"
									onChange={(e) => actualizarArchivo(e.target.files?.[0] || null)}
									className="w-full"
								/>
								{pedidoForm.archivo?.name && (
									<p className="text-xs text-gray-600 mt-1">Archivo seleccionado: {pedidoForm.archivo.name}</p>
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

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">Estado (activo/archivado)</label>
								<select
									value={pedidoForm.estado_registro}
									onChange={(e) => actualizarPedidoCampo("estado_registro", e.target.value)}
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								>
									<option value="activo">Activo</option>
									<option value="archivado">Archivado</option>
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

						{/* Rubros y proveedores */}
						<div className="mt-2 space-y-3">
							<div className="flex items-center justify-between">
								<h4 className="text-lg font-semibold text-gray-900">Rubros del pedido</h4>
								<button
									type="button"
									onClick={agregarRubro}
									className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
								>
									Agregar rubro
								</button>
							</div>

							{pedidoForm.rubros.length > 0 ? (
								<div className="space-y-3">
									{pedidoForm.rubros.map((rubro) => (
										<div key={rubro.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
											<div className="flex gap-2">
												<div className="flex-1">
													<label className="block text-xs font-semibold text-gray-700 mb-1">Nombre del rubro</label>
													<input
														type="text"
														value={rubro.nombre}
														onChange={(e) => actualizarRubro(rubro.id, "nombre", e.target.value)}
														className="w-full border border-gray-300 rounded-md px-3 py-2"
													/>
												</div>
												<div className="flex-1">
													<label className="block text-xs font-semibold text-gray-700 mb-1">Proveedores (separados por coma)</label>
													<input
														type="text"
														value={rubro.proveedoresText}
														onChange={(e) => actualizarRubro(rubro.id, "proveedoresText", e.target.value)}
														className="w-full border border-gray-300 rounded-md px-3 py-2"
														placeholder="Ej: Proveedor A, Proveedor B"
													/>
												</div>
											</div>
											<div className="flex justify-end">
												<button
													type="button"
													onClick={() => eliminarRubro(rubro.id)}
													className="text-sm text-red-600 hover:text-red-800"
												>
													Eliminar rubro
												</button>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-gray-500">No hay rubros. Agrega al menos uno.</p>
							)}
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
								className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
							>
								Guardar pedido
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
