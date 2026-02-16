import Icon from "../Icons/Icons";

const backendUrl = import.meta.env.VITE_API_URL;

export default function EnCurso({ obraData, register }) {

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
								{grupo.denominacion}
							</div>
						))
					) : (
						<div className="text-gray-500 italic">Sin grupos asignados</div>
					)}
				</div>
			</div>

			{/* Datos de obra en curso */}
			<div className="space-y-6 mb-8">
				{/* Cotización de la obra (archivo del pedido_cotizacion) */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Cotización</label>
					<div className="space-y-2">
						{obraData.pedido_cotizacion?.path_archivo_cotizacion ? (
							<div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
								<div>
									<p className="text-sm font-medium text-gray-900">
										{obraData.pedido_cotizacion.path_archivo_cotizacion.split('/').pop()}
									</p>
									<p className="text-xs text-gray-500">Archivo de cotización</p>
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
						) : (
							<div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-500 italic">
								Sin archivo de cotización
							</div>
						)}
					</div>
				</div>

				{/* Orden de Compra - Detalle */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Orden de Compra - Detalle</label>
					<input
						type="text"
						{...register("detalle_oc")}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					/>
				</div>

				{/* Fecha Inicio OC */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio Orden de Compra</label>
					<input
						type="date"
						{...register("fecha_inicio_oc")}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					/>
				</div>

				{/* Fecha Fin OC */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin Orden de Compra</label>
					<input
						type="date"
						{...register("fecha_fin_oc")}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					/>
				</div>

				{/* Carátula */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Carátula</label>
					<input
						type="text"
						{...register("detalle_caratula")}
						placeholder="Número de carátula"
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					/>
				</div>

				{/* Fecha Programación Inicio */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Programada de Inicio</label>
					<input
						type="date"
						{...register("fecha_programacion_inicio")}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					/>
				</div>

				{/* Fecha Recepción Provisoria (atributo de obra) */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Recepción Provisoria</label>
					<input
						type="date"
						{...register("fecha_recepcion_provisoria")}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					/>
				</div>

				{/* Fecha Recepción Definitiva (atributo de obra) */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Recepción Definitiva</label>
					<input
						type="date"
						{...register("fecha_recepcion_definitiva")}
						className="w-full px-4 py-2 border border-gray-300 rounded-md"
					/>
				</div>
			</div>
		</div>
	);
}
