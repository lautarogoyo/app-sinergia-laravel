import { PostGrupo } from "../api/grupos.js";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEstadosGrupo } from "../hooks/useGrupos.jsx";


export default function CreateGrupo() {
	const { register, handleSubmit, formState: {errors}, reset } = useForm({
    defaultValues: {
			estado_grupo_id: "",
    },
  });

  	const {data, isLoading} = useEstadosGrupo();
	const estados = data?.estados ?? [];
	

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
    mutationFn: PostGrupo,
    onSuccess: () => {
      queryClient.invalidateQueries(["grupos"]);
      navigate("/grupos");
    },
    onError: (error) => {
      console.error("Error al crear el grupo", error);
    },
  });

	const onSubmit = handleSubmit((formData) => {
		const payload = {
			denominacion: formData.denominacion,
			...(formData.estado_grupo_id
				? { estado_grupo_id: Number(formData.estado_grupo_id) }
				: {}),
		};
		mutate(payload);
	});

	return (
		<div className="p-8 bg-gray-100 lg:w-full flex flex-col items-center">
			<h2 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide text-center">
				Crear Grupo
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
						{...register("denominacion", { required: "La denominación es obligatoria", message: "Ingrese una denominación válida" })}
						className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
						placeholder="Ej: Grupo A"
					/>
				</div>

				{errors?.denominacion?.message && (
					<p className="text-red-600 text-sm font-semibold">{errors.denominacion.message}</p>
				)}

        <div className="flex flex-col">
					<label htmlFor="estado_grupo_id" className="mb-2 text-lg font-medium text-gray-700">
            Estado
          </label>
          <select
						id="estado_grupo_id"
						{...register("estado_grupo_id", { required: "El estado es obligatorio" })}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
						disabled={isLoading}
          >
						<option value="">Seleccione un estado</option>
						{estados.map((estado) => (
							<option key={estado.estado_grupo_id} value={estado.estado_grupo_id}>
								{estado.descripcion?.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

				{errors?.estado_grupo_id?.message && (
					<p className="text-red-600 text-sm font-semibold">{errors.estado_grupo_id.message}</p>
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
						Crear
					</button>
				</div>
			</form>
		</div>
	);
}
