import { useState } from "react";
import Icon from "../Icons/Icons";

export default function EnCurso({ obraData, register }) {
	const [archivosLocales, setArchivosLocales] = useState({
		orden_compra: null,
		cotizacion: null
	});

	const handleDescargar = (nombreArchivo, rutaArchivo) => {
		// Crear un link temporal y simular descarga
		const link = document.createElement('a');
		link.href = rutaArchivo;
		link.download = nombreArchivo;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleVerPrevia = (rutaArchivo) => {
		// Abrir en nueva pestaña para ver previsualizacion
		window.open(rutaArchivo, '_blank');
	};

	const handleAgregarArchivo = (tipo) => {
		const input = document.getElementById(`input-${tipo}`);
		input.click();
	};

	const handleArchivoSeleccionado = (tipo, event) => {
		const archivo = event.target.files[0];
		if (archivo) {
			setArchivosLocales(prev => ({
				...prev,
				[tipo]: archivo
			}));
		}
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-6">
			<h3 className="text-xl font-semibold text-gray-800 mb-6">Seguimiento de Obra en Curso</h3>

			{/* Datos generales de la obra */}
			<div className="space-y-6 mb-8">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Nro de Obra</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.nro_obra}
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Detalle</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.detalle}
					</div>
				</div>
			</div>
			
			{/* Información de grupos */}
			<div className="mb-8">
				<h4 className="text-lg font-medium text-gray-800 mb-4">Grupos</h4>
				<div className="flex flex-wrap gap-3">
					{obraData.grupos && obraData.grupos.length > 0 ? (
						obraData.grupos.map((grupo) => (
							<div
								key={grupo.id}
								className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold text-sm border-2 border-blue-300"
							>
								{grupo.nombre}
							</div>
						))
					) : (
						<div className="text-gray-500 italic">Sin grupos asignados</div>
					)}
				</div>
			</div>

			{/* Datos de obra en curso */}
			<div className="space-y-6 mb-8">
                <div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Cotización</label>
					<div className="space-y-2">
						{obraData.pedido_cotizacion?.path_archivo && (
							<div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
								<div className="flex items-center gap-2">
									
                                    <div>
										<p className="text-sm font-medium text-gray-900">
											{obraData.pedido_cotizacion.path_archivo.split('/').pop()}
										</p>
										<p className="text-xs text-gray-500">Archivo actual</p>
									</div>
								</div>
								<div className="flex gap-2">
									<button
										type="button"
										onClick={() => handleVerPrevia(obraData.pedido_cotizacion.path_archivo)}
										className="text-blue-600 hover:text-blue-800 p-1"
										title="Ver previsualizacion"
									>
										<Icon name="eye" className="w-5 h-5" />
									</button>
									<button
										type="button"
										onClick={() => handleDescargar(
											obraData.pedido_cotizacion.path_archivo.split('/').pop(),
											obraData.pedido_cotizacion.path_archivo
										)}
										className="text-blue-600 hover:text-blue-800 p-1"
										title="Descargar"
									>
										<Icon name="download" className="w-5 h-5" />
									</button>
								</div>
							</div>
						)}
						{archivosLocales.cotizacion && (
							<div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
								<div className="flex items-center gap-2">
									<div>
										<p className="text-sm font-medium text-gray-900">{archivosLocales.cotizacion.name}</p>
										<p className="text-xs text-gray-500">Nuevo archivo</p>
									</div>
								</div>
								<button
									type="button"
									onClick={() => setArchivosLocales(prev => ({ ...prev, cotizacion: null }))}
									className="text-red-600 hover:text-red-800"
									title="Remover"
								>
									<Icon name="trash" className="w-5 h-5" />
								</button>
							</div>
						)}
						<button
							type="button"
							onClick={() => handleAgregarArchivo("cotizacion")}
							className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
						>
							<Icon name="plus" className="w-4 h-4" />
							{archivosLocales.cotizacion ? "Cambiar archivo" : "Agregar archivo"}
						</button>
						<input
							id="input-cotizacion"
							type="file"
							className="hidden"
							onChange={(e) => handleArchivoSeleccionado("cotizacion", e)}
						/>
					</div>
				</div>
                <div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Orden de Compra</label>
					<input
						type="text"
						{...(register && register("detalle"))}
						defaultValue={obraData.orden_compra?.detalle || ""}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					/>
				</div>
                <div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Carátula</label>
					<input
						type="text"
						{...(register && register("caratula"))}
						defaultValue={obraData.caratula || ""}
						placeholder="Número de carátula"
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					/>
				</div>
                <div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio Orden de Compra</label>
					<input
						type="date"
						{...(register && register("fecha_inicio_oc"))}
						defaultValue={obraData.orden_compra?.fecha_inicio_oc || ""}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					/>
				</div>
                <div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin Orden de Compra</label>
					<input
						type="date"
						{...(register && register("fecha_fin_oc"))}
						defaultValue={obraData.orden_compra?.fecha_fin_oc || ""}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Programada de Inicio</label>
					<input
						type="date"
						{...(register && register("fecha_programacion_inicio"))}
						defaultValue={obraData.fecha_programacion_inicio || ""}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Recepción Provisoria</label>
					<input
						type="date"
						{...(register && register("fecha_recepcion_provisoria"))}
						defaultValue={obraData.fecha_recepcion_provisoria || ""}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Recepción Definitiva</label>
					<input
						type="date"
						{...(register && register("fecha_recepcion_definitiva"))}
						defaultValue={obraData.fecha_recepcion_definitiva || ""}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					/>
				</div>
				
			</div>
		</div>
	);
}
