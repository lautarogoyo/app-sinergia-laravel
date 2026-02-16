import { useState } from "react";
import Icon from "../Icons/Icons";

const backendUrl = import.meta.env.VITE_API_URL;

export default function Cotizada({ obraData, register, watch }) {

	const handleDescargar = (nombreArchivo, rutaArchivo) => {
		const link = document.createElement('a');
		link.href = rutaArchivo;
		link.download = nombreArchivo;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleVerPrevia = (rutaArchivo) => {
		window.open(rutaArchivo, '_blank');
	};

	const estadoCotizacionValue = watch("estado_cotizacion");


	const renderGrupos = () => {
		if (!obraData.grupos || obraData.grupos.length === 0) return "Sin grupos asignados";
		return obraData.grupos.map(grupo => grupo.denominacion).join(", ");
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-6">
			<h3 className="text-xl font-semibold text-gray-800 mb-6">Datos de la Cotización</h3>
			
			{/* Información de la obra */}
			<div className="space-y-6">
				{/* Nro de Obra */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Nro de Obra</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.nro_obra}
					</div>
				</div>

				{/* Detalle */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Detalle</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.detalle}
					</div>
				</div>

				{/* Grupos */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-3">Grupos</label>
					<div className="flex flex-wrap gap-3">
						{obraData.grupos && obraData.grupos.length > 0 ? (
							obraData.grupos.map((grupo) => (
								<div
									key={grupo.id}
									className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold text-sm border-2 border-blue-300"
								>
									{grupo.denominacion}
								</div>
							))
						) : (
							<div className="text-gray-500 italic">Sin grupos asignados</div>
						)}
					</div>
				</div>

				{/* Fecha Cierre Cotización */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Cierre Cotización</label>
					<input
						type="date"
						{...register("fecha_cierre")}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				{/* Estado Cotización */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Estado Cotización</label>
					<select
						{...register("estado_cotizacion")}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Seleccione un estado</option>
						<option value="debe_pasar">Debe pasar</option>
						<option value="pasada">Pasada</option>
						<option value="otro">Otro</option>
					</select>
                    {estadoCotizacionValue === "otro" && (
                                    <input 
                                        type="text" 
                                        placeholder="Especifique otro estado"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
                                    />
                                )}
				</div>

				{/* Estado Comparativa */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Estado Comparativa</label>
					<select
						{...register("estado_comparativa")}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Seleccione un estado</option>
						<option value="hacer_planilla">Hacer Planilla</option>
						<option value="pasado">Pasado</option>
						<option value="no_lleva">No lleva planilla</option>
					</select>
				</div>

				{/* Archivo de Cotización */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Cotización de la Obra</label>
					
					<div className="space-y-2">
						{obraData.pedido_cotizacion?.path_archivo_cotizacion && (
							<div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
								<div className="flex items-center gap-2">
									<div>
										<p className="text-sm font-medium text-gray-900">
											{obraData.pedido_cotizacion.path_archivo_cotizacion.split('/').pop()}
										</p>
										<p className="text-xs text-gray-500">Archivo actual</p>
									</div>
								</div>
								<div className="flex gap-2">
									<button
										type="button"
										onClick={() => handleVerPrevia(`${backendUrl}/storage/${obraData.pedido_cotizacion.path_archivo_cotizacion}`)}
										className="text-blue-600 hover:text-blue-800 p-1"
										title="Ver previsualización"
									>
										<Icon name="eye" className="w-5 h-5" />
									</button>
									<button
										type="button"
										onClick={() => handleDescargar(
											obraData.pedido_cotizacion.path_archivo_cotizacion.split('/').pop(),
											`${backendUrl}/storage/${obraData.pedido_cotizacion.path_archivo_cotizacion}`
										)}
										className="text-blue-600 hover:text-blue-800 p-1"
										title="Descargar"
									>
										<Icon name="download" className="w-5 h-5" />
									</button>
								</div>
							</div>
						)}
						<div>
							<label className="block text-xs text-gray-500 mb-1">Subir nuevo archivo de cotización</label>
							<input
								type="file"
								{...register("archivo_cotizacion")}
								className="w-full px-4 py-2 border border-gray-300 rounded-md"
							/>
						</div>
					</div>
				</div>

				{/* Archivo de Mano de Obra */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Cotización Mano de Obra</label>
					
					<div className="space-y-2">
						{obraData.pedido_cotizacion?.path_archivo_mano_obra && (
							<div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
								<div className="flex items-center gap-2">
									<div>
										<p className="text-sm font-medium text-gray-900">
											{obraData.pedido_cotizacion.path_archivo_mano_obra.split('/').pop()}
										</p>
										<p className="text-xs text-gray-500">Archivo actual</p>
									</div>
								</div>
								<div className="flex gap-2">
									<button
										type="button"
										onClick={() => handleVerPrevia(`${backendUrl}/storage/${obraData.pedido_cotizacion.path_archivo_mano_obra}`)}
										className="text-blue-600 hover:text-blue-800 p-1"
										title="Ver previsualización"
									>
										<Icon name="eye" className="w-5 h-5" />
									</button>
									<button
										type="button"
										onClick={() => handleDescargar(
											obraData.pedido_cotizacion.path_archivo_mano_obra.split('/').pop(),
											`${backendUrl}/storage/${obraData.pedido_cotizacion.path_archivo_mano_obra}`
										)}
										className="text-blue-600 hover:text-blue-800 p-1"
										title="Descargar"
									>
										<Icon name="download" className="w-5 h-5" />
									</button>
								</div>
							</div>
						)}
						<div>
							<label className="block text-xs text-gray-500 mb-1">Subir nuevo archivo de mano de obra</label>
							<input
								type="file"
								{...register("archivo_mano_obra")}
								className="w-full px-4 py-2 border border-gray-300 rounded-md"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
