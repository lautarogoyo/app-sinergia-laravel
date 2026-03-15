import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCreateProveedor } from "../hooks/useProveedores";
import FormField from "../shared/FormField";

export default function CreatePersona() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { nombre: "", apellido: "", telefono: "", email: "", monotributista: false, direccion: "", comentario: "", fecha_ingreso: "" },
  });

  const { mutate, isPending } = useCreateProveedor(() => navigate("/personas"));

  return (
    <div className="p-8 bg-gray-100 lg:w-full flex flex-col items-center">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800">Nuevo Proveedor</h2>
      <form onSubmit={handleSubmit((data) => mutate(data))}
        className="w-full max-w-xl bg-white shadow-2xl rounded-xl border border-gray-200 p-6 space-y-4">

        <FormField label="Nombre" id="nombre" error={errors.nombre?.message}>
          <input id="nombre" {...register("nombre", { required: "El nombre es obligatorio" })}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400" />
        </FormField>

        <FormField label="Apellido" id="apellido">
          <input id="apellido" {...register("apellido")}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400" />
        </FormField>

        <FormField label="Teléfono" id="telefono">
          <input id="telefono" {...register("telefono")}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400" />
        </FormField>

        <FormField label="Email" id="email" error={errors.email?.message}>
          <input id="email" type="email" {...register("email", { pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" } })}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400" />
        </FormField>

        <FormField label="Dirección" id="direccion">
          <input id="direccion" {...register("direccion")}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400" />
        </FormField>

        <FormField label="Comentario" id="comentario">
          <textarea id="comentario" {...register("comentario")} rows={2}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400" />
        </FormField>

        <div className="flex items-center gap-2">
          <input id="monotributista" type="checkbox" {...register("monotributista")} className="w-5 h-5" />
          <label htmlFor="monotributista" className="text-lg font-medium text-gray-700">Monotributista</label>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={() => reset()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg font-semibold py-2 px-4 rounded shadow">Limpiar</button>
          <button type="submit" disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow disabled:opacity-50">
            {isPending ? "Guardando..." : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}