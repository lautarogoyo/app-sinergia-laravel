import { useNavigate, useParams } from "react-router-dom";
import { useObraById } from "../hooks/useObras.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateObra } from "../api/obras.js";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useGrupos } from "../hooks/useGrupos.jsx";

export default function EditObra() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            nro_obra: "",
            detalle: "",
            estado: "pedida",
            fecha_visto: "",
            fecha_ingreso: "",
        }
    });
    const { data: obra, isLoading } = useObraById(id);
    const { data: grupos = [], isLoading: isLoadingGrupo } = useGrupos();
    const [gruposSeleccionados, setGruposSeleccionados] = useState([]);
    const [nuevoGrupoId, setNuevoGrupoId] = useState("");

    // Función para formatear fecha a YYYY-MM-DD
    const formatearFechaInput = (fecha) => {
        if (!fecha) return "";
        try {
            const date = new Date(fecha);
            return date.toISOString().split('T')[0];
        } catch {
            return "";
        }
    };

    useEffect(() => {
        if (obra) {
            reset({
                nro_obra: obra.nro_obra || "",
                detalle: obra.detalle || "",
                estado: obra.estado || "pedida",
                fecha_visto: formatearFechaInput(obra.fecha_visto),
                fecha_ingreso: formatearFechaInput(obra.fecha_ingreso),
            });
            // Cargar los grupos actuales de la obra
            setGruposSeleccionados(obra.grupos?.map(g => ({ id: g.id, denominacion: g.denominacion })) || []);
        }
    }, [obra, reset]);

    const { mutate } = useMutation({
        mutationFn: (data) => {
            // Enviar los IDs de los grupos
            const grupoIds = gruposSeleccionados.map(g => g.id);
            return UpdateObra(id, { ...data, grupo_id: grupoIds });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["obras"]);
            navigate("/obras");
        },
        onError: (error) => {
            console.error("Error al editar la obra", error);
        }
    });

    const onSubmit = handleSubmit((data) => {
        mutate(data);
    });

    const agregarGrupo = () => {
        if (nuevoGrupoId && !gruposSeleccionados.find(g => g.id === parseInt(nuevoGrupoId))) {
            const grupoSeleccionado = grupos.find(g => g.id === parseInt(nuevoGrupoId));
            if (grupoSeleccionado) {
                setGruposSeleccionados([...gruposSeleccionados, grupoSeleccionado]);
                setNuevoGrupoId("");
            }
        }
    };

    const eliminarGrupo = (grupoId) => {
        setGruposSeleccionados(gruposSeleccionados.filter(g => g.id !== grupoId));
    };

    return (
        <>
            {(isLoading || isLoadingGrupo) &&
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
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nro_obra"
                                type="text"
                                {...register("nro_obra", { required: { value: true, message: "El nro de obra es obligatorio" } })}
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
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                                Estado
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="estado"
                                {...register("estado")}
                            >
                                <option value="pedida">Pedido de Cotización</option>
                                <option value="cotizada">Cotizada</option>
                                <option value="enCurso">En Curso</option>
                                <option value="finalizada">Finalizada</option>
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

                        {/* Grupos Asignados */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Grupos Asignados
                            </label>
                            {gruposSeleccionados.length > 0 ? (
                                <div className="space-y-2 mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                                    {gruposSeleccionados.map((grupo) => (
                                        <div
                                            key={grupo.id}
                                            className="flex justify-between items-center bg-white p-3 rounded border border-blue-300"
                                        >
                                            <span className="text-gray-700">{grupo.denominacion}</span>
                                            <button
                                                type="button"
                                                onClick={() => eliminarGrupo(grupo.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded transition"
                                            >
                                                ✕ Eliminar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm mb-4 p-3 bg-gray-50 rounded">
                                    Sin grupos asignados
                                </p>
                            )}
                        </div>

                        {/* Agregar Nuevo Grupo */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nuevoGrupo">
                                Agregar Grupo
                            </label>
                            <div className="flex gap-2">
                                <select
                                    id="nuevoGrupo"
                                    value={nuevoGrupoId}
                                    onChange={(e) => setNuevoGrupoId(e.target.value)}
                                    className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Seleccionar grupo...</option>
                                    {grupos
                                        .filter(g => !gruposSeleccionados.find(gs => gs.id === g.id))
                                        .map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.denominacion}
                                            </option>
                                        ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={agregarGrupo}
                                    disabled={!nuevoGrupoId}
                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
                                >
                                    + Agregar
                                </button>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-2 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Guardar
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/obras")}
                                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
