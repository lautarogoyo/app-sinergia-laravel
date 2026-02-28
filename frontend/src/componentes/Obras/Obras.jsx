import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Icon from "../Icons/Icons";
import ComentariosModal from "./ComentariosModal";
import { useObras } from "../hooks/useObras.jsx";
import { DeleteObra } from "../api/obras.js";
import { fixMojibake } from "../utils/text";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const SINERGIA_LOGO_URL = "https://static.wixstatic.com/media/739f6f_72ea3433f31a45448cf67888b8f5f6e3~mv2.png/v1/fill/w_89,h_84,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/iczzlYy_edited.png";

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
			Swal.fire({
				icon: "error",
				title: "Error",
				text: msg,
			});
		}
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

	const formatDateForFile = () => {
		const now = new Date();
		const y = now.getFullYear();
		const m = String(now.getMonth() + 1).padStart(2, "0");
		const d = String(now.getDate()).padStart(2, "0");
		return `${y}${m}${d}`;
	};

	const drawHexLikeLogo = (doc, x, y, r = 3.1) => {
		const colors = [
			[76, 96, 230],
			[217, 117, 36],
			[224, 56, 181],
			[241, 66, 66],
			[176, 178, 34],
			[35, 176, 76],
		];
		const positions = [
			[x - r * 1.8, y - r * 1.2],
			[x - r * 1.8, y + r * 1.2],
			[x, y + r * 2.3],
			[x, y - r * 2.3],
			[x + r * 1.8, y - r * 1.2],
			[x + r * 1.8, y + r * 1.2],
		];

		for (let i = 0; i < positions.length; i += 1) {
			const [cx, cy] = positions[i];
			const [cr, cg, cb] = colors[i];
			doc.setFillColor(cr, cg, cb);
			doc.setDrawColor(130, 130, 130);
			doc.circle(cx, cy, r, "FD");
		}
		doc.setFillColor(255, 255, 255);
		doc.circle(x, y, r * 1.2, "F");
	};

	const toDataUrl = async (url) => {
		try {
			const response = await fetch(url);
			if (!response.ok) return null;
			const blob = await response.blob();
			return await new Promise((resolve) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result);
				reader.onerror = () => resolve(null);
				reader.readAsDataURL(blob);
			});
		} catch {
			return null;
		}
	};

	const drawPdfHeader = async (doc, titulo) => {
		const pageW = doc.internal.pageSize.getWidth();
		const pageH = doc.internal.pageSize.getHeight();
		doc.setFillColor(255, 255, 255);
		doc.rect(0, 0, pageW, pageH, "F");

		doc.setTextColor(0, 0, 0);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(20);
		doc.text(titulo, pageW / 2, 14, { align: "center" });

		doc.setFontSize(13);
		doc.text(`Fecha: ${formatearFecha(new Date().toISOString())}`, pageW / 2, 22, { align: "center" });

		const logoDataUrl = await toDataUrl(SINERGIA_LOGO_URL);
		if (logoDataUrl) {
			doc.addImage(logoDataUrl, "PNG", pageW - 31, 8, 14, 14, undefined, "FAST");
		} else {
			drawHexLikeLogo(doc, pageW - 28, 16.5, 2.8);
		}
		doc.setDrawColor(0, 0, 0);
		doc.setLineWidth(0.35);
		doc.line(0, 1.2, pageW, 1.2);
	};

	const parseDateOnly = (value) => {
		if (!value) return null;
		const [y, m, d] = String(value).split("T")[0].split("-").map(Number);
		if (!y || !m || !d) return null;
		return new Date(y, m - 1, d);
	};

	const getUltimoComentario = (obra) => {
		const comentarios = Array.isArray(obra.comentarios) ? [...obra.comentarios] : [];
		if (!comentarios.length) return "-";
		comentarios.sort((a, b) => {
			const ta = new Date(a.created_at || 0).getTime();
			const tb = new Date(b.created_at || 0).getTime();
			if (ta !== tb) return tb - ta;
			return (b.id || 0) - (a.id || 0);
		});
		return fixMojibake(String(comentarios[0].denominacion || "-"));
	};

	const calcularDiasAtraso = (fechaRecepcionProvisoria, fechaFinOrdenCompra) => {
		const recepcion = parseDateOnly(fechaRecepcionProvisoria);
		const finOc = parseDateOnly(fechaFinOrdenCompra);
		if (!recepcion || !finOc) return null;
		const diffMs = recepcion.getTime() - finOc.getTime();
		return Math.floor(diffMs / (1000 * 60 * 60 * 24));
	};

	const buildPdfObrasEnCurso = async (obras) => {
		const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [297, 450] });
		await drawPdfHeader(doc, "OBRAS EN CURSO 4B");
		const pageW = doc.internal.pageSize.getWidth();
		const pageH = doc.internal.pageSize.getHeight();

		const rows = obras.map((obra) => {
			const atrasoDias = calcularDiasAtraso(
				obra.fecha_recepcion_provisoria,
				obra.orden_compra?.fecha_fin_orden_compra
			);
			return {
				nro_obra: String(obra.nro_obra ?? "-"),
				detalle: fixMojibake(String(obra.detalle ?? "-")),
				comentario: getUltimoComentario(obra),
				grupo_cotiza: obra.grupos?.length ? obra.grupos.map((g) => g.denominacion).join(", ") : "-",
				fecha_visto: formatearFecha(obra.fecha_visto),
				fecha_inicio_oc: formatearFecha(obra.orden_compra?.fecha_inicio_orden_compra),
				fecha_inicio: formatearFecha(obra.fecha_programacion_inicio),
				fecha_fin_nos: formatearFecha(obra.fecha_recepcion_provisoria),
				fecha_fin_oc: formatearFecha(obra.orden_compra?.fecha_fin_orden_compra),
				caratula: fixMojibake(String(obra.detalle_caratula || "-")),
				nro_oc: String(obra.orden_compra?.nro_orden_compra || "-"),
				grupo_trabajo_oc: fixMojibake(String(obra.orden_compra?.detalle || "-")),
				atraso: atrasoDias && atrasoDias > 0 ? `Atrasada ${atrasoDias} DIAS` : "Sin atraso",
				atrasoDias: atrasoDias && atrasoDias > 0 ? atrasoDias : 0,
			};
		});

		autoTable(doc, {
			startY: 38,
			margin: { top: 38, left: 4, right: 4, bottom: 4 },
			tableWidth: pageW - 8,
			columns: [
				{ header: "Nro", dataKey: "nro_obra" },
				{ header: "Detalle", dataKey: "detalle" },
				{ header: "Comentarios (ultimo)", dataKey: "comentario" },
				{ header: "Grupo cotiza", dataKey: "grupo_cotiza" },
				{ header: "Fecha vi", dataKey: "fecha_visto" },
				{ header: "Fec. ini O.C", dataKey: "fecha_inicio_oc" },
				{ header: "Inicio", dataKey: "fecha_inicio" },
				{ header: "Finaliz. Nos", dataKey: "fecha_fin_nos" },
				{ header: "Finaliz. O.C", dataKey: "fecha_fin_oc" },
				{ header: "Carat.", dataKey: "caratula" },
				{ header: "Nro", dataKey: "nro_oc" },
				{ header: "Grupo Trab. O.C", dataKey: "grupo_trabajo_oc" },
				{ header: "Dias atraso", dataKey: "atraso" },
			],
			body: rows,
			theme: "grid",
			styles: {
				fontSize: 7,
				cellPadding: 0.9,
				overflow: "linebreak",
				lineColor: [0, 0, 0],
				lineWidth: 0.15,
				fillColor: [255, 255, 255],
				textColor: [0, 0, 0],
				minCellHeight: 5,
			},
			headStyles: {
				fillColor: [200, 200, 200],
				textColor: [0, 0, 0],
				fontStyle: "bold",
				lineColor: [0, 0, 0],
				lineWidth: 0.2,
				fontSize: 8,
				cellPadding: 1.1,
			},
			columnStyles: {
				nro_obra: { cellWidth: 16 },
				detalle: { cellWidth: 80 },
				comentario: { cellWidth: 140 },
				grupo_cotiza: { cellWidth: 38 },
				fecha_visto: { cellWidth: 14 },
				fecha_inicio_oc: { cellWidth: 14, fillColor: [255, 255, 0] },
				fecha_inicio: { cellWidth: 14, fillColor: [252, 229, 205] },
				fecha_fin_nos: { cellWidth: 16, fillColor: [255, 255, 0] },
				fecha_fin_oc: { cellWidth: 16, fillColor: [255, 255, 0] },
				caratula: { cellWidth: 18, fillColor: [200, 255, 200] },
				nro_oc: { cellWidth: 14 },
				grupo_trabajo_oc: { cellWidth: 45 },
				atraso: { cellWidth: 23 },
			},
			didParseCell: (data) => {
				if (data.section === "head") {
					data.cell.styles.overflow = "linebreak";
				}
				if (data.section === "head") return;
				if (data.column.dataKey === "fecha_inicio_oc" || data.column.dataKey === "fecha_fin_oc") {
					data.cell.styles.fillColor = [255, 255, 0];
					data.cell.styles.textColor = [0, 0, 0];
				}
				if (data.column.dataKey === "fecha_inicio") {
					data.cell.styles.fillColor = [252, 229, 205];
					data.cell.styles.textColor = [0, 0, 0];
				}
				if (data.column.dataKey === "fecha_fin_nos" && data.row.raw.atrasoDias > 0) {
					data.cell.styles.fillColor = [255, 0, 0];
					data.cell.styles.textColor = [0, 0, 0];
					data.cell.styles.fontStyle = "bold";
				}
				if (data.column.dataKey === "atraso" && data.row.raw.atrasoDias > 0) {
					data.cell.styles.textColor = [0, 0, 0];
					data.cell.styles.fillColor = [255, 0, 0];
					data.cell.styles.fontStyle = "bold";
				}
			},
		});

		doc.setFontSize(4.5);
		doc.setTextColor(0, 0, 0);
		doc.text("Pagina 1", pageW / 2, pageH - 1.6, { align: "center" });

		doc.save(`obras_en_curso_${formatDateForFile()}.pdf`);
	};

	const buildPdfPedidoCotizacion = async (obras) => {
		const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
		await drawPdfHeader(doc, "PEDIDOS DE COTIZACION 4A");

		const rows = obras.map((obra) => ({
			nro_obra: String(obra.nro_obra ?? "-"),
			detalle: fixMojibake(String(obra.detalle ?? "-")),
			comentario: getUltimoComentario(obra),
			grupo_cotiza: obra.grupos?.length ? obra.grupos.map((g) => g.denominacion).join(", ") : "-",
			fecha_visto: formatearFecha(obra.fecha_visto),
			fecha_cierre: formatearFecha(obra.pedidos_cotizacion?.[0]?.fecha_cierre_cotizacion),
		}));

		autoTable(doc, {
			startY: 30,
			columns: [
				{ header: "Nro de obra", dataKey: "nro_obra" },
				{ header: "Detalle", dataKey: "detalle" },
				{ header: "Comentarios (ultimo)", dataKey: "comentario" },
				{ header: "Grupo cotiza", dataKey: "grupo_cotiza" },
				{ header: "Fecha visto", dataKey: "fecha_visto" },
				{ header: "Fecha cierre", dataKey: "fecha_cierre" },
			],
			body: rows,
			theme: "grid",
			styles: {
				fontSize: 7.2,
				cellPadding: 1.5,
				overflow: "linebreak",
				lineColor: [0, 0, 0],
				lineWidth: 0.2,
				fillColor: [255, 255, 255],
				textColor: [0, 0, 0],
			},
			headStyles: {
				fillColor: [200, 200, 200],
				textColor: [0, 0, 0],
				fontStyle: "bold",
				lineColor: [0, 0, 0],
				lineWidth: 0.25,
			},
			columnStyles: {
				nro_obra: { cellWidth: 12 },
				detalle: { cellWidth: 94 },
				comentario: { cellWidth: 58 },
				grupo_cotiza: { cellWidth: 39 },
				fecha_visto: { cellWidth: 14 },
				fecha_cierre: { fillColor: [255, 255, 0] },
			},
			didParseCell: (data) => {
				if (data.section === "head") return;
				if (data.column.dataKey === "fecha_cierre") {
					data.cell.styles.fillColor = [255, 255, 0];
					data.cell.styles.textColor = [0, 0, 0];
				}
			},
		});

		doc.save(`pedidos_cotizacion_${formatDateForFile()}.pdf`);
	};

	const handleGenerarPdfPanel = async () => {
		const result = await Swal.fire({
			icon: "question",
			title: "Generar PDF",
			text: "Seleccione el tipo de listado",
			showCancelButton: true,
			showDenyButton: true,
			confirmButtonText: "Obras en curso",
			denyButtonText: "Pedido de cotizacion",
			cancelButtonText: "Cancelar",
		});

		if (result.isConfirmed) {
			const obrasEnCurso = obrasOrdenadas.filter((o) => (o.estado || "").toLowerCase().replaceAll("_", "") === "encurso");
			if (!obrasEnCurso.length) {
				await Swal.fire({ icon: "info", title: "Sin datos", text: "No hay obras en curso para exportar." });
				return;
			}
			await buildPdfObrasEnCurso(obrasEnCurso);
			return;
		}

		if (result.isDenied) {
			const obrasPedida = obrasOrdenadas.filter((o) => (o.estado || "").toLowerCase() === "pedida");
			if (!obrasPedida.length) {
				await Swal.fire({ icon: "info", title: "Sin datos", text: "No hay obras en pedido de cotizacion para exportar." });
				return;
			}
			await buildPdfPedidoCotizacion(obrasPedida);
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
		return String(a.nro_obra ?? "").localeCompare(String(b.nro_obra ?? ""), undefined, { numeric: true, sensitivity: "base" });
	};

	const obrasOrdenadas = [...obrasFiltradas].sort((a, b) => {
		const prioridad = prioridadEstado(a.estado) - prioridadEstado(b.estado);
		if (prioridad !== 0) return prioridad;
		return ordenarNroObraAsc(a, b);
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
					className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400 mb-4"
					placeholder="Filtrar por nro, detalle, estado o dirección..."
					value={filtro}
					onChange={(e) => setFiltro(e.target.value)}
				/>
				<div className="flex flex-col sm:flex-row gap-2">
					<button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer" onClick={() => navigate('/crear-obra')}>Agregar Obra</button>
					<button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer" onClick={handleGenerarPdfPanel}>Generar PDF</button>
					<button className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer" onClick={() => navigate('/obras/diagrama')}>Diagrama de Gantt</button>
				</div>
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
						{obrasOrdenadas.length > 0 ? (
							obrasOrdenadas.map((obra) => (
								<tr key={obra.id} className="hover:bg-gray-200 transition-colors duration-150">
									<td className="whitespace-nowrap text-lg text-gray-800 px-6 py-4">{obra.nro_obra ?? "-"}</td>
									<td className="text-left text-lg text-gray-800 px-6 py-4 max-w-xl break-words">{fixMojibake(obra.detalle ?? "Sin detalle")}</td>
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

