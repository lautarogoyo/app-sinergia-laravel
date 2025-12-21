import { useNavigate, useParams } from "react-router-dom";
import { useGrupoById } from "../hooks/useGrupos.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteGrupo } from "../api/grupos.js";
import { useForm } from "react-hook-form";


export default function RemoveGrupo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isLoading } = useGrupoById(id);
    const {handleSubmit } = useForm();

    const { mutate } = useMutation({
    mutationFn: (data) => DeleteGrupo(id, data),
    onSuccess: () => {
        queryClient.invalidateQueries(["grupos"]);
        navigate("/grupos");
    },
    onError: (error) => {
        console.error("Error al eliminar el grupo", error);
    },
    });

    const onSubmit = handleSubmit((data) => {
        mutate(data);
    });

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
        <div className="p-6 relative mb-[100%] flex-1">
            <h1 className="text-3xl text-gray-800 mb-6 font-sans">Eliminar Grupo</h1>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={onSubmit}>
                <p className="mb-4 text-red-600">¿Está seguro que desea eliminar al grupo <strong>{data?.denominacion}</strong>? Esta acción no se puede deshacer.</p>
                <div className="flex items-center">
                    <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-5 cursor-pointer"
                        type="submit"
                    >
                        Confirmar Eliminación
                    </button>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
                        type="button"
                        onClick={() => navigate("/grupos")}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
        }
    </>
    );
    
}