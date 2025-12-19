import { useState } from "react";
import { PostGrupo } from "../api/grupos.js";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export default function CreateGrupo() {
	const [denominacion, setDenominacion] = useState("");
	const [error, setError] = useState("");

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
    mutationFn: PostGrupo,
    onSuccess: () => {
      queryClient.invalidateQueries(["grupos"]);
      navigate("/grupos");
    },
    onError: () => {
      setError("Error al crear el grupo");
    },
  });

	  const handleSubmit = (e) => {
        e.preventDefault();

        if (!denominacion.trim()) {
        setError("La denominación es obligatoria");
        return;
        }

        mutate({ denominacion });
    };

	return (
		<div className="p-8 bg-gray-100 lg:w-full flex flex-col items-center">
			<h2 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide text-center">
				Crear Grupo
			</h2>
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-xl bg-white shadow-2xl rounded-xl border border-gray-200 p-6 space-y-4"
			>
				<div className="flex flex-col">
					<label htmlFor="denominacion" className="mb-2 text-lg font-medium text-gray-700">
						Denominación
					</label>
					<input
						id="denominacion"
						type="text"
						value={denominacion}
						onChange={(e) => setDenominacion(e.target.value)}
						className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
						placeholder="Ej: Grupo A"
						required
					/>
				</div>

				{error && (
					<p className="text-red-600 text-sm font-semibold">{error}</p>
				)}

				<div className="flex gap-3 justify-end pt-2">
					<button
						type="reset"
						onClick={() => {
							setDenominacion("");
							setError("");
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
