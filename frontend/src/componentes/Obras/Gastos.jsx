import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Icon from "../Icons/Icons";
import { fixMojibake } from "../utils/text";
import { fetchGastosByObra, upsertProyeccionGasto } from "../api/gastos";

const fmt = (n) =>
  `$${Number(n ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;

const formatMiles = (value) => {
  if (value === "" || value == null) return "";
  const [entero, decimal] = String(value).split(".");
  const enteroFormateado = entero.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decimal !== undefined ? `${enteroFormateado},${decimal}` : enteroFormateado;
};

const parseMiles = (value) =>
  value.replace(/\./g, "").replace(",", ".");

const fmtFecha = (fecha) =>
  fecha
    ? new Date(fecha.slice(0, 10) + "T00:00:00").toLocaleDateString("es-AR", {
      day: "2-digit", month: "2-digit", year: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    })
    : "-";

export default function Gastos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [proyeccion, setProyeccion] = useState("");
  const [mostrarFacturas, setMostrarFacturas] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["gastos", id],
    queryFn: () => fetchGastosByObra(id),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setProyeccion(data.importe_proyeccion ?? "");
    }
  }, [data]);

  const guardarProyeccionMutation = useMutation({
    mutationFn: (importe) => upsertProyeccionGasto(id, importe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gastos", id] });
      Swal.fire({ icon: "success", title: "Guardado", text: "Importe proyección actualizado", timer: 1500, showConfirmButton: false });
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Error al guardar el importe proyección";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    },
  });

  const handleGuardarProyeccion = (e) => {
    e.preventDefault();
    if (proyeccion === "" || Number(proyeccion) < 0) {
      Swal.fire({ icon: "warning", title: "Importe inválido", text: "Ingrese un importe proyección válido" });
      return;
    }
    guardarProyeccionMutation.mutate(proyeccion);
  };

  if (isLoading) {
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

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">Error al cargar los gastos de la obra</div>
      </div>
    );
  }

  const { obra, gasto_mano_obra, gasto_material, gasto_total, facturas } = data;
  const proyeccionNum = Number(data.importe_proyeccion ?? 0);
  const diferencia = proyeccionNum - gasto_total;
  const porcentajeGastado = proyeccionNum > 0 ? (gasto_total / proyeccionNum) * 100 : 0;
  const porcentaje = Math.min(porcentajeGastado, 100);
  const excedido = proyeccionNum > 0 && gasto_total > proyeccionNum;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-gray-50 to-white">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/obras")} className="text-gray-600 hover:text-gray-800" type="button">
              <Icon name="arrow-left" className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Gastos - Obra #{obra.nro_obra} – {fixMojibake(obra.detalle ?? "Sin detalle")}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Proyección vs. Real</h2>
          <form onSubmit={handleGuardarProyeccion} className="flex flex-col sm:flex-row gap-3 sm:items-end mb-4">
            <div className="flex flex-col">
              <label htmlFor="proyeccion" className="mb-1 text-sm font-medium text-gray-700">
                Importe proyección
              </label>
              <input
                id="proyeccion"
                type="text"
                inputMode="decimal"
                className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 w-56"
                value={formatMiles(proyeccion)}
                onChange={(e) => setProyeccion(parseMiles(e.target.value))}
              />
            </div>
            <button
              type="submit"
              disabled={guardarProyeccionMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition duration-150 disabled:opacity-50"
            >
              {guardarProyeccionMutation.isPending ? "Guardando..." : "Guardar"}
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500">Mano de Obra</div>
              <div className="text-2xl font-bold text-gray-800">{fmt(gasto_mano_obra)}</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500">Material</div>
              <div className="text-2xl font-bold text-gray-800">{fmt(gasto_material)}</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Real</div>
              <div className="text-2xl font-bold text-gray-800">{fmt(gasto_total)}</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full ${excedido ? "bg-red-500" : "bg-green-500"}`}
              style={{ width: `${porcentaje}%` }}
            ></div>
          </div>
          <div className={`mt-2 text-sm font-semibold ${excedido ? "text-red-600" : "text-gray-700"}`}>
            {porcentajeGastado.toFixed(1)}% gastado
            {" – "}
            {excedido
              ? `Excedido en ${fmt(Math.abs(diferencia))}`
              : `Disponible: ${fmt(diferencia)}`}
          </div>
        </div>

        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => setMostrarFacturas((prev) => !prev)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition duration-150"
          >
            {mostrarFacturas ? "Ocultar facturas" : "Ver facturas"}
          </button>
        </div>

        {mostrarFacturas && (
          <div className="table-card">
            <div className="table-card__viewport overflow-x-auto">
              <table className="min-w-max w-full">
                <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-lg font-bold text-gray-100 border-b border-gray-500">Fecha</th>
                    <th className="px-6 py-3 text-left text-lg font-bold text-gray-100 border-b border-gray-500">Nro. Factura</th>
                    <th className="px-6 py-3 text-left text-lg font-bold text-gray-100 border-b border-gray-500">Tipo</th>
                    <th className="px-6 py-3 text-left text-lg font-bold text-gray-100 border-b border-gray-500">Categoría</th>
                    <th className="px-6 py-3 text-left text-lg font-bold text-gray-100 border-b border-gray-500">Proveedor / Grupo</th>
                    <th className="px-6 py-3 text-left text-lg font-bold text-gray-100 border-b border-gray-500">Importe</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-50 divide-y divide-gray-200 text-left">
                  {facturas.length > 0 ? (
                    facturas.map((f) => {
                      const esManoObra = Boolean(f.nro_oc);
                      const importe =
                        f.tipo_factura === "A" && f.impuestos?.neto_gral != null
                          ? Number(f.impuestos.neto_gral)
                          : Number(f.importe_total);
                      return (
                        <tr key={f.nro_factura} className="hover:bg-gray-200 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">{fmtFecha(f.fecha)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{f.nro_factura}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{f.tipo_factura}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded text-sm font-bold ${esManoObra ? "bg-blue-800 text-white" : "bg-orange-400 text-white"}`}>
                              {esManoObra ? "MANO DE OBRA" : "MATERIAL"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-left">{f.proveedor?.nombre_apellido ?? f.grupo?.nombre_apellido ?? "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold text-right">{fmt(importe)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No hay facturas para esta obra
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
