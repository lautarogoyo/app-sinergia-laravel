// frontend/src/componentes/Obras/EditFechaVistoModal.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateObra } from "../api/obras.js";
import Swal from "sweetalert2";

export default function EditFechaVistoModal({ isOpen, onClose, obra }) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (obra) {
            reset({ fecha_visto: obra.fecha_visto?.slice(0, 10) || "" });
        }
    }, [obra, reset]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => UpdateObra(obra.nro_obra, { fecha_visto: data.fecha_visto }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["obras"] });
            onClose();
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "Error al actualizar la fecha",
            });
        },
    });

    if (!isOpen || !obra) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
            <div className="bg-white rounded-xl shadow-2xl py-10 px-4 w-full max-w-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Editar Fecha Visto — Obra #{obra.nro_obra}
                </h2>
                <form onSubmit={handleSubmit((data) => mutate(data))}>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-semibold mb-1" htmlFor="fecha_visto">
                            Fecha Visto
                        </label>
                        <input
                            id="fecha_visto"
                            type="date"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                            {...register("fecha_visto", { required: true })}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50"
                            disabled={isPending}
                        >
                            {isPending ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}