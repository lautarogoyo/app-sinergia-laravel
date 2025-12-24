import {useState } from "react";
import { useGrupos } from "../hooks/useGrupos.jsx";
import { useEmpleados } from "../hooks/useEmpleados.jsx";


export default function Grupos() {
	const [filtro, setFiltro] = useState("");
	const { isLoading, isError, data: grupos = [] } = useGrupos();
	const [ vista, setVista ] = useState(false);
	const [ id, setId ] = useState(null);
	const {data: empleados = [], isLoading: empleadoLoading, isError: empleadoError} = useEmpleados();
	
	// Filtrar todos los empleados del grupo seleccionado
	const empleadosDelGrupo = vista ? empleados.filter((e) => e.grupo && e.grupo.id === id) : [];

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
												onClick={() => {setVista(true);
													setId(grupo.id);}
												}
											>
												Ver Empleados
											</button>
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

			{vista && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
					<div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden">
						<div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
							<h3 className="text-2xl font-bold text-white">
								Empleados del Grupo {grupos.find(g => g.id === id)?.denominacion}
							</h3>
							<button
								className="text-white hover:text-gray-200 transition-colors duration-150 cursor-pointer"
								onClick={() => setVista(false)}
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div className="p-6 overflow-y-auto max-h-[60vh]">
							{empleadoLoading ? (
								<div className="text-center py-8">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
									<p className="mt-4 text-gray-600">Cargando empleados...</p>
								</div>
							) : empleadoError ? (
								<div className="text-center py-8 text-red-500">
									Error al cargar los empleados
								</div>
							) : empleadosDelGrupo.length > 0 ? (
								<div className="space-y-3">
									{empleadosDelGrupo.map((empleado) => (
										<div 
											key={empleado.id} 
											className="bg-gray-50 hover:bg-gray-100 transition-colors duration-150 rounded-lg p-4 border border-gray-200"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
														{empleado.nombre?.charAt(0)}{empleado.apellido?.charAt(0)}
													</div>
													<div>
														<p className="text-lg font-semibold text-gray-800">
															{empleado.nombre} {empleado.apellido}
														</p>
														
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8">
									<svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
									</svg>
									<p className="text-gray-600 text-lg">No hay empleados asignados a este grupo</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
