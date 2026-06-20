import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { fetchImpuestos, upsertImpuestos } from "../api/facturas";

const inp = "w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400";
const lbl = "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide";

const calcDefaults = (factura, imp) => {
    if (imp) return imp;
    const total = Number(factura.importe_total);
    if (factura.tipo_factura === "A") {
        const netoGral = parseFloat((total / 1.21).toFixed(2));
        return {
            neto_gral:         netoGral,
            iva_gral_alicuota: 21,
            iva_gral_importe:  parseFloat((total - netoGral).toFixed(2)),
        };
    }
    return {};
};

const CAMPOS_CALC = [
    "neto_gral","neto_dif","neto_spub",
    "iva_gral_importe","iva_dif_importe","iva_spub_importe",
    "no_gravado_monotrib","no_gravado_exento",
    "perc_iva","perc_iibb","perc_otras",
    "ret_iva","ret_iibb","ret_gcias","ret_otras",
    "imp_internos","itc","varios",
];

export default function FacturaImpuestosModal({ factura, obraId, onClose }) {
    const queryClient = useQueryClient();

    const { data: impuestos } = useQuery({
        queryKey: ["impuestos", factura.nro_factura],
        queryFn: () => fetchImpuestos(obraId, factura.nro_factura),
        refetchOnWindowFocus: false,
    });

    const { register, handleSubmit, watch, reset } = useForm({
        defaultValues: calcDefaults(factura, null),
    });

    useEffect(() => {
        if (impuestos) reset(calcDefaults(factura, impuestos));
    }, [impuestos]);

    const mutation = useMutation({
        mutationFn: (payload) => upsertImpuestos(obraId, factura.nro_factura, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["facturas", obraId] });
            queryClient.invalidateQueries({ queryKey: ["impuestos", factura.nro_factura] });
            Swal.fire({ icon: "success", title: "Datos fiscales guardados", timer: 1500, showConfirmButton: false });
            onClose();
        },
        onError: (e) => Swal.fire({ icon: "error", title: "Error", text: e.response?.data?.message || e.message }),
    });

    const valores = watch(CAMPOS_CALC);
    const totalCalculado = CAMPOS_CALC.reduce((acc, k, i) => acc + (Number(valores[i]) || 0), 0);
    const diferencia = totalCalculado - Number(factura.importe_total);
    const coincide = Math.abs(diferencia) < 0.01;

    const esA = factura.tipo_factura === "A";

    const seccion = (titulo, color, children) => (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className={`px-4 py-2 text-sm font-semibold border-b border-gray-200 bg-gray-50 border-l-4 ${color}`}>
                {titulo}
            </div>
            <div className="p-3">{children}</div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-slate-800 text-white">
                    <div className="flex items-center gap-3">
                        <span className="bg-slate-600 text-slate-300 text-sm font-bold px-2 py-1 rounded">
                            {factura.tipo_factura}
                        </span>
                        <div>
                            <p className="text-base font-semibold">Factura #{factura.nro_factura} — Datos impositivos</p>
                            <p className="text-sm text-slate-400">
                                {factura.proveedor?.nombre_apellido ?? factura.grupo?.nombre_apellido} · {factura.empresa} · {factura.fecha?.split("T")[0] ?? factura.fecha}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
                </div>

                {/* Info strip */}
                <div className="flex border-b border-gray-200 bg-gray-50 divide-x divide-gray-200">
                    {[
                        ["Empresa",      factura.empresa],
                        ["CUIT",         factura.proveedor?.cuit ?? "—"],
                        ["Razón social", factura.proveedor?.nombre_apellido ?? factura.grupo?.nombre_apellido],
                        ["Forma pago",   factura.forma_pago],
                        ["Importe",      `$${Number(factura.importe_total).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`],
                    ].map(([l, v]) => (
                        <div key={l} className="px-5 py-3 flex flex-col gap-0.5">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">{l}</span>
                            <span className="text-sm font-semibold text-gray-700">{v}</span>
                        </div>
                    ))}
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex-1 overflow-y-auto p-5 space-y-4">

                    <div className="grid grid-cols-2 gap-4">

                        {/* Columna izquierda */}
                        <div className="space-y-4">
                            {seccion("Imp. Neto Gravado", "border-l-emerald-500 text-emerald-700",
                                <div className="grid grid-cols-3 gap-3">
                                    {[["neto_gral","Al. Gral"],["neto_dif","Al. Dif."],["neto_spub","Al. S.Púb"]].map(([n, l]) => (
                                        <div key={n}>
                                            <label className={lbl}>{l}</label>
                                            <input {...register(n)} type="number" step="0.01" placeholder="0.00" className={inp} />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {seccion("No Gravados", "border-l-violet-500 text-violet-700",
                                <div className="grid grid-cols-2 gap-3">
                                    {[["no_gravado_monotrib","Monotrib."],["no_gravado_exento","Exentos"]].map(([n, l]) => (
                                        <div key={n}>
                                            <label className={lbl}>{l}</label>
                                            <input {...register(n)} type="number" step="0.01" placeholder="0.00" className={inp} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Columna derecha */}
                        <div className="space-y-4">
                            {esA && seccion("IVA Crédito", "border-l-teal-500 text-teal-700",
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 font-semibold px-0.5">
                                        <span></span>
                                        <span className="text-center">Alícuota %</span>
                                        <span className="text-center">Importe</span>
                                    </div>
                                    {[
                                        ["Al. Gral", "iva_gral_alicuota", "iva_gral_importe"],
                                        ["Al. Dif.", "iva_dif_alicuota",  "iva_dif_importe"],
                                        ["S.Púb.",   "iva_spub_alicuota", "iva_spub_importe"],
                                    ].map(([l, na, ni]) => (
                                        <div key={l} className="grid grid-cols-3 gap-2 items-center">
                                            <span className="text-sm font-medium text-gray-500">{l}</span>
                                            <input {...register(na)} type="number" step="0.01" placeholder="0" className={inp + " text-center"} />
                                            <input {...register(ni)} type="number" step="0.01" placeholder="0.00" className={inp} />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {seccion("Percepciones", "border-l-amber-500 text-amber-700",
                                <div className="grid grid-cols-3 gap-3">
                                    {[["perc_iva","Perc. IVA"],["perc_iibb","Perc. IIB"],["perc_otras","Otras"]].map(([n, l]) => (
                                        <div key={n}>
                                            <label className={lbl}>{l}</label>
                                            <input {...register(n)} type="number" step="0.01" placeholder="0.00" className={inp} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {seccion("Retenciones", "border-l-orange-500 text-orange-700",
                            <div className="grid grid-cols-4 gap-3">
                                {[["ret_iva","Ret. IVA"],["ret_iibb","Ret. IIB"],["ret_gcias","Ret. Gcias"],["ret_otras","Otras"]].map(([n, l]) => (
                                    <div key={n}>
                                        <label className={lbl}>{l}</label>
                                        <input {...register(n)} type="number" step="0.01" placeholder="0.00" className={inp} />
                                    </div>
                                ))}
                            </div>
                        )}
                        {seccion("Otros Conceptos", "border-l-slate-400 text-slate-600",
                            <div className="grid grid-cols-3 gap-3">
                                {[["imp_internos","Imp. Internos"],["itc","ITC"],["varios","Varios"]].map(([n, l]) => (
                                    <div key={n}>
                                        <label className={lbl}>{l}</label>
                                        <input {...register(n)} type="number" step="0.01" placeholder="0.00" className={inp} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide">Total calculado</p>
                                <p className="text-xl font-semibold text-emerald-600">
                                    ${totalCalculado.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="w-px h-10 bg-gray-200" />
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide">Importe factura</p>
                                <p className="text-xl font-semibold text-gray-700">
                                    ${Number(factura.importe_total).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="w-px h-10 bg-gray-200" />
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide">Diferencia</p>
                                <p className={`text-base font-semibold ${coincide ? "text-emerald-600" : "text-red-500"}`}>
                                    {coincide
                                        ? "✓ Coincide"
                                        : `${diferencia > 0 ? "+" : ""}${diferencia.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                                Cancelar
                            </button>
                            <button type="submit" disabled={mutation.isPending} className="px-5 py-2.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold disabled:opacity-60">
                                {mutation.isPending ? "Guardando..." : "Guardar datos fiscales"}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}