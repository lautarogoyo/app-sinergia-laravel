import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const EMPRESAS = {
  GOYOAGA: "Goyoaga",
  SINERGIA: "Sinergia",
  PROTECDUR: "Protecdur",
};

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

const fmt = (n) =>
  `$${Number(n ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;

const fmtFecha = (fecha) =>
  fecha
    ? new Date(fecha.slice(0, 10) + "T00:00:00").toLocaleDateString("es-AR", {
        day: "2-digit", month: "2-digit", year: "2-digit",
        timeZone: "America/Argentina/Buenos_Aires",
      })
    : "-";

const HEAD_1_STYLE = { halign: "center", fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: "bold", fontSize: 8 };
const HEAD_2_STYLE = { halign: "center", fillColor: [180, 180, 180], textColor: [0, 0, 0], fontStyle: "bold", fontSize: 7 };
const FOOT_STYLE  = { halign: "right", fontStyle: "bold" };

// ─── A / B ───────────────────────────────────────────────────────────────────

const generarPdfAB = (facturas, { mes, anio, tipo_factura, empresa }, doc) => {
  const titulo = [
    "Facturas",
    tipo_factura ? `${tipo_factura}` : null,
    empresa ? `- ${EMPRESAS[empresa] ?? empresa}` : null,
    `- ${MESES[mes - 1]} ${anio}`,
  ].filter(Boolean).join(" ");

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(titulo, 14, 16);

  const rows = facturas.map((f) => {
    const neto = parseFloat(f.impuestos?.neto_gral)       || 0;
    const iva  = parseFloat(f.impuestos?.iva_gral_importe) || 0;

    return [
      fmtFecha(f.fecha),
      f.tipo_factura ?? "-",
      f.nro_factura  ?? "-",
      f.proveedor?.cuit ?? "-",
      f.proveedor?.nombre_apellido ?? f.grupo?.nombre_apellido ?? "-",
      fmt(neto),
      "",
      "",
      f.alicuota_iva != null ? `${f.alicuota_iva}%` : "-",
      fmt(iva),
    ];
  });

  autoTable(doc, {
    startY: 22,
    head: [
      [
        { content: "COMPROBANTE",            colSpan: 3, styles: HEAD_1_STYLE },
        { content: "PROVEEDOR",              colSpan: 2, styles: HEAD_1_STYLE },
        { content: "Imp. Neto Gravado",      colSpan: 3, styles: HEAD_1_STYLE },
        { content: "IVA CRÉDITO (AI. Gral)", colSpan: 2, styles: HEAD_1_STYLE },
      ],
      [
        { content: "Fecha",        styles: HEAD_2_STYLE },
        { content: "Tipo",         styles: HEAD_2_STYLE },
        { content: "Nro. Factura", styles: HEAD_2_STYLE },
        { content: "CUIT",         styles: HEAD_2_STYLE },
        { content: "Razón Social", styles: HEAD_2_STYLE },
        { content: "Al. Gral.",    styles: { ...HEAD_2_STYLE, halign: "right" } },
        { content: "AI.Dif.",      styles: HEAD_2_STYLE },
        { content: "AI.S.Pub",     styles: HEAD_2_STYLE },
        { content: "Alíc.",        styles: HEAD_2_STYLE },
        { content: "Importe",      styles: { ...HEAD_2_STYLE, halign: "right" } },
      ],
    ],
    headStyles: { lineWidth: 0 },
    body: rows,
    foot: [[
      { content: "TOTAL", colSpan: 9, styles: FOOT_STYLE },
      {
        content: fmt(facturas.reduce((s, f) => s + (parseFloat(f.importe_total) || 0), 0)),
        styles: FOOT_STYLE,
      },
    ]],
    showFoot: "lastPage",
    theme: "plain",
    footStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 7.5, cellPadding: 2, textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 22, halign: "center" },
      1: { cellWidth: 12, halign: "center" },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 28, halign: "center" },
      4: { cellWidth: 52 },
      5: { cellWidth: 26, halign: "right" },
      6: { cellWidth: 18, halign: "right" },
      7: { cellWidth: 18, halign: "right" },
      8: { cellWidth: 14, halign: "center" },
      9: { cellWidth: 26, halign: "right" },
    },
  });

  const mes2 = String(mes).padStart(2, "0");
  doc.save(`facturas_${empresa ?? "todas"}_${tipo_factura ?? "AB"}_${mes2}_${anio}.pdf`);
};

// ─── C ───────────────────────────────────────────────────────────────────────

const generarPdfC = (facturas, { mes, anio, empresa }, doc) => {
  const titulo = [
    "Facturas C",
    empresa ? `- ${EMPRESAS[empresa] ?? empresa}` : null,
    `- ${MESES[mes - 1]} ${anio}`,
  ].filter(Boolean).join(" ");

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(titulo, 14, 16);

  const rows = facturas.map((f) => [
    fmtFecha(f.fecha),
    f.proveedor?.nombre_apellido ?? f.grupo?.nombre_apellido ?? "-",
    f.proveedor?.cuit ?? f.grupo?.cuit ?? "-",
    f.nro_factura ?? "-",
    fmt(f.importe_total),
  ]);

  const HEAD_C_STYLE = { halign: "center", fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: "bold", fontSize: 7.5 };

  autoTable(doc, {
    startY: 22,
    head: [[
      { content: "Fecha",        styles: HEAD_C_STYLE },
      { content: "Razón Social", styles: HEAD_C_STYLE },
      { content: "CUIT",         styles: HEAD_C_STYLE },
      { content: "Nro. Factura", styles: HEAD_C_STYLE },
      { content: "Importe",      styles: { ...HEAD_C_STYLE, halign: "right" } },
    ]],
    body: rows,
    foot: [[
      { content: "TOTAL", colSpan: 4, styles: FOOT_STYLE },
      {
        content: fmt(facturas.reduce((s, f) => s + (parseFloat(f.importe_total) || 0), 0)),
        styles: FOOT_STYLE,
      },
    ]],
    showFoot: "lastPage",
    theme: "plain",
    headStyles: { lineWidth: 0 },
    footStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 7.5, cellPadding: 2, textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 28, halign: "center" },
      1: { cellWidth: 70 },
      2: { cellWidth: 35, halign: "center" },
      3: { cellWidth: 40 },
      4: { cellWidth: 35, halign: "right" },
    },
  });

  const mes2 = String(mes).padStart(2, "0");
  doc.save(`facturas_C_${empresa ?? "todas"}_${mes2}_${anio}.pdf`);
};

// ─── Export principal ─────────────────────────────────────────────────────────

export const generarPdfFacturasMensual = (facturas, filtros) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  if (filtros.tipo_factura === "C") {
    generarPdfC(facturas, filtros, doc);
  } else {
    generarPdfAB(facturas, filtros, doc);
  }
};