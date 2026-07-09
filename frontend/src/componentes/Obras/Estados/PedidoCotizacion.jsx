import Icon from "../../Icons/Icons";

const backendUrl = import.meta.env.VITE_API_URL;

export default function PedidoCotizacion({ obraData, register, watch }) {
    const ESTADOS_FIJOS = ["debe_pasar", "pasada", ""];
	const estadoCotizacionValue = watch("estado_cotizacion");
    const esOtro = estadoCotizacionValue === "otro" ||
        (estadoCotizacionValue && !ESTADOS_FIJOS.includes(estadoCotizacionValue));

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
		<>
                <div>
                    <div className="mb-8">
                        <h4 className="text-lg font-medium text-gray-800 mb-4">Grupos</h4>
                        <div className="flex flex-wrap gap-3">
                            {obraData.grupos && obraData.grupos.length > 0 ? (
                                obraData.grupos.map((grupo) => (
                                    <div
                                        key={grupo.grupo_id}
                                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold text-sm border-2 border-blue-300"
                                    >
                                        {grupo.nombre_apellido}
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 italic">Sin grupos asignados</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Archivo de cotización</label>
                                <div className="space-y-2">
                                    {obraData.pedido_cotizacion?.path_archivo ? (
                                        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {obraData.pedido_cotizacion.path_archivo.split("/").pop()}
                                                </p>
                                                <p className="text-xs text-gray-500">Archivo de cotizacion</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleVerPrevia(`${backendUrl}/storage/${obraData.pedido_cotizacion.path_archivo}`)}
                                                    className="text-blue-600 hover:text-blue-800 p-1"
                                                    title="Ver previsualizacion"
                                                >
                                                    <Icon name="eye" className="w-7 h-7 cursor-pointer" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDescargar(
                                                            obraData.pedido_cotizacion.path_archivo.split("/").pop(),
                                                            `${backendUrl}/storage/${obraData.pedido_cotizacion.path_archivo}`
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 p-1"
                                                    title="Descargar"
                                                >
                                                    <Icon name="download"  className="w-7 h-7 cursor-pointer" />
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Archivo de mano de obra</label>
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
                                                    <Icon name="eye" className="w-7 h-7 cursor-pointer" />
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
                                                    <Icon name="download" className="w-7 h-7 cursor-pointer" />
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Cierre Cotizacion</label>
                                <input
                                    type="date"
                                    {...register("fecha_cierre_cotizacion")}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estado de cotizacion</label>
                                <select
                                    {...register("estado_cotizacion")}
                                    className="w-48 px-4 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Seleccione un estado</option>
                                    <option value="debe_pasar">Debe pasar</option>
                                    <option value="pasada">Pasada</option>
                                    <option value="otro">Otro</option>
                                </select>
                                {esOtro && (
                                    <input
                                        type="text"
                                        {...register("estado_cotizacion_otro")}
                                        placeholder="Especifique otro estado"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
                                    />
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Estado comparativa</label>
                            <select
                                {...register("estado_comparativa")}
                                className="w-48 px-4 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Seleccione un estado</option>
                                <option value="hacer_planilla">Hacer planilla</option>
                                <option value="pasado">Pasado</option>
                                <option value="no_lleva_planilla">No lleva planilla</option>
                            </select>
                        </div>
                    </div>
                </div>
		</>
	);
}