import { useEffect, useState } from "react";
import { getData } from "../Fetch/get.js";

// Panel de Obras inspirado en el panel de Empleados
export default function Obras() {
	const backendUrl = import.meta.env.VITE_API_URL;
	const [obras, setObras] = useState([]);
	const [filtro, setFiltro] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		getData(`${backendUrl}/api/obras`, "obras")
			.then((data) => {
				setObras(data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [backendUrl]);

	if (loading) return <div className="text-center text-xl py-8">Cargando...</div>;
	if (error) return <div className="text-center text-xl py-8 text-red-500">Error: {error}</div>;

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
							<th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Dirección</th>
							<th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Fechas</th>
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
									<td className="text-left text-lg text-gray-800 px-4 py-3 max-w-md break-words">{obra.direccion ?? "-"}</td>
									<td className="text-sm text-gray-700 px-4 py-3 whitespace-nowrap">
										<div>Ingreso: {obra.fecha_ingreso ?? "-"}</div>
										<div>Inicio: {obra.fecha_programacion_inicio ?? "-"}</div>
										<div>Recep. Prov.: {obra.fecha_recepcion_provisoria ?? "-"}</div>
										<div>Recep. Def.: {obra.fecha_recepcion_definitiva ?? "-"}</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex gap-2 justify-center flex-wrap">
											<button
												className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
												onClick={() => (window.location.href = `/editarobra/${obra.id}`)}
											>
												Editar
											</button>
											<button
												className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
												onClick={() => (window.location.href = `/eliminarobra/${obra.id}`)}
											>
												Eliminar
											</button>
											<button
												className="bg-gray-700 hover:bg-gray-800 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
												onClick={() => (window.location.href = `/obra/${obra.id}`)}
											>
												Ver detalle
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
	);
}
