import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useProveedorById, useUpdateProveedor } from "../hooks/useProveedores";
import FormField from "../shared/FormField";

export default function EditPersona() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: proveedor, isLoading } = useProveedorById(id);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { mutate, isPending } = useUpdateProveedor(id, () => navigate("/personas"));

  useEffect(() => {
    if (proveedor) reset(proveedor);
  }, [proveedor, reset]);

  if (isLoading) return <p className="p-8 text-gray-500">Cargando...</p>;

  return (
    <div className="p-8 bg-gray-100 lg:w-full flex flex-col items-center">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800">Editar Proveedor</h2>
      <form onSubmit={handleSubmit((data) => mutate(data))}
        className="w-full max-w-xl bg-white shadow-2xl rounded-xl border border-gray-200 p-6 space-y-4">

        {/* Mismos FormField que en CreatePersona */}
        {/* ... */}

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={() => navigate("/personas")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg font-semibold py-2 px-4 rounded shadow">Cancelar</button>
          <button type="submit" disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow disabled:opacity-50">
            {isPending ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}