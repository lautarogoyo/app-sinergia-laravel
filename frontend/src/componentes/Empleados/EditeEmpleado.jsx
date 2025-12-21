import { useNavigate, useParams } from "react-router-dom";
import { useEmpleadoById } from "../hooks/useEmpleados.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateEmpleado } from "../api/empleados.js";
import { useForm } from "react-hook-form";
import {useEffect } from "react";
import { useGrupos } from "../hooks/useGrupos.jsx";


export default function EditeEmpleado() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {register, handleSubmit, reset} = useForm();
    const {data : empleado, isLoading} = useEmpleadoById(id);
    const {data: grupos = [], isLoading : isLoadingGrupo} = useGrupos();
    useEffect(() => {
        if (empleado) {
            reset({
                nombre: empleado.nombre,
                apellido: empleado.apellido,
                telefono: empleado.telefono,
                estado: empleado.estado,
                id_grupo: empleado.grupo?.id, 
            });
    }
    }, [empleado,grupos,reset]);
    console.log (empleado);
    const {mutate} = useMutation({
        mutationFn: (data) => UpdateEmpleado(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["empleados"]);
            navigate("/empleados");
        },
        onError: (error) => {
            console.error("Error al editar el empleado", error);
        }

    })
    const onSubmit = handleSubmit ((data) => {
        mutate(data);
    });
    return (
        <>
        {isLoadingGrupo && 
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
            <div className="relative">
            
            {/* Texto de carga */}
            <div className="mt-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Empleado</h2>
            
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
        
        {!isLoading && <div className="p-8 bg-gray-100 w-full flex flex-col items-center">
            <h1 className="text-3xl text-gray-800 mb-6 font-sans">Editar Empleado</h1>
            <form className="w-full max-w-xl bg-white shadow-2xl rounded-xl border border-gray-200 p-6 space-y-4" onSubmit={onSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                        Nombre
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="nombre"
                        type="text"
                        {...register("nombre", {required: {value:true, message: "El nombre es obligatorio"}})}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                        Apellido
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="apellido"
                        type="text"
                        {...register("apellido", {required: {value:true, message: "El apellido es obligatorio"}})}
                    />
                </div>
                <div className="mb-4 ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id_grupo">
                        Grupo (opcional)
                    </label>
                    <select
                        id="id_grupo"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        {...register("id_grupo", {
                        setValueAs: v => (v === "" ? null : Number(v)),
                        })}
                    >
                        <option value="">Sin grupo</option>
                        {grupos.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.denominacion}
                        </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                        Telefono
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="telefono"
                        type="text"
                        {...register("telefono", {required: {value:true, message: "El telefono es obligatorio"}})}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                        Estado
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="estado"
                        {...register("estado", {required: {value:true, message: "El estado es obligatorio"}})}
                    >
                        <option value="">Seleccione estado</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Guardar
                </button>
            </form>
        </div>}
    </>
    );
    
}