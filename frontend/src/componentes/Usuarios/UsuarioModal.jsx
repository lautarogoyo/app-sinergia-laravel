import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormField from "../shared/FormField.jsx";

export default function UsuarioModal({ usuario, onClose, onSubmit, isSaving }) {
  const esEdicion = !!usuario;
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombre_usuario: "",
      nombre: "",
      apellido: "",
      email: "",
      contrasenia: "",
      admin: false,
    },
  });

  useEffect(() => {
    reset({
      nombre_usuario: usuario?.nombre_usuario ?? "",
      nombre: usuario?.nombre ?? "",
      apellido: usuario?.apellido ?? "",
      email: usuario?.email ?? "",
      contrasenia: "",
      admin: !!usuario?.admin,
    });
  }, [usuario, reset]);

  const submit = handleSubmit((data) => {
    const payload = { ...data };
    if (esEdicion && !payload.contrasenia) {
      delete payload.contrasenia;
    }
    onSubmit(payload);
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {esEdicion ? "Editar usuario" : "Nuevo usuario"}
        </h3>

        <form onSubmit={submit} className="space-y-4">
          <FormField label="Usuario" id="nombre_usuario" error={errors.nombre_usuario?.message}>
            <input
              id="nombre_usuario"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
              {...register("nombre_usuario", { required: "El usuario es obligatorio" })}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nombre" id="nombre" error={errors.nombre?.message}>
              <input
                id="nombre"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
                {...register("nombre", { required: "El nombre es obligatorio" })}
              />
            </FormField>

            <FormField label="Apellido" id="apellido" error={errors.apellido?.message}>
              <input
                id="apellido"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
                {...register("apellido", { required: "El apellido es obligatorio" })}
              />
            </FormField>
          </div>

          <FormField label="Email" id="email" error={errors.email?.message}>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
              {...register("email", { required: "El email es obligatorio" })}
            />
          </FormField>

          <FormField
            label={esEdicion ? "Contraseña (dejar vacío para no cambiar)" : "Contraseña"}
            id="contrasenia"
            error={errors.contrasenia?.message}
          >
            <input
              id="contrasenia"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
              {...register("contrasenia", {
                required: esEdicion ? false : "La contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
          </FormField>

          <div className="flex items-center gap-2">
            <input
              id="admin"
              type="checkbox"
              className="h-4 w-4"
              {...register("admin")}
            />
            <label htmlFor="admin" className="text-gray-700 font-medium">
              Administrador
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
            >
              {isSaving ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
