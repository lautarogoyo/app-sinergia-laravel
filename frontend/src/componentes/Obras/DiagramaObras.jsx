import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useObras } from "../hooks/useObras.jsx";
import Icon from "../Icons/Icons";

const DAY_MS = 24 * 60 * 60 * 1000;

const toDateOnly = (value) => {
	if (!value) return null;
	const parsed = new Date(String(value).split("T")[0]);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const diffDays = (a, b) => Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS);

const formatLabel = (date) =>
	`${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;

const formatDateShort = (date) =>
	`${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(
		date.getFullYear()
	).slice(-2)}`;

const compareNroObraAsc = (a, b) =>
	String(a.nro_obra ?? "").localeCompare(String(b.nro_obra ?? ""), undefined, {
		numeric: true,
		sensitivity: "base",
	});

export default function DiagramaObras() {
	const navigate = useNavigate();
	const { data: obrasData = [], isLoading } = useObras();

	const obrasConRango = useMemo(
		() =>
			obrasData
				.filter((obra) => {
					const estado = (obra.estado || "").toLowerCase().replaceAll("_", "");
					return estado === "encurso";
				})
				.map((obra) => {
					const inicio = toDateOnly(obra.fecha_programacion_inicio);
					const fin = toDateOnly(obra.fecha_recepcion_provisoria);
					if (!inicio || !fin) return null;
					if (fin < inicio) return null;
					return {
						...obra,
						inicio,
						fin,
						gruposTexto:
							obra.grupos && obra.grupos.length > 0
								? obra.grupos.map((g) => g.denominacion).join(", ")
								: "Sin grupos",
					};
				})
				.filter(Boolean)
				.sort(compareNroObraAsc),
		[obrasData]
	);

	const { timelineInicio, timelineFin, dias } = useMemo(() => {
		if (!obrasConRango.length) return { timelineInicio: null, timelineFin: null, dias: [] };
		const inicioMs = Math.min(...obrasConRango.map((o) => o.inicio.getTime()));
		const finMs = Math.max(...obrasConRango.map((o) => o.fin.getTime()));
		const inicio = new Date(inicioMs);
		const fin = new Date(finMs);
		const total = diffDays(inicio, fin) + 1;
		const listadoDias = Array.from({ length: total }, (_, i) => new Date(inicio.getTime() + i * DAY_MS));
		return { timelineInicio: inicio, timelineFin: fin, dias: listadoDias };
	}, [obrasConRango]);

	if (isLoading) {
		return (
			<div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
				<div className="relative">
					<div className="mt-8 text-center">
						<h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Diagrama</h2>
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

	return (
		<div className="min-h-screen bg-gray-100 p-6 md:p-8">
			<div className="max-w-[1800px] mx-auto">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
					<div>
						<h1 className="text-3xl font-extrabold text-gray-800">Diagrama de Gantt</h1>
						<p className="text-sm text-gray-600">
							Gantt de obras desde fecha programacion inicio hasta fecha recepcion provisoria.
						</p>
					</div>
					<button
						type="button"
						onClick={() => navigate("/obras")}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-800"
					>
						<Icon name="arrow-left" className="w-4 h-4" />
						Volver a Obras
					</button>
				</div>

				{!obrasConRango.length ? (
					<div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600">
						No hay obras con fecha programacion inicio y fecha recepcion provisoria para mostrar en el diagrama.
					</div>
				) : (
					<div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
						<div className="overflow-x-auto">
							<div className="min-w-max">
								<div className="flex border-b border-gray-300 bg-gray-50 sticky top-0 z-10">
									<div className="w-80 min-w-80 px-4 py-3 font-semibold text-gray-800 border-r border-gray-300">
										Obra
									</div>
									<div
										className="grid"
										style={{ gridTemplateColumns: `repeat(${dias.length}, minmax(40px, 40px))` }}
									>
										{dias.map((dia) => (
											<div
												key={`h-${dia.toISOString()}`}
												className="h-12 px-1 border-r border-gray-200 text-[11px] text-gray-600 flex items-center justify-center"
												title={dia.toISOString().split("T")[0]}
											>
												{formatLabel(dia)}
											</div>
										))}
									</div>
								</div>

								{obrasConRango.map((obra) => {
									const offsetInicio = diffDays(timelineInicio, obra.inicio);
									const duracionDias = diffDays(obra.inicio, obra.fin) + 1;
									const leftPct = (offsetInicio / dias.length) * 100;
									const widthPct = (duracionDias / dias.length) * 100;

									return (
										<div key={obra.id} className="flex border-b border-gray-200 last:border-b-0">
											<div className="w-80 min-w-80 px-4 py-3 border-r border-gray-200 bg-white">
												<div className="font-semibold text-gray-900">#{obra.nro_obra ?? "-"}</div>
												<div className="text-sm text-gray-600">{obra.detalle || "Sin detalle"}</div>
											</div>

											<div className="relative h-16" style={{ width: `${dias.length * 40}px` }}>
												<div
													className="absolute inset-0 grid"
													style={{ gridTemplateColumns: `repeat(${dias.length}, minmax(40px, 40px))` }}
												>
													{dias.map((dia) => (
														<div key={`g-${obra.id}-${dia.toISOString()}`} className="border-r border-gray-100" />
													))}
												</div>
												<div
													className="absolute top-1/2 -translate-y-1/2 h-9 rounded-md bg-blue-500 text-white text-xl font-semibold flex items-center justify-center px-2 truncate"
													style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
													title={obra.gruposTexto}
												>
													{obra.gruposTexto}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
						<div className="px-4 py-2 bg-gray-50 text-xs text-gray-600 border-t border-gray-200">
							Rango total: {timelineInicio ? formatDateShort(timelineInicio) : "-"} al {timelineFin ? formatDateShort(timelineFin) : "-"}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
