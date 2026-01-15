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
		</>
	);
}
