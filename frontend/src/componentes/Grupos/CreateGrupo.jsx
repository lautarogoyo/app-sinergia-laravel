import { PostGrupo } from "../api/grupos.js";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function CreateGrupo() {
	const { register, handleSubmit, formState: {errors}, reset } = useForm();


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

	const onSubmit = handleSubmit((data) => {
		mutate(data);
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
						required
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
						Crear
					</button>
				</div>
			</form>
		</div>
	);
}
