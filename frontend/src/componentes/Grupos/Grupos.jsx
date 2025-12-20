import {useState } from "react";
import { useGrupos } from "../hooks/useGrupos.jsx";


export default function Grupos() {
	const [filtro, setFiltro] = useState("");
	const { isLoading, isError, data: grupos = [] } = useGrupos();

	if (isLoading) return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
      <div className="relative">
        
        {/* Texto de carga */}
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Grupos</h2>
          
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
  
  if (isError) return <div className="text-center text-xl py-8 text-red-500">Error al cargar los grupos</div>;

	const gruposFiltrados = grupos.filter((g) => {
		const val = filtro.toLowerCase();
		return (
			(g.denominacion ?? "").toLowerCase().includes(val) ||
			(g.id ?? "").toString().includes(val)
		);
	});

	return (
		<div className="p-8 bg-gray-100 lg:w-full flex flex-col">
			<h2 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide">Panel de Grupos</h2>

			<div className="mb-6 w-full max-w-2xl flex flex-col">
				<label htmlFor="filtro" className="mb-2 text-lg font-medium text-gray-700">
					Filtrar:
				</label>
				<input
					id="filtro"
					type="text"
					className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400 mb-2"
					placeholder="Filtrar por denominación o ID..."
					value={filtro}
					onChange={(e) => setFiltro(e.target.value)}
				/>
				<div className="mt-2">
					<button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer" onClick={() => window.location.href = `/crear-grupo`}>Agregar Grupo</button>
				</div>
			</div>

			<div className="shadow-2xl rounded-xl border border-gray-300 bg-white flex flex-col overflow-x-auto">
				<table className="min-w-full">
					<thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
						<tr>
							<th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Denominación</th>
							<th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Acciones</th>
						</tr>
					</thead>
					<tbody className="bg-gray-50 divide-y divide-gray-200 text-center">
						{gruposFiltrados.length > 0 ? (
							gruposFiltrados.map((grupo) => (
								<tr key={grupo.id} className="hover:bg-gray-200 transition-colors duration-150">
									<td className="text-lg text-gray-800 px-4 py-3">{grupo.denominacion ?? "Sin nombre"}</td>
									<td className="px-6 py-4">
										<div className="flex gap-2 justify-center flex-wrap">
											<button
												className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
												onClick={() => (window.location.href = `/editargrupo/${grupo.id}`)}
											>
												Editar
											</button>
											<button
												className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
												onClick={() => (window.location.href = `/eliminargrupo/${grupo.id}`)}
											>
												Eliminar
											</button>
											
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="2" className="px-6 py-4 text-center text-gray-500">
									No hay grupos
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
