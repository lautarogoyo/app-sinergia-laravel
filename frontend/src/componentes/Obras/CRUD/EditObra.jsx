import { useNavigate, useParams } from "react-router-dom";
import { useObraById } from "../../hooks/useObras.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateObra } from "../../api/obras.js";
import { useForm, useController } from "react-hook-form";
import { useEffect, useRef } from "react";
import GruposSelect from "../../shared/GruposSelect.jsx";

export default function EditObra() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const submitLock = useRef(false);

    const { register, handleSubmit, reset, control } = useForm({
        defaultValues: {
            nro_obra: "",
            detalle: "",
            estado_obra_id: "1",
            fecha_visto: "",
            fecha_ingreso: "",
            grupo_ids: [],
        }
    });

    const { field: gruposField } = useController({ name: "grupo_ids", control });

    const { data: obra, isLoading } = useObraById(id);

    const formatearFechaInput = (fecha) => {
        if (!fecha) return "";
        try {
            return new Date(fecha).toISOString().split('T')[0];
        } catch {
            return "";
        }
    };

    useEffect(() => {
        if (obra) {
            reset({
                nro_obra: obra.nro_obra || "",
                detalle: obra.detalle || "",
                estado_obra_id: String(obra.estado_obra_id || "1"),
                fecha_visto: formatearFechaInput(obra.fecha_visto),
                fecha_ingreso: formatearFechaInput(obra.fecha_ingreso),
                grupo_ids: (obra.grupos || []).map(g => g.grupo_id),
            });
        }
    }, [obra, reset]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => UpdateObra(id, { ...data, grupo_id: data.grupo_ids }),
        onSuccess: () => {
            queryClient.invalidateQueries(["obras"]);
            navigate("/obras");
        },
        onError: (error) => {
            console.error("Error al editar la obra", error);
        }
    });

    const onSubmit = handleSubmit((data) => {
        if (submitLock.current) return;
        submitLock.current = true;
        mutate(data);
    });

    return (
        <>
            {isLoading &&
                <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
                    <div className="relative">
                        <div className="mt-8 text-center">
                            <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Obra</h2>
                            <div className="w-80 h-3 bg-gray-700 rounded-full overflow-hidden shadow-lg">
                                <div className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full animate-loading-bar"></div>
                            </div>
                            <div className="mt-4 flex justify-center gap-2">
                                <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {!isLoading && (
                <div className="p-8 bg-gray-100 w-full flex flex-col items-center">
                    <h1 className="text-3xl text-gray-800 mb-6 font-sans">Editar Obra</h1>
                    <form className="w-full max-w-xl bg-white shadow-2xl rounded-xl border border-gray-200 p-6 space-y-4" onSubmit={onSubmit}>

                        {/* Nro Obra */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nro_obra">
                                Nro. Obra
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
                                id="nro_obra"
                                type="text"
                                disabled
                                {...register("nro_obra")}
                            />
                        </div>

                        {/* Detalle */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="detalle">
                                Detalle
                            </label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="detalle"
                                rows="4"
                                {...register("detalle", { required: { value: true, message: "El detalle es obligatorio" } })}
                            />
                        </div>

                        {/* Estado */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado_obra_id">
                                Estado
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="estado_obra_id"
                                {...register("estado_obra_id")}
                            >
                                <option value="1">Pedida</option>
                                <option value="2">Cotizada</option>
                                <option value="3">En Curso</option>
                                <option value="4">Finalizada</option>
                            </select>
                        </div>

                        {/* Fecha Visto */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_visto">
                                Fecha Visto
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="fecha_visto"
                                type="date"
                                {...register("fecha_visto")}
                            />
                        </div>

                        {/* Fecha Ingreso */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_ingreso">
                                Fecha Ingreso
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="fecha_ingreso"
                                type="date"
                                {...register("fecha_ingreso")}
                            />
                        </div>

                        {/* Grupos */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Grupos Asignados
                            </label>
                            <GruposSelect value={gruposField.value} onChange={gruposField.onChange} />
                        </div>

                        {/* Botones */}
                        <div className="flex gap-2 pt-4">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                            >
                                {isPending ? "Guardando..." : "Guardar"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/obras")}
                                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}