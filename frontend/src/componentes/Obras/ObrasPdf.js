import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import { fixMojibake } from "../utils/text";

const SINERGIA_LOGO_URL = "https://static.wixstatic.com/media/739f6f_72ea3433f31a45448cf67888b8f5f6e3~mv2.png/v1/fill/w_89,h_84,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/iczzlYy_edited.png";

const formatearFecha = (fecha) => {
	if (!fecha) return "-";
	try {
		const fechaSolo = fecha.split("T")[0];
		const partes = fechaSolo.split("-");

		if (partes.length === 3) {
			const year = partes[0].slice(-2);
			const month = partes[1].padStart(2, "0");
			const day = partes[2].padStart(2, "0");
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
	return `${d}${m}${y}`;
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
	}
	doc.setDrawColor(0, 0, 0);
	doc.setLineWidth(0.35);
	doc.line(0, 1.2, pageW, 1.2);
};

const buildColumnStylesFromHeaders = (doc, columns, baseStyles = {}, options = {}) => {
	const {
		padding = 4,
		font = "helvetica",
		fontStyle = "bold",
		fontSize = 8,
	} = options;

	doc.setFont(font, fontStyle);
	doc.setFontSize(fontSize);

	return columns.reduce((styles, column) => {
		const baseStyle = baseStyles[column.dataKey] || {};
		const titleWidth = Math.ceil(doc.getTextWidth(column.header) + padding);
		const baseWidth = typeof baseStyle.cellWidth === "number" ? baseStyle.cellWidth : 0;

		styles[column.dataKey] = {
			...baseStyle,
			cellWidth: Math.max(titleWidth, baseWidth),
		};

		return styles;
	}, {});
};

const sumColumnWidths = (columnStyles) =>
	Object.values(columnStyles).reduce((total, style) => total + (Number(style.cellWidth) || 0), 0);

const buildPageWidthFromTable = (columnStyles, margin = {}, extraWidth = 10) => {
	const left = margin.left || 0;
	const right = margin.right || 0;
	return sumColumnWidths(columnStyles) + left + right + extraWidth;
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
	const columns = [
		{ header: "Nro", dataKey: "nro_obra" },
		{ header: "Detalle", dataKey: "detalle" },
		{ header: "Comentarios", dataKey: "comentario" },
		{ header: "Grupo cotiza", dataKey: "grupo_cotiza" },
		{ header: "Fecha visto", dataKey: "fecha_visto" },
		{ header: "Fecha inicio O.C", dataKey: "fecha_inicio_oc" },
		{ header: "Inicio", dataKey: "fecha_inicio" },
		{ header: "Finalizacion Nos", dataKey: "fecha_fin_nos" },
		{ header: "Finalizacion O.C", dataKey: "fecha_fin_oc" },
		{ header: "Caratula", dataKey: "caratula" },
		{ header: "Nro O.C", dataKey: "nro_oc" },
		{ header: "Grupo Trabajo O.C", dataKey: "grupo_trabajo_oc" },
		{ header: "Dias atraso", dataKey: "atraso" },
	];
	const tableMargin = { top: 38, left: 4, right: 4, bottom: 4 };
	const tempDoc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
	const columnStyles = buildColumnStylesFromHeaders(
		tempDoc,
		columns,
		{
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
		{
			padding: 4.5,
			fontSize: 8,
		}
	);
	const pageWidth = buildPageWidthFromTable(columnStyles, tableMargin, 12);
	const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [297, pageWidth] });
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
		margin: tableMargin,
		tableWidth: pageW - 8,
		columns,
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
		columnStyles,
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
	const columns = [
		{ header: "Nro de obra", dataKey: "nro_obra" },
		{ header: "Detalle", dataKey: "detalle" },
		{ header: "Comentarios (ultimo)", dataKey: "comentario" },
		{ header: "Grupo cotiza", dataKey: "grupo_cotiza" },
		{ header: "Fecha visto", dataKey: "fecha_visto" },
		{ header: "Fecha cierre", dataKey: "fecha_cierre" },
	];
	const tableMargin = { top: 30, left: 6, right: 6, bottom: 6 };
	const tempDoc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
	const columnStyles = buildColumnStylesFromHeaders(
		tempDoc,
		columns,
		{
			nro_obra: { cellWidth: 12 },
			detalle: { cellWidth: 94 },
			comentario: { cellWidth: 58 },
			grupo_cotiza: { cellWidth: 39 },
			fecha_visto: { cellWidth: 14 },
			fecha_cierre: { fillColor: [255, 255, 0] },
		},
		{
			padding: 5,
			fontSize: 7.2,
		}
	);
	const pageWidth = buildPageWidthFromTable(columnStyles, tableMargin, 12);
	const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [210, pageWidth] });
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
		margin: tableMargin,
		columns,
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
		columnStyles,
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

export const generarPdfPanelObras = async (obrasOrdenadas) => {
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

export { formatearFecha };
