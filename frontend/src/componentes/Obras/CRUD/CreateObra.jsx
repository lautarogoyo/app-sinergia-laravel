import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PostObra } from "../../api/obras.js";
import { fetchEstadosObra } from "../../api/estadosObra.js";
import { useForm, useController } from "react-hook-form";
import { useRef } from "react";
import Swal from "sweetalert2";
import GruposSelect from "../../shared/GruposSelect.jsx";

const ETIQUETAS_ESTADO = {
    pedida: "Pedida para cotizar",
    cotizada: "Cotizada",
    en_curso: "En Curso",
    finalizada: "Finalizada",
};

const normalizeEstadoDescription = (description) => {
    if (!description) return "Sin definir";
    return ETIQUETAS_ESTADO[description.toLowerCase()] || description.replace(/_/g, " ").toUpperCase();
};

export default function CreateObra() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const submitLock = useRef(false);

    const { data: estadosObraDisponibles = [] } = useQuery({
        queryKey: ["estados-obra"],
        queryFn: fetchEstadosObra,
        refetchOnWindowFocus: false,
    });

    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const obtenerFechaHoy = () => {
        const hoy = new Date();
        return hoy.toISOString().split('T')[0];
    };
    
    const { register, handleSubmit, control  } = useForm({
        defaultValues: {
            nro_obra: "",
            detalle: "",
            estado_obra_id: "1",
            fecha_visto: obtenerFechaHoy(),
            fecha_ingreso: obtenerFechaHoy(),
            grupo_ids: [],
        }
    });
    const { field: gruposField } = useController({ name: "grupo_ids", control });


    const { mutate, isPending } = useMutation({
        mutationFn: (data) => PostObra({ ...data, grupo_id: data.grupo_ids }),
        onSuccess: () => {
            queryClient.invalidateQueries(["obras"]);
            navigate("/obras");
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Error al crear la obra",
                text: error.response?.data?.message || error.message,
            });
        }
    });

    const onSubmit = handleSubmit((data) => {
        if (submitLock.current) return;
        submitLock.current = true;
        mutate(data);
    });


    return (
        <>
            <div className="p-8 bg-gray-100 w-full flex flex-col items-center">
                    <h1 className="text-3xl text-gray-800 mb-6 font-sans">Crear Nueva Obra</h1>
                    <form className="w-full max-w-xl bg-white shadow-2xl rounded-xl border border-gray-200 p-6 space-y-4" onSubmit={onSubmit}>
                        
                        {/* Nro Obra */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nro_obra">
                                Nro. Obra *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nro_obra"
                                type="text"
                                placeholder="Ej: 001, OBR-2024-001"
                                {...register("nro_obra", { required: { value: true, message: "El nro de obra es obligatorio" } })}
                            />
                        </div>

                        {/* Detalle */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="detalle">
                                Detalle *
                            </label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="detalle"
                                rows="4"
                                placeholder="Describe los detalles de la obra..."
                                {...register("detalle", { required: { value: true, message: "El detalle es obligatorio" } })}
                            />
                        </div>

                        {/* Estado */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado_obra_id">
                                Estado *
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="estado_obra_id"
                                {...register("estado_obra_id", { required: { value: true, message: "El estado es obligatorio" } })}
                            >
                                {estadosObraDisponibles.map((estado) => (
                                    <option key={estado.estado_obra_id} value={estado.estado_obra_id}>
                                        {normalizeEstadoDescription(estado.descripcion)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fecha Visto */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_visto">
                                Fecha Visto *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="fecha_visto"
                                type="date"
                                {...register("fecha_visto", { required: { value: true, message: "La fecha visto es obligatoria" } })}
                            />
                        </div>

                        {/* Fecha Ingreso */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_ingreso">
                                Fecha Ingreso *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="fecha_ingreso"
                                type="date"
                                {...register("fecha_ingreso", { required: { value: true, message: "La fecha ingreso es obligatoria" } })}
                            />
                        </div>
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
                                {isPending ? "Creando..." : "Crear Obra"}
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
        </>
    );
}
