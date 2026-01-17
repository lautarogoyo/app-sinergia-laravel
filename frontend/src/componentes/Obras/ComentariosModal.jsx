import { useState } from "react";
import { useForm } from "react-hook-form";
import Icon from "../Icons/Icons";

export default function ComentariosModal({ isOpen, onClose, obra }) {
  const [comentarios, setComentarios] = useState(obra?.comentarios || []);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (formData) => {
    if (!formData.denominacion.trim()) return;

    const nuevoComentario = {
      id: Date.now(),
      denominacion: formData.denominacion,
      created_at: new Date().toISOString(),
      obra_id: obra.id
    };

    setComentarios([...comentarios, nuevoComentario]);
    reset();
  };

  const handleEliminar = (comentarioId) => {
    if (confirm("¿Está seguro de que desea eliminar este comentario?")) {
      setComentarios(comentarios.filter(c => c.id !== comentarioId));
    }
  };

  if (!isOpen || !obra) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Comentarios - Obra #{obra.nro_obra++} {obra.detalle}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Icon name="x" className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {comentarios.length > 0 ? (
            <div className="space-y-4 mb-6">
              {comentarios.map((comentario) => (
                <div
                  key={comentario.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="text-gray-800 text-sm leading-relaxed">
                        {comentario.denominacion}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(comentario.created_at).toLocaleString("es-AR")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEliminar(comentario.id)}
                      className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                      title="Eliminar comentario"
                    >
                      <Icon name="trash" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay comentarios aún</p>
            </div>
          )}

          {/* Form para nuevo comentario */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Agregar nuevo comentario
              </label>
              <textarea
                {...register("denominacion", {
                  required: "El comentario es obligatorio",
                  maxLength: { value: 1000, message: "Máximo 1000 caracteres" }
                })}
                placeholder="Escriba su comentario aquí..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
              />
              {errors.denominacion && (
                <p className="text-red-600 text-sm font-semibold">
                  {errors.denominacion.message}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                Agregar Comentario
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-md transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
