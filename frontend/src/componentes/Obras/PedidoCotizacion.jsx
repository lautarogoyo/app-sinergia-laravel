import { useForm } from "react-hook-form";
import Icon from "../Icons/Icons";

export default function PedidoCotizacion({ obraData, register, watch, tabActiva, setTabActiva }) {
	const estadoCotizacionValue = watch("estado_cotizacion");

	return (
		<>
        
			{/* Tabs para Pedido de Cotización */}
			<div className="border-b border-gray-200 mb-6">
				<nav className="flex gap-8">
					<button
						type="button"
						onClick={() => setTabActiva("datos")}
						className={`pb-3 px-1 font-medium transition-colors ${
							tabActiva === "datos"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						Datos del Pedido
					</button>
					
				</nav>
			</div>

			{/* Contenido de tabs - Pedido de Cotización */}
			{tabActiva === "datos" && (
                <div>
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
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Archivo de cotización</label>
                                <input
                                    type="file"
                                    {...register("archivo_cotizacion")}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                />
                                {obraData.pedido_cotizacion?.path_archivo_cotizacion && (
                                    <a
                                        href={`${import.meta.env.VITE_API_URL}/storage/${obraData.pedido_cotizacion.path_archivo_cotizacion}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline mt-1"
                                    >
                                        📄 {obraData.pedido_cotizacion.path_archivo_cotizacion.split('/').pop()}
                                    </a>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Archivo de mano de obra</label>
                                <input
                                    type="file"
                                    {...register("archivo_mano_obra")}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                />
                                {obraData.pedido_cotizacion?.path_archivo_mano_obra && (
                                    <a
                                        href={`${import.meta.env.VITE_API_URL}/storage/${obraData.pedido_cotizacion.path_archivo_mano_obra}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline mt-1"
                                    >
                                        📄 {obraData.pedido_cotizacion.path_archivo_mano_obra.split('/').pop()}
                                    </a>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Cierre Cotizacion</label>
                                <input
                                    type="date"
                                    {...register("fecha_cierre")}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estado de cotizacion</label>
                                <select 
                                    {...register("estado_cotizacion")}
                                    className="w-48 px-4 py-2 border border-gray-300 rounded-md"
                                >
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
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Estado comparativa</label>
                            <select 
                                {...register("estado_comparativa")}
                                className="w-48 px-4 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="pasado">Pasado</option>
                                <option value="hacer_planilla">Hacer planilla</option>
                                <option value="no_lleva">No lleva planilla</option>
                            </select>
                        </div>
                    </div>
			</div>
            )}


			
		</>
	);
}
