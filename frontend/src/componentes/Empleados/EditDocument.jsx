import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEmpleadoById } from "../hooks/useEmpleados.jsx";
import {
  useCreateDocumentacion,
  useUpdateDocumentacion,
  useDeleteDocumentacion
} from "../hooks/useDocumentaciones.jsx";

export default function EditDocument() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exit, setExit] = useState(false);
  const [documentaciones, setDocumentaciones] = useState([]);

  const { data: empleado, isLoading: isLoadingEmpleado, isError } =
    useEmpleadoById(id);

  useEffect(() => {
    if (empleado?.documentaciones) {
      setDocumentaciones(empleado.documentaciones);
    }
  }, [empleado]);

  /* ---------- NUEVO DOCUMENTO ---------- */
  const [file, setFile] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const [newTipo, setNewTipo] = useState("");
  const [newFecha, setNewFecha] = useState("");

  /* ---------- HANDLERS EXISTENTES ---------- */
  const handleTipoDocumentoChange = (docId, value) => {
    setDocumentaciones(prev =>
      prev.map(doc =>
        doc.id === docId
          ? { ...doc, tipo_documento_id: value, hasChanges: true }
          : doc
      )
    );
  };

  const handleDocumentacionChange = (docId, file) => {
    setDocumentaciones(prev =>
      prev.map(doc =>
        doc.id === docId
          ? { ...doc, newFile: file, hasChanges: true }
          : doc
      )
    );
  };

  const handleFechaVencimientoChange = (docId, value) => {
    setDocumentaciones(prev =>
      prev.map(doc =>
        doc.id === docId
          ? { ...doc, fecha_vencimiento: value, hasChanges: true }
          : doc
      )
    );
  };

  /* ---------- MUTATIONS ---------- */
  const updateMutation = useUpdateDocumentacion(id);
  const createMutation = useCreateDocumentacion(id);
  const deleteMutation = useDeleteDocumentacion(id);

  /* ---------- CREATE ---------- */
  const handleAgregarNuevo = () => {
    if (!newFile || !newTipo || !newFecha) {
      alert("Seleccioná tipo, archivo y fecha de vencimiento");
      return;
    }

    const formData = new FormData();
    formData.append("tipo_documento_id", newTipo);
    formData.append("estado", "vigente");
    formData.append("fecha_vencimiento", newFecha);
    formData.append("archivo", newFile);

    createMutation.mutate(formData, {
      onSuccess: () => {
        setFile(false);
        setNewFile(null);
        setNewTipo("");
        setNewFecha("");
      },
      onError: (error) => {
        console.error(error.response?.data);
        alert("Error al crear documentación");
      }
    });
  };

  /* ---------- DELETE ---------- */
  const handleEliminar = (docId) => {
    if (!confirm("¿Estás seguro de eliminar este documento?")) {
      return;
    }

    deleteMutation.mutate(docId, {
      onSuccess: () => {
        alert("Documento eliminado");
      },
      onError: (error) => {
        console.error(error.response?.data);
        alert("Error al eliminar documentación");
      }
    });
  };

  /* ---------- UPDATE ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const changes = documentaciones.filter(doc => doc.hasChanges);

    if (changes.length === 0) {
      alert("No hay cambios para guardar.");
      return;
    }

    try {
      await Promise.all(
        changes.map(doc => {
          const formData = new FormData();

          const tipoId = doc.tipo_documento_id ?? doc.tipo_documento?.id;
          if (!tipoId) throw new Error("Falta tipo_documento");

          formData.append("tipo_documento_id", tipoId);
          formData.append("estado", "vigente");

          if (doc.newFile) {
            formData.append("archivo", doc.newFile);
          }

          if (doc.fecha_vencimiento) {
            formData.append(
              "fecha_vencimiento",
              doc.fecha_vencimiento.slice(0, 10)
            );
          }

          return updateMutation.mutateAsync({
            docId: doc.id,
            formData,
          });
        })
      );

      navigate("/empleados");
    } catch (err) {
      console.error(err);
      alert("Error al editar documentaciones");
    }
  };

  if (exit) navigate("/empleados");

  /* ---------- UI ---------- */
  if (isLoadingEmpleado) {
    return (
     <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
      <div className="relative">
        
        {/* Texto de carga */}
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Documento</h2>
          
          {/* Barra de progreso */}
          <div className="w-80 h-3 bg-gray-700 rounded-full overflow-hidden shadow-lg">
            <div className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full animate-loading-bar"></div>
          </div>
          
          {/* Puntos animados */}
          <div className="mt-4 flex justify-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
            <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
            <span className="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
          </div>
        </div>
      </div>
    </div>
    );
  }

  if (isError) {
    return <div className="p-10 text-red-600">Error al cargar empleado</div>;
  }

  return (
    <div className="min-h-screen py-8 px-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Documentaciones de {empleado?.nombre} {empleado?.apellido}
          </h1>
          <p className="text-gray-600">Gestiona los documentos del empleado</p>
        </div>

        {/* Documentaciones Existentes */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Documentos Registrados</h2>
          {documentaciones.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800">No hay documentos registrados aún</p>
            </div>
          ) : (
            documentaciones.map(doc => (
              <div
                key={doc.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 relative"
              >
                {/* Botón Eliminar */}
                <button
                  onClick={() => handleEliminar(doc.id)}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition duration-200 text-sm"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                  {/* Tipo de Documento */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Documento
                    </label>
                    <select
                      value={doc.tipo_documento_id ?? doc.tipo_documento?.id}
                      onChange={e =>
                        handleTipoDocumentoChange(doc.id, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="1">Seguro</option>
                      <option value="2">Examen Médico</option>
                      <option value="3">Monotributo</option>
                      <option value="4">ART/SVO</option>
                      <option value="5">Capacitación</option>
                      <option value="6">EPP</option>
                      <option value="7">Constancia AFIP</option>
                    </select>
                  </div>

                  {/* Fecha Vencimiento */}
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha Vencimiento
                    </label>
                    <input
                      type="date"
                      value={
                        doc.fecha_vencimiento
                          ? doc.fecha_vencimiento.split("T")[0]
                          : ""
                      }
                      onChange={e =>
                        handleFechaVencimientoChange(doc.id, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Archivo */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reemplazar Archivo
                    </label>
                    <input
                      type="file"
                      onChange={e =>
                        handleDocumentacionChange(doc.id, e.target.files[0])
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {doc.newFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ Nuevo archivo: {doc.newFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Nuevo Documento */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Agregar Nuevo Documento</h2>
          
          {!file ? (
            <button
              onClick={() => setFile(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span> Nuevo Documento
            </button>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-green-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tipo Documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento *
                  </label>
                  <select
                    value={newTipo}
                    onChange={e => setNewTipo(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Seleccionar tipo...</option>
                    <option value="1">Seguro</option>
                    <option value="2">Examen Médico</option>
                    <option value="3">Monotributo</option>
                    <option value="4">ART/SVO</option>
                    <option value="5">Capacitación</option>
                    <option value="6">EPP</option>
                    <option value="7">Constancia AFIP</option>
                  </select>
                  {newTipo && <p className="text-sm text-green-600 mt-1">✓ Seleccionado</p>}
                </div>

                {/* Fecha Vencimiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Vencimiento *
                  </label>
                  <input
                    type="date"
                    value={newFecha}
                    onChange={e => setNewFecha(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {newFecha && <p className="text-sm text-green-600 mt-1">✓ Seleccionada</p>}
                </div>

                {/* Archivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archivo *
                  </label>
                  <input
                    type="file"
                    onChange={e => setNewFile(e.target.files[0])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {newFile && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Archivo: {newFile.name} ({(newFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleAgregarNuevo}
                  disabled={!newFile || !newTipo || !newFecha || createMutation.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  {createMutation.isPending ? "Agregando..." : "Agregar Documento"}
                </button>
                <button
                  onClick={() => {
                    setFile(false);
                    setNewFile(null);
                    setNewTipo("");
                    setNewFecha("");
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botones Acción */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={documentaciones.length === 0 || updateMutation.isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button
            onClick={() => setExit(true)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
