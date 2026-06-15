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

export const generarPdfFacturasMensual = (facturas, { mes, anio, tipo_factura, empresa }) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const titulo = [
    `Facturas — ${MESES[mes - 1]} ${anio}`,
    tipo_factura ? `Tipo ${tipo_factura}` : null,
    empresa ? EMPRESAS[empresa] : null,
  ].filter(Boolean).join(" · ");

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(titulo, 14, 16);

  const totalStr = `Total: $${Number(facturas.reduce((s, f) => s + Number(f.importe_total), 0)).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(totalStr, doc.internal.pageSize.width - 14, 16, { align: "right" });

  const rows = facturas.map((f) => [
    f.nro_factura,
    f.fecha ? new Date(f.fecha + "T00:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit", timeZone: "America/Argentina/Buenos_Aires" }) : "-",
    f.tipo_factura,
    f.empresa,
    f.nro_obra,
    f.nro_oc ?? "-",
    f.proveedor?.nombre_apellido ?? f.grupo?.nombre_apellido ?? "-",
    f.forma_pago,
    `$${Number(f.importe_total).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
  ]);

  autoTable(doc, {
    startY: 22,
    head: [["Nro. Factura", "Fecha", "Tipo", "Empresa", "Obra", "OC", "Proveedor / Grupo", "Forma Pago", "Importe"]],
    body: rows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2, lineColor: [0,0,0], lineWidth: 0.2 },
    headStyles: { fillColor: [50, 50, 50], textColor: [255,255,255], fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 22, halign: "center" },
      2: { cellWidth: 14, halign: "center" },
      3: { cellWidth: 24, halign: "center" },
      4: { cellWidth: 22 },
      5: { cellWidth: 20 },
      6: { cellWidth: 50 },
      7: { cellWidth: 26, halign: "center" },
      8: { cellWidth: 28, halign: "right" },
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  const mes2 = String(mes).padStart(2, "0");
  doc.save(`facturas_${empresa ?? "todas"}_${tipo_factura ?? "AB"}_${mes2}_${anio}.pdf`);
};