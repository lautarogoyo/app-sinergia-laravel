import Icon from "../Icons/Icons";

export default function Finalizada({ obraData }) {
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

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-6">
			<h3 className="text-xl font-semibold text-gray-800 mb-6">Obra Finalizada</h3>

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
								{grupo.denominacion}
							</div>
						))
					) : (
						<div className="text-gray-500 italic">Sin grupos asignados</div>
					)}
				</div>
			</div>

			{/* Datos de obra finalizada */}
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
										<p className="text-xs text-gray-500">Archivo</p>
									</div>
								</div>
								<div className="flex gap-2">
									<button
										type="button"
										onClick={() => handleVerPrevia(obraData.pedido_cotizacion.path_archivo)}
										className="text-blue-600 hover:text-blue-800 p-1"
										title="Ver previsualización"
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
					</div>
				</div>
                <div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Orden de Compra</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.orden_compra?.detalle || "Sin información"}
					</div>
				</div>
                <div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Carátula</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.caratula || obraData.detalle_caratula || "Sin información"}
					</div>
				</div>
                <div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio Orden de Compra</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.orden_compra?.fecha_inicio_orden_compra?.split("T")[0] || "Sin información"}
					</div>
				</div>
                <div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin Orden de Compra</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.orden_compra?.fecha_fin_orden_compra?.split("T")[0] || "Sin información"}
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Programada de Inicio</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.fecha_programacion_inicio?.split("T")[0] || "Sin información"}
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Recepción Provisoria</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.fecha_recepcion_provisoria?.split("T")[0] || "Sin información"}
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Recepción Definitiva</label>
					<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
						{obraData.fecha_recepcion_definitiva?.split("T")[0] || "Sin información"}
					</div>
				</div>
			</div>
		</div>
	);
}
