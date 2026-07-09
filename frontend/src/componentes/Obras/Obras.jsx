import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Icon from "../Icons/Icons";
import ComentariosModal from "./ComentariosModal";
import { useObras } from "../hooks/useObras.jsx";
import { DeleteObra } from "../api/obras.js";
import { fixMojibake } from "../utils/text";
import { formatearFecha, generarPdfPanelObras } from "./ObrasPdf";
import EditFechaVistoModal from "./EditFechaVistoModal.jsx";
import PaginationControls from "../shared/PaginationControls.jsx";
import { usePagination } from "../shared/usePagination.jsx";


// Panel de Obras inspirado en el panel de Empleados
export default function Obras() {
	const navigate = useNavigate();
	const [filtro, setFiltro] = useState("");
	const [modalComentarios, setModalComentarios] = useState({ isOpen: false, obra: null });
	const { data: obrasData = [], isLoading: isLoadingObras } = useObras();
	const queryClient = useQueryClient();
	const [modalFechaVisto, setModalFechaVisto] = useState({ isOpen: false, obra: null });
	const [sortConfig, setSortConfig] = useState({ key: null, dir: "asc" });
	const [menuAbierto, setMenuAbierto] = useState(null);
	const menuRef = useRef(null);

	useEffect(() => {
		if (menuAbierto === null) return;
		const handleClickFuera = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setMenuAbierto(null);
			}
		};
		document.addEventListener("mousedown", handleClickFuera);
		return () => document.removeEventListener("mousedown", handleClickFuera);
	}, [menuAbierto]);

	const handleSort = (key) => {
		setSortConfig((prev) =>
			prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
		);
	};

	const SortIcon = ({ col }) => {
		if (sortConfig.key !== col) return <span className="ml-1 text-gray-400 text-xs">⇅</span>;
		return <span className="ml-1 text-xs">{sortConfig.dir === "asc" ? "↑" : "↓"}</span>;
	};

	const deleteMutation = useMutation({
		mutationFn: (id) => DeleteObra(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["obras"] });
		},
		onError: (error) => {
			console.error("Error al eliminar obra:", error);
			const msg = error?.response?.data?.message || "Error al eliminar la obra";
			Swal.fire({
				icon: "error",
				title: "Error",
				text: msg,
			});
		},
	});

	const handleEliminarObra = async (obra) => {
		const result = await Swal.fire({
			icon: "warning",
			title: "Confirmar eliminacion",
			text: `Esta seguro de eliminar la Obra #${obra.nro_obra}?`,
			showCancelButton: true,
			confirmButtonText: "Si, eliminar",
			cancelButtonText: "Cancelar",
		});
		if (result.isConfirmed) {
			deleteMutation.mutate(obra.obra_id);
		}
	};

	const getEstado = (obra) => obra.estado_obra?.descripcion;

	const obrasFiltradas = obrasData.filter((o) => {
		const val = filtro.toLowerCase();
		return (
			(o.nro_obra ?? "").toString().toLowerCase().includes(val) ||
			(o.detalle ?? "").toLowerCase().includes(val) ||
			getEstado(o).toLowerCase().includes(val)
		);
	});

	const prioridadEstado = (estado) => {
		const norm = (estado || "").toLowerCase().replaceAll("_", "");
		if (norm === "encurso") return 0;
		if (norm === "pedida") return 1;
		return 2;
	};

	const ordenarNroObraAsc = (a, b) => {
		const aNum = Number(a.nro_obra);
		const bNum = Number(b.nro_obra);
		const aEsNum = Number.isFinite(aNum);
		const bEsNum = Number.isFinite(bNum);

		if (aEsNum && bEsNum) return aNum - bNum;
		if (aEsNum) return -1;
		if (bEsNum) return 1;
		return String(a.nro_obra ?? "").localeCompare(String(b.nro_obra ?? ""), undefined, {
			numeric: true,
			sensitivity: "base",
		});
	};

	const obrasOrdenadas = [...obrasFiltradas].sort((a, b) => {
		if (sortConfig.key) {
			let aVal, bVal;
			if (sortConfig.key === "nro_obra") {
				aVal = Number(a.nro_obra);
				bVal = Number(b.nro_obra);
				return sortConfig.dir === "asc" ? aVal - bVal : bVal - aVal;
			}
			if (sortConfig.key === "estado") {
				aVal = getEstado(a)?.toLowerCase() ?? "";
				bVal = getEstado(b)?.toLowerCase() ?? "";
			} else if (sortConfig.key === "fecha_visto") {
				aVal = a.fecha_visto ?? "";
				bVal = b.fecha_visto ?? "";
			} else {
				aVal = (a[sortConfig.key] ?? "").toString().toLowerCase();
				bVal = (b[sortConfig.key] ?? "").toString().toLowerCase();
			}
			if (aVal < bVal) return sortConfig.dir === "asc" ? -1 : 1;
			if (aVal > bVal) return sortConfig.dir === "asc" ? 1 : -1;
			return 0;
		}
		// orden por defecto
		const prioridad = prioridadEstado(getEstado(a)) - prioridadEstado(getEstado(b));
		if (prioridad !== 0) return prioridad;
		return ordenarNroObraAsc(a, b);
	});

	const obrasPage = usePagination(obrasOrdenadas, 8);

	if (isLoadingObras) {
		return (
			<div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
				<div className="relative">
					<div className="mt-8 text-center">
						<h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Obras</h2>
						<div className="w-80 h-3 bg-gray-700 rounded-full overflow-hidden shadow-lg">
							<div className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full animate-loading-bar"></div>
						</div>
						<div className="mt-4 flex justify-center gap-2">
							<span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
							<span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
							<span className="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const labelEstado = (estado) => {
		if (!estado) return "-";
		const mapa = {
			pedida: "Pedida para cotizar",
			cotizada: "Cotizada",
			en_curso: "En Curso",
			finalizada: "Finalizada",
		};
		return mapa[estado.toLowerCase()] || estado;
	};

	const statusClass = (estado) => {
		if (!estado) return "bg-gray-300 text-gray-800";
		const norm = estado.toLowerCase();
		if (norm === "en_curso") return "bg-green-500 text-white";
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
	const esFechaHoy = (fecha) => {
		if (!fecha) return false;
		const hoy = new Date();
		const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
		return String(fecha).slice(0, 10) === hoyStr;
	};
	return (
		<>
			<EditFechaVistoModal
				isOpen={modalFechaVisto.isOpen}
				onClose={() => setModalFechaVisto({ isOpen: false, obra: null })}
				obra={modalFechaVisto.obra}
			/>
			<ComentariosModal
				isOpen={modalComentarios.isOpen}
				onClose={cerrarModalComentarios}
				obra={modalComentarios.obra}
			/>
			<div className="flex-1 min-w-0 w-full p-8 bg-gray-100 flex flex-col min-h-0 overflow-hidden">
				<h2 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide">Panel de Obras</h2>

				<div className="mb-6 w-full max-w-2xl flex flex-col">
					<label htmlFor="filtro" className="mb-2 text-lg font-medium text-gray-700">
						Filtrar:
					</label>
					<input
						id="filtro"
						type="text"
						className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400 mb-4"
						placeholder="Filtrar por nro, detalle, estado o direccion..."
						value={filtro}
						onChange={(e) => setFiltro(e.target.value)}
					/>
					<div className="flex flex-col sm:flex-row gap-2">
						<button
							className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
							onClick={() => navigate("/crear-obra")}
						>
							Agregar
						</button>
						<div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
							<button
								className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
								onClick={() => generarPdfPanelObras(obrasOrdenadas)}
							>
								Generar PDF
							</button>
							<button
								className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
								onClick={() => navigate("/obras/diagrama")}
							>
								Diagrama de Gantt
							</button>
						</div>
					</div>
				</div>

				<div className="table-card">
					<div className="table-card__viewport overflow-x-auto">
						<table className="min-w-max w-full">
							<thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
								<tr>
									<th className="px-6 py-3 text-center text-lg font-bold text-gray-100 border-b border-gray-500"></th>
									{[
										{ label: "Nro. Obra", key: "nro_obra" },
										{ label: "Detalle", key: "detalle" },
										{ label: "Estado", key: "estado" },
										{ label: "Grupos", key: "grupos" },
										{ label: "Fecha Visto", key: "fecha_visto" },
									].map(({ label, key }) => (
										<th
											key={key}
											onClick={() => handleSort(key)}
											className="px-6 py-3 text-center text-lg font-bold text-gray-100 border-b border-gray-500 cursor-pointer select-none hover:bg-gray-600 transition"
										>
											{label}<SortIcon col={key} />
										</th>
									))}
								</tr>
							</thead>
							<tbody className="bg-gray-50 divide-y divide-gray-200 text-center">
								{obrasPage.paginatedItems.length > 0 ? (
									obrasPage.paginatedItems.map((obra, index) => {
										const esUltimaFila = index === obrasPage.paginatedItems.length - 1;
										return (
											<tr key={obra.obra_id} className="hover:bg-gray-200 transition-colors duration-150">
												<td className="px-6 py-4">
													<div className="flex flex-row gap-2 items-center">
														{/* Grupo principal: Gestionar, Gastos, Comentarios */}
														<div className="relative inline-block" ref={menuAbierto === obra.obra_id ? menuRef : null}>
															<button
																className="border-2 border-black hover:bg-gray-300 p-2 rounded shadow transition duration-150 cursor-pointer"
																onClick={() => setMenuAbierto(menuAbierto === obra.obra_id ? null : obra.obra_id)}
															>
																<Icon name="menu" className="w-5 h-5" />
															</button>

															{menuAbierto === obra.obra_id && (
																<div className={`absolute left-0 w-44 bg-white border border-gray-200 rounded shadow-lg z-10 ${esUltimaFila ? "bottom-full mb-2" : "mt-2"}`}>
																	<button
																		className="flex items-center gap-2 w-full text-left px-4 py-2 text-lg hover:bg-gray-100"
																		onClick={() => {
																			navigate(`/obra/${obra.obra_id}/gestionar`);
																			setMenuAbierto(null);
																		}}
																	>
																		<Icon name="setting" className="w-5 h-5" />
																		Gestionar
																	</button>
																	<button
																		className="flex items-center gap-2 w-full text-left px-4 py-2 text-lg hover:bg-gray-100"
																		onClick={() => {
																			navigate(`/obra/${obra.obra_id}/gestionar`);
																			setMenuAbierto(null);
																		}}
																	>
																		<Icon name="cash" className="w-5 h-5" />
																		Gastos
																	</button>
																	<button
																		className="flex items-center gap-2 w-full text-left px-4 py-2 text-lg hover:bg-gray-100"
																		onClick={() => {
																			abrirModalComentarios(obra);
																			setMenuAbierto(null);
																		}}
																	>
																		<Icon name="message" className="w-5 h-5" />
																		Comentarios
																	</button>
																</div>
															)}
														</div>
														{/* Grupo secundario: Editar, Eliminar */}
														<div className="flex gap-2 justify-center">
															<button
																className="group bg-yellow-300 hover:bg-yellow-400 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center"
																onClick={() => navigate(`/editarobra/${obra.obra_id}`)}
															>
																<Icon name="pencil" className="h-6 w-6 text-white group-hover:text-yellow-200 transition-colors" />
															</button>
															<button
																className="group bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center disabled:opacity-50"
																onClick={() => handleEliminarObra(obra)}
																disabled={deleteMutation.isPending}
															>
																<Icon name="trash" className="h-6 w-6 text-white group-hover:text-yellow-200 transition-colors" />
															</button>
														</div>
													</div>
												</td>
												<td className="whitespace-nowrap text-lg text-gray-800 px-6 py-4">{obra.nro_obra ?? "-"}</td>
												<td className="text-left text-lg text-gray-800 px-6 py-4 max-w-xl break-words">
													{fixMojibake(obra.detalle ?? "Sin detalle")}
												</td>
												<td className="whitespace-nowrap px-6 py-4">
													<span className={`px-3 py-1 rounded text-sm font-bold ${statusClass(getEstado(obra))}`}>
														{labelEstado(getEstado(obra)).toUpperCase()}
													</span>
												</td>
												<td className="px-6 py-4 max-w-xs">
													{obra.grupos && obra.grupos.length > 0 ? (
														<span className="text-lg font-semibold break-words whitespace-normal">
															{obra.grupos.map((g) => g.nombre_apellido).join(", ")}
														</span>
													) : (
														<span className="text-gray-500">-</span>
													)}
												</td>
												<td
													className="text-lg font-bold px-6 py-4 whitespace-nowrap cursor-pointer hover:opacity-80"
													style={esFechaHoy(obra.fecha_visto) ? { backgroundColor: "#B4A7D6" } : {}}
													onClick={() => setModalFechaVisto({ isOpen: true, obra })}
													title="Click para editar fecha visto"
												>
													{formatearFecha(obra.fecha_visto)}
												</td>
											</tr>
										);
									})
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
					<PaginationControls
						currentPage={obrasPage.currentPage}
						totalPages={obrasPage.totalPages}
						totalItems={obrasPage.totalItems}
						startItem={obrasPage.startItem}
						endItem={obrasPage.endItem}
						pageSize={obrasPage.pageSize}
						onPageSizeChange={obrasPage.setPageSize}
						hasPrevious={obrasPage.hasPrevious}
						hasNext={obrasPage.hasNext}
						onPrevious={() => obrasPage.setCurrentPage((page) => Math.max(1, page - 1))}
						onNext={() => obrasPage.setCurrentPage((page) => Math.min(obrasPage.totalPages, page + 1))}
					/>
				</div>
			</div>
		</>
	);
}
