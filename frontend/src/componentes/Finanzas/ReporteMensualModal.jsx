import { useState } from "react";
import { fetchFacturasReporteMensual } from "../api/facturas";
import { generarPdfFacturasMensual } from "./FacturasPdf";
import Swal from "sweetalert2";

const MESES = [
  { v: 1, l: "Enero" }, { v: 2, l: "Febrero" }, { v: 3, l: "Marzo" },
  { v: 4, l: "Abril" }, { v: 5, l: "Mayo" },    { v: 6, l: "Junio" },
  { v: 7, l: "Julio" }, { v: 8, l: "Agosto" },  { v: 9, l: "Septiembre" },
  { v: 10, l: "Octubre" }, { v: 11, l: "Noviembre" }, { v: 12, l: "Diciembre" },
];

const now = new Date();

export default function ReporteMensualModal({ onClose, accentColor = "emerald" }) {
  const [mes, setMes]            = useState(now.getMonth() + 1);
  const [anio, setAnio]          = useState(now.getFullYear());
  const [tipo_factura, setTipo]  = useState("");
  const [empresa, setEmpresa]    = useState("");
  const [loading, setLoading]    = useState(false);

  const ring    = accentColor === "amber" ? "focus:ring-amber-400" : "focus:ring-emerald-400";
  const btnCls  = accentColor === "amber"
    ? "bg-amber-600 hover:bg-amber-700"
    : "bg-emerald-600 hover:bg-emerald-700";

  const handleGenerar = async () => {
    setLoading(true);
    try {
      const result = await fetchFacturasReporteMensual({
        mes,
        anio,
        ...(tipo_factura && { tipo_factura }),
        ...(empresa && { empresa }),
      });

      if (!result.facturas.length) {
        await Swal.fire({ icon: "info", title: "Sin datos", text: "No hay facturas con los filtros seleccionados." });
        return;
      }

      generarPdfFacturasMensual(result.facturas, { mes, anio, tipo_factura, empresa });
      onClose();
    } catch (e) {
      Swal.fire({ icon: "error", title: "Error", text: e.response?.data?.message || e.message });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${ring}`;
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">Imprimir facturas del mes</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none cursor-pointer">×</button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelCls}>Mes *</label>
              <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className={inputCls}>
                {MESES.map((m) => <option key={m.v} value={m.v}>{m.l}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className={labelCls}>Año *</label>
              <input
                type="number"
                value={anio}
                onChange={(e) => setAnio(Number(e.target.value))}
                min={2020}
                max={2099}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Tipo de factura</label>
            <select value={tipo_factura} onChange={(e) => setTipo(e.target.value)} className={inputCls}>
              <option value="">— Todos —</option>
              <option value="A">A</option>
              <option value="C">C</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Empresa</label>
            <select value={empresa} onChange={(e) => setEmpresa(e.target.value)} className={inputCls}>
              <option value="">— Todas —</option>
              <option value="GOYOAGA">Goyoaga</option>
              <option value="PROTECDUR">Protecdur</option>
              <option value="SINERGIA">Sinergia</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleGenerar}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded-lg text-white font-semibold shadow cursor-pointer disabled:opacity-60 ${btnCls}`}
          >
            {loading ? "Generando..." : "Generar PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}