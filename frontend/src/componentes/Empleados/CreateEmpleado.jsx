import { useNavigate } from "react-router-dom";
import { useGrupos } from "../hooks/useGrupos.jsx";
import { PostEmpleado } from "../api/empleados.js";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";



export default function CreateEmpleado() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {register, handleSubmit, formState: {errors}} = useForm();
    const {data: grupos = [], isLoading: isLoadingGrupos, isError: isErrorGrupos} = useGrupos();

    const {mutate} = useMutation({
        mutationFn: PostEmpleado,
        onSuccess: () => {
        queryClient.invalidateQueries(["empleados"]);
        navigate("/empleados");
        },
        onError: (error) => {
        console.error("Error al crear el empleado", error);
        },
    });




    const onSubmit = handleSubmit ((data) => {
        mutate(data);
    });

    return (
        <div className="p-6 relative mb-[100%] flex-1">
            <h1 className="text-3xl text-gray-800 mb-6 font-sans">Crear Empleado</h1>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={onSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                        Apellido
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="apellido"
                        type="text"
                        placeholder="Apellido"
                        {...register("apellido", { required: {value:true, message: "El apellido es obligatorio"} })}
                        
                    />
                    {errors?.apellido?.message && (
					<p className="text-red-600 text-sm font-semibold ">{errors.apellido.message}</p>
				)}
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                        Nombre
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="nombre"
                        type="text"
                        placeholder="Nombre"
                        {...register("nombre", { required: {value:true, message: "El nombre es obligatorio" }})}
                    />
                    {errors?.nombre?.message && (
					<p className="text-red-600 text-sm font-semibold">{errors.nombre.message}</p>
				)}
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                        Teléfono (10 dígitos)
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="telefono"
                        type="text"
                        placeholder="Ej: 3511234567"
                        {...register("telefono", {
                            required: { value: true, message: "El teléfono es obligatorio" },
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Debe tener 10 dígitos numéricos"
                            }
                        })}
                    />
                    {errors?.telefono?.message && (
					<p className="text-red-600 text-sm font-semibold">{errors.telefono.message}</p>
				)}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cbu">
                        CBU (opcional)
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="cbu"
                        type="text"
                        {...register("cbu", { maxLength: 22 })}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="alias">
                        Alias (opcional)
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="alias"
                        type="text"
                        {...register("alias", { maxLength: 30 })}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                        Estado
                    </label>
                    <select
                        id="estado"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        {...register("estado", { required: true})}
                    >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="grupo_id">
                        Grupo (opcional)
                    </label>
                    <select
                        id="grupo_id"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        {...register("grupo_id", {
                        setValueAs: v => (v === "" ? null : Number(v)),
                        })}
                        disabled={isLoadingGrupos || !!isErrorGrupos}
                    >
                        <option value="">Sin grupo</option>
                        {grupos.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.denominacion ?? `Grupo ${g.id}`}
                            </option>
                        ))}
                    </select>
                    {isLoadingGrupos && <p className="text-sm text-gray-500 mt-1">Cargando grupos...</p>}
                    {isErrorGrupos && <p className="text-sm text-red-600 mt-1">Error al cargar grupos</p>}
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Crear Empleado
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => navigate("/empleados")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}