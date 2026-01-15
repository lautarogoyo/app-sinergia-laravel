import { useState } from "react";
import Icon from "../Icons/Icons";

const obras = [{"id":1,"nro_obra":1001,"detalle":"comitente SAN CRISTOBAL SANTA FE - Baño accesible + sobretecho planta alta","estado":"Pedida para Cotizar","grupos": ["Stizza", "Parroni"],"direccion":"Calle Falsa 123, Ciudad", "fecha_visto" : "2023-01-15","fecha_ingreso":"2023-01-15","fecha_programacion_inicio":"2023-02-01","fecha_recepcion_provisoria":"2024-01-15","fecha_recepcion_definitiva":"2024-06-30"}];
// Panel de Obras inspirado en el panel de Empleados
export default function Obras() {

	const [filtro, setFiltro] = useState("");
	const [isLoading, setLoading] = useState(false);

	console.log(obras)
	if (isLoading) return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
      <div className="relative">
        
        {/* Texto de carga */}
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Obras</h2>
          
          {/* Barra de progreso */}
          <div className="w-80 h-3 bg-gray-700 rounded-full overflow-hidden shadow-lg">
            <div className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full animate-loading-bar"></div>
          </div>
          
          {/* Puntos animados */}
          <div className="mt-4 flex justify-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
            <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
            <span className="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
          </div>
        </div>
      </div>
    </div>
  );

	const obrasFiltradas = obras.filter((o) => {
		const val = filtro.toLowerCase();
		return (
			(o.nro_obra ?? "").toString().toLowerCase().includes(val) ||
			(o.detalle ?? "").toLowerCase().includes(val) ||
			(o.estado ?? "").toLowerCase().includes(val) ||
			(o.direccion ?? "").toLowerCase().includes(val)
		);
	});

	const statusClass = (estado) => {
		if (!estado) return "bg-gray-300 text-gray-800";
		const norm = estado.toLowerCase();
		if (norm === "activa" || norm === "en curso" || norm === "progreso") return "bg-green-500 text-white";
		if (norm === "pendiente" || norm === "planificada") return "bg-yellow-400 text-gray-900";
		if (norm === "finalizada" || norm === "cerrada") return "bg-blue-600 text-white";
		if (norm === "cancelada") return "bg-red-600 text-white";
		return "bg-gray-300 text-gray-800";
	};

	return (
		<>
		{!isLoading &&
		<div className="p-8 bg-gray-100 lg:w-full flex flex-col">
			
			<h2 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide">Panel de Obras</h2>

			<div className="mb-6 w-full max-w-2xl flex flex-col">
				<label htmlFor="filtro" className="mb-2 text-lg font-medium text-gray-700">
					Filtrar:
				</label>
				<input
					id="filtro"
					type="text"
					className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400 mb-2"
					placeholder="Filtrar por nro, detalle, estado o dirección..."
					value={filtro}
					onChange={(e) => setFiltro(e.target.value)}
				/>
			</div>

			<div className="shadow-2xl rounded-xl border border-gray-300 bg-white flex flex-col overflow-x-auto">
				<table className="min-w-full">
					<thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
						<tr>
							<th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Nro</th>
							<th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Detalle</th>
							<th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Estado</th>
							<th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Grupo Contratado</th>
							<th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Fecha Visto</th>
							<th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Acciones</th>
						</tr>
					</thead>
					<tbody className="bg-gray-50 divide-y divide-gray-200 text-center">
						{obrasFiltradas.length > 0 ? (
							obrasFiltradas.map((obra) => (
								<tr key={obra.id} className="hover:bg-gray-200 transition-colors duration-150">
									<td className="whitespace-nowrap text-xl text-gray-800">{obra.nro_obra ?? "-"}</td>
									<td className="text-left text-lg text-gray-800 px-4 py-3 max-w-xl break-words">{obra.detalle ?? "Sin detalle"}</td>
									<td className="whitespace-nowrap px-4">
										<span className={`px-3 py-1 rounded text-sm font-bold ${statusClass(obra.estado)}`}>
											{(obra.estado ?? "-").toUpperCase()}
										</span>
									</td>
									<td className="px-4 py-3">
										<div className="flex flex-wrap gap-2 justify-center">
											{obra.grupos && obra.grupos.length > 0 ? (
												obra.grupos.map((grupo) => (
													<span
													//la key tiene que ser grupo.id y el grupo.nombre va abajo
													key={grupo}
													className="px-3 py-1 border-1 text-lg font-semibold "
													>
													{grupo}
													</span>
												))
												) : (
												<span className="text-gray-500">-</span>
												)
											}
										</div>
									</td>
									<td className="text-lg font-bold px-4 py-3 whitespace-nowrap">
										{obra.fecha_visto ?? "-"}
									</td>
									<td className="px-6 py-4">
										<div className="flex gap-2 justify-center flex-wrap">
											<button
												className=" border-2 border-black hover:bg-gray-300 py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
												onClick={() => (window.location.href = `/editarobra/${obra.id}`)}
											>
												<Icon name="pencil" className="w-5 h-5" />
											</button>
											<button
												className="bg-red-500 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
												onClick={() => (window.location.href = `/eliminarobra/${obra.id}`)}
											>
												<Icon name="trash" className="w-5 h-5" />
											</button>
											<button
												className="bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
												onClick={() => (window.location.href = `/obra/${obra.id}/gestionar`)}
											>
												Gestionar
											</button>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="6" className="px-6 py-4 text-center text-gray-500">
									No hay obras
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
		}
		</>
	);
}
