import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Icon from "../Icons/Icons";
import ComentariosModal from "./ComentariosModal";
import { useObras } from "../hooks/useObras.jsx";
import { DeleteObra } from "../api/obras.js";

// Panel de Obras inspirado en el panel de Empleados
export default function Obras() {
	const navigate = useNavigate();
	const [filtro, setFiltro] = useState("");
	const [modalComentarios, setModalComentarios] = useState({ isOpen: false, obra: null });
	const { data: obrasData = [], isLoading: isLoadingObras } = useObras();
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: (id) => DeleteObra(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["obras"] });
		},
		onError: (error) => {
			console.error("Error al eliminar obra:", error);
			const msg = error?.response?.data?.message || "Error al eliminar la obra";
			alert(msg);
		}
	});

	const handleEliminarObra = (obra) => {
		if (confirm(`¿Está seguro de eliminar la Obra #${obra.nro_obra}?`)) {
			deleteMutation.mutate(obra.id);
		}
	};

	// Función para formatear fechas a dd/mm/yy
	const formatearFecha = (fecha) => {
		if (!fecha) return "-";
		try {
			// Extraer solo la parte de fecha si viene con timestamp
			const fechaSolo = fecha.split('T')[0];
			const partes = fechaSolo.split('-');
			
			if (partes.length === 3) {
				const year = partes[0].slice(-2);
				const month = partes[1].padStart(2, '0');
				const day = partes[2].padStart(2, '0');
				return `${day}/${month}/${year}`;
			}
			return "-";
		} catch {
			return "-";
		}
	};

	console.log(obrasData)
	if (isLoadingObras) return (
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

	const obrasFiltradas = obrasData.filter((o) => {
		const val = filtro.toLowerCase();
		return (
			(o.nro_obra ?? "").toString().toLowerCase().includes(val) ||
			(o.detalle ?? "").toLowerCase().includes(val) ||
			(o.estado ?? "").toLowerCase().includes(val)
		);
	});

	const labelEstado = (estado) => {
		if (!estado) return "-";
		const mapa = {
			pedida: "Pedido de Cotización",
			cotizada: "Cotizada",
			encurso: "En Curso",
			finalizada: "Finalizada",
		};
		return mapa[estado.toLowerCase()] || estado;
	};

	const statusClass = (estado) => {
		if (!estado) return "bg-gray-300 text-gray-800";
		const norm = estado.toLowerCase();
		if (norm === "encurso") return "bg-green-500 text-white";
		if (norm === "pedida") return "bg-yellow-400 text-gray-900";
		if (norm === "cotizada") return "bg-orange-400 text-white";
		if (norm === "finalizada") return "bg-blue-600 text-white";
		return "bg-gray-300 text-gray-800";
	};

	const abrirModalComentarios = (obra) => {
		setModalComentarios({ isOpen: true, obra });
	};

	const cerrarModalComentarios = () => {
		setModalComentarios({ isOpen: false, obra: null });
	};

	return (
		<>
		<ComentariosModal
			isOpen={modalComentarios.isOpen}
			onClose={cerrarModalComentarios}
			obra={modalComentarios.obra}
		/>
		{!isLoadingObras &&
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
				<button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer" onClick={() => navigate('/crear-obra')}>Agregar Obra</button>
			</div>

			<div className="shadow-2xl rounded-xl border border-gray-300 bg-white flex flex-col">
				<table className="">
					<thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
						<tr>
							<th className="px-6 py-3 text-center text-lg font-bold text-gray-100 border-b border-gray-500">Nro. Obra</th>
							<th className="px-6 py-3 text-center text-lg font-bold text-gray-100 border-b border-gray-500">Detalle</th>
							<th className="px-6 py-3 text-center text-lg font-bold text-gray-100 border-b border-gray-500">Estado</th>
							<th className="px-6 py-3 text-center text-lg font-bold text-gray-100 border-b border-gray-500">Grupos</th>
							<th className="px-6 py-3 text-center text-lg font-bold text-gray-100 border-b border-gray-500">Fecha Visto</th>
							<th className="px-6 py-3 text-center text-lg font-bold text-gray-100 border-b border-gray-500">Acciones</th>
						</tr>
					</thead>
					<tbody className="bg-gray-50 divide-y divide-gray-200 text-center">
						{obrasFiltradas.length > 0 ? (
							obrasFiltradas.map((obra) => (
								<tr key={obra.id} className="hover:bg-gray-200 transition-colors duration-150">
									<td className="whitespace-nowrap text-lg text-gray-800 px-6 py-4">{obra.nro_obra ?? "-"}</td>
									<td className="text-left text-lg text-gray-800 px-6 py-4 max-w-xl break-words">{obra.detalle ?? "Sin detalle"}</td>
									<td className="whitespace-nowrap px-6 py-4">
										<span className={`px-3 py-1 rounded text-sm font-bold ${statusClass(obra.estado)}`}>
											{labelEstado(obra.estado).toUpperCase()}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex flex-wrap gap-2 justify-center">
											{obra.grupos && obra.grupos.length > 0 ? (
												obra.grupos.map((grupo) => (
													<span
													key={grupo.id}
													className="px-3 py-1 border-1 text-lg font-semibold "
													>
													{grupo.denominacion}
													</span>
												))
												) : (
												<span className="text-gray-500">-</span>
												)
											}
										</div>
									</td>
									<td className="text-lg font-bold px-6 py-4 whitespace-nowrap">
										{formatearFecha(obra.fecha_visto)}
									</td>
									<td className="px-6 py-4">
										<div className="flex gap-2 justify-center flex-wrap">
											<button
												className=" border-2 border-black hover:bg-gray-300 py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
												onClick={() => navigate(`/editarobra/${obra.id}`)}
											>
												<Icon name="pencil" className="w-5 h-5" />
											</button>
											<button
												className="bg-red-500 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer disabled:opacity-50"
												onClick={() => handleEliminarObra(obra)}
												disabled={deleteMutation.isPending}
											>
												<Icon name="trash" className="w-5 h-5" />
											</button>
											<button
												className="border-2 border-black hover:bg-gray-300 py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
											onClick={() => abrirModalComentarios(obra)}
											>
												<Icon name="message" className="w-5 h-5" />
											</button>
											<button
												className="bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
												onClick={() => navigate(`/obra/${obra.id}/gestionar`)}
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
