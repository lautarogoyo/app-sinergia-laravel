import { useForm } from "react-hook-form";

export default function RubroFormModal({ rubro, onClose, onCreate, onUpdate }) {
  const isEdit = !!rubro;
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { descripcion: rubro?.descripcion ?? "" },
  });

  const onSubmit = handleSubmit((data) => {
    if (isEdit) {
      onUpdate({ id: rubro.rubro_id, descripcion: data.descripcion });
      return;
    }

    onCreate(data);
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-full max-w-md">
        <h3 className="text-2xl font-extrabold mb-4 text-gray-800">
          {isEdit ? "Editar Rubro" : "Crear Rubro"}
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="descripcion" className="mb-2 text-lg font-medium text-gray-700">
              Descripción
            </label>
            <input
              id="descripcion"
              type="text"
              {...register("descripcion", { required: "La descripción es obligatoria" })}
              className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Ej: Construcción"
            />
            {errors.descripcion && (
              <p className="text-red-600 text-sm font-semibold mt-1">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg font-semibold py-2 px-4 rounded shadow transition duration-150"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150"
            >
              {isEdit ? "Guardar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
