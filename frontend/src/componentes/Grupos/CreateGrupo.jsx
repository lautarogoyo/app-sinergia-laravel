import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCreateGrupo, useEstadosGrupo } from "../hooks/useGrupos";

export default function CreateGrupo() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { denominacion: "", id_estado: "" },
  });
  const { mutate, isPending } = useCreateGrupo(() => navigate("/personas"));
  const { data: estadosData } = useEstadosGrupo();
  const estados = estadosData?.estados ?? [];

  return (
    <div className="p-8 bg-gray-100 lg:w-full flex flex-col items-center">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800">Nuevo Grupo</h2>
      <form onSubmit={handleSubmit((data) => mutate(data))}
        className="w-full max-w-xl bg-white shadow-2xl rounded-xl border border-gray-200 p-6 space-y-4">

        <div className="flex flex-col gap-1">
          <label htmlFor="denominacion" className="text-lg font-medium text-gray-700">Denominación</label>
          <input
            id="denominacion"
            {...register("denominacion", { required: "La denominación es obligatoria" })}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
          />
          {errors.denominacion && <p className="text-red-600 text-sm">{errors.denominacion.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="id_estado" className="text-lg font-medium text-gray-700">Estado</label>
          <select
            id="id_estado"
            {...register("id_estado", { required: "El estado es obligatorio" })}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg bg-white focus:outline-none focus:ring focus:border-blue-400"
          >
            <option value="">Seleccionar estado...</option>
            {estados.map((e) => (
              <option key={e.estado_grupo_id} value={e.estado_grupo_id}>{e.descripcion}</option>
            ))}
          </select>
          {errors.id_estado && <p className="text-red-600 text-sm">{errors.id_estado.message}</p>}
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={() => navigate("/personas")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg font-semibold py-2 px-4 rounded shadow">Cancelar</button>
          <button type="submit" disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow disabled:opacity-50">
            {isPending ? "Guardando..." : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}
