import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateGrupo } from "../api/grupos.js";
import { useGrupoById } from "../hooks/useGrupos.jsx";
import { useEffect } from "react";


export default function EditGrupo() {
    const { id } = useParams();
    const { register, handleSubmit, formState: {errors}, reset } = useForm();
    const { data, isLoading } = useGrupoById(id);
    
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Cargar los datos del grupo cuando se obtienen
    useEffect(() => {
        if (data) {
            reset({
                denominacion: data.denominacion
            });
        }
    }, [data, reset]);

    const { mutate } = useMutation({
    mutationFn: (data) => UpdateGrupo(id, data),
    onSuccess: () => {
        queryClient.invalidateQueries(["grupos"]);
        navigate("/grupos");
    },
    onError: (error) => {
        console.error("Error al editar el grupo", error);
    },
    });

    const onSubmit = handleSubmit (data => {
        mutate(data);
    })
    
    return (
        <>
        {isLoading && 
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
            <div className="relative">
            
            {/* Texto de carga */}
            <div className="mt-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Grupo</h2>
            
            {/* Barra de progreso */}
            <div className="w-80 h-3 bg-gray-700 rounded-full overflow-hidden shadow-lg">
                <div className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full animate-loading-bar"></div>
            </div>
            
            {/* Puntos animados */}
            <div className="mt-4 flex justify-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
            </div>
            </div>
        </div>
    </div>}
        {!isLoading &&
        <div className="p-8 bg-gray-100 lg:w-full flex flex-col items-center">
			<h2 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide text-center">
				Editar Grupo
			</h2>
			<form
				onSubmit={onSubmit }
				className="w-full max-w-xl bg-white shadow-2xl rounded-xl border border-gray-200 p-6 space-y-4"
			> 
            
				<div className="flex flex-col">
					<label htmlFor="denominacion" className="mb-2 text-lg font-medium text-gray-700">
						Denominación
					</label>
					<input
						id="denominacion"
						type="text"
                        {...register("denominacion", { required: "La denominación es obligatoria" })}
						className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
						placeholder="Ej: Grupo A"
					/>
				</div>

				{errors?.denominacion?.message && (
					<p className="text-red-600 text-sm font-semibold">{errors.denominacion.message}</p>
				)}

				<div className="flex gap-3 justify-end pt-2">
					<button
						type="reset"
						onClick={() => {
							reset();
						}}
						className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg font-semibold py-2 px-4 rounded shadow transition duration-150"
					>
						Limpiar
					</button>
					<button
						type="submit"
						className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150"
					>
						Editar
					</button>
				</div>
			</form>
		</div>}
        </>

    );
}