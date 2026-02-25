import Icon from "../Icons/Icons";

const backendUrl = import.meta.env.VITE_API_URL;

export default function Finalizada({ obraData, register }) {
	const handleDescargar = (nombreArchivo, rutaArchivo) => {
		const link = document.createElement("a");
		link.href = rutaArchivo;
		link.download = nombreArchivo;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleVerPrevia = (rutaArchivo) => {
		window.open(rutaArchivo, "_blank");
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-6">
			<h3 className="text-xl font-semibold text-gray-800 mb-6">Obra Finalizada</h3>

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

			<div className="mb-8">
				<h4 className="text-lg font-medium text-gray-800 mb-4">Grupos</h4>
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

			<div className="space-y-6 mb-8">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Cotizacion</label>
					<div className="space-y-2">
						{obraData.pedido_cotizacion?.path_archivo_cotizacion ? (
							<div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
								<div>
									<p className="text-sm font-medium text-gray-900">
										{obraData.pedido_cotizacion.path_archivo_cotizacion.split("/").pop()}
									</p>
									<p className="text-xs text-gray-500">Archivo de cotizacion</p>
								</div>
								<div className="flex gap-2">
									<button
										type="button"
										onClick={() => handleVerPrevia(`${backendUrl}/storage/${obraData.pedido_cotizacion.path_archivo_cotizacion}`)}
										className="text-blue-600 hover:text-blue-800 p-1"
										title="Ver previsualizacion"
									>
										<Icon name="eye" className="w-5 h-5" />
									</button>
									<button
										type="button"
										onClick={() =>
											handleDescargar(
												obraData.pedido_cotizacion.path_archivo_cotizacion.split("/").pop(),
												`${backendUrl}/storage/${obraData.pedido_cotizacion.path_archivo_cotizacion}`
											)
										}
										className="text-blue-600 hover:text-blue-800 p-1"
										title="Descargar"
									>
										<Icon name="download" className="w-5 h-5" />
									</button>
								</div>
							</div>
						) : (
							<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-500 italic">
								Sin archivo de cotizacion
							</div>
						)}
						<div>
							<label className="block text-xs text-gray-500 mb-1">Reemplazar archivo de cotizacion</label>
							<input
								type="file"
								{...register("archivo_cotizacion")}
								className="w-full px-4 py-2 border border-gray-300 rounded-md"
							/>
						</div>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Mano de obra</label>
					<div className="space-y-2">
						{obraData.pedido_cotizacion?.path_archivo_mano_obra ? (
							<div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
								<div>
									<p className="text-sm font-medium text-gray-900">
										{obraData.pedido_cotizacion.path_archivo_mano_obra.split("/").pop()}
									</p>
									<p className="text-xs text-gray-500">Archivo de mano de obra</p>
								</div>
								<div className="flex gap-2">
									<button
										type="button"
										onClick={() => handleVerPrevia(`${backendUrl}/storage/${obraData.pedido_cotizacion.path_archivo_mano_obra}`)}
										className="text-blue-600 hover:text-blue-800 p-1"
										title="Ver previsualizacion"
									>
										<Icon name="eye" className="w-5 h-5" />
									</button>
									<button
										type="button"
										onClick={() =>
											handleDescargar(
												obraData.pedido_cotizacion.path_archivo_mano_obra.split("/").pop(),
												`${backendUrl}/storage/${obraData.pedido_cotizacion.path_archivo_mano_obra}`
											)
										}
										className="text-blue-600 hover:text-blue-800 p-1"
										title="Descargar"
									>
										<Icon name="download" className="w-5 h-5" />
									</button>
								</div>
							</div>
						) : (
							<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-500 italic">
								Sin archivo de mano de obra
							</div>
						)}
						<div>
							<label className="block text-xs text-gray-500 mb-1">Reemplazar archivo de mano de obra</label>
							<input
								type="file"
								{...register("archivo_mano_obra")}
								className="w-full px-4 py-2 border border-gray-300 rounded-md"
							/>
						</div>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Orden de Compra</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.orden_compra?.detalle || "Sin informacion"}
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Caratula</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.caratula || obraData.detalle_caratula || "Sin informacion"}
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio Orden de Compra</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.orden_compra?.fecha_inicio_orden_compra?.split("T")[0] || "Sin informacion"}
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin Orden de Compra</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.orden_compra?.fecha_fin_orden_compra?.split("T")[0] || "Sin informacion"}
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Programada de Inicio</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.fecha_programacion_inicio?.split("T")[0] || "Sin informacion"}
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Recepcion Provisoria</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.fecha_recepcion_provisoria?.split("T")[0] || "Sin informacion"}
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Recepcion Definitiva</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.fecha_recepcion_definitiva?.split("T")[0] || "Sin informacion"}
					</div>
				</div>
			</div>
		</div>
	);
}
