import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOne } from "../Fetch/getOne.js";
import { put } from "../Fetch/put.js";
import { post } from "../Fetch/post.js";

export default function EditDocument() {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [exit, setExit] = useState(false);
    const [documentaciones, setDocumentaciones] = useState([]);
    useEffect(() => {
        getOne(`${backendUrl}/api/empleados/${id}`, "empleado")
            .then(data => {
                setDocumentaciones(data.documentaciones)
            });
    }, [id]);
    const [file, setFile] = useState(false);
    const [newFile, setNewFile] = useState(null);
    const [newTipo, setNewTipo] = useState("");
    const handleTipoDocumentoChange = (docId, value) => {
        setDocumentaciones(prev =>
          prev.map(doc =>
            doc.id === docId
                            ? {
                                    ...doc,
                                    id_tipoDocumento: Number(value),
                                    hasChanges: true
                                }
              : doc
          )
        );
      }
    const handleDocumentacionChange = (docId, file) => {
        setDocumentaciones(prev => prev.map(doc =>
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




    const updateDocumentacion = async ({ id, id_empleado, id_tipoDocumento, file, fecha_vencimiento }) => {
        const formData = new FormData();
        formData.append('id_empleado', (id_empleado) ?? "");
        formData.append('id_tipoDocumento', Number(id_tipoDocumento));
        if (file) formData.append('archivo', file);
        formData.append('estado', 'vigente');
        if (fecha_vencimiento) {
            const fechaOk = fecha_vencimiento.length > 10 ? fecha_vencimiento.slice(0, 10) : fecha_vencimiento;
            formData.append('fecha_vencimiento', fechaOk);
        }
        try {
            return await put(`${backendUrl}/api/documentaciones/${id}`, formData, true);
        } catch (err) {
            if (err.response && err.response.data) {
                console.error('Backend error:', err.response.data);
                alert('Error backend: ' + JSON.stringify(err.response.data));
            } else {
                console.error('Error desconocido:', err);
                alert('Error desconocido: ' + err.message);
            }
            throw err;
        }
    };

    const handleAgregarNuevo = async () => {
        if (!newFile || !newTipo) {
            alert("Selecciona tipo y archivo");
            return;
        }
        const formData = new FormData();
        formData.append("id_empleado", Number(id));
        formData.append("id_tipoDocumento", Number(newTipo));
        formData.append("archivo", newFile);
        formData.append("estado", "vigente");
        try {
            const res = await post(`${backendUrl}/api/documentaciones`, formData);
            setDocumentaciones(prev => [...prev, res]);
            setFile(false);
            setNewFile(null);
            setNewTipo("");
            window.location.reload();
        } catch (err) {
            alert("Error al crear documento");
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const changes = documentaciones.filter(doc => doc.hasChanges);

        if (changes.length === 0) {
        alert("No hay cambios para guardar.");
        return;
        }

        try {
        await Promise.all(changes.map(doc =>
            updateDocumentacion({
            id: doc.id,
            id_empleado: Number(id),
            id_tipoDocumento: Number(doc.id_tipoDocumento ?? doc.tipo_documento?.id),
            file: doc.newFile || null,
            fecha_vencimiento: doc.fecha_vencimiento ?? null
            })
        ));

        navigate("/empleados");
        window.location.reload();
        } catch (err) {
        console.error(err);
        alert("Error al editar documentaciones");
        }
    };
    if (exit) {
        navigate("/empleados");
    }
    return (
        <div className="min-h-screen flex flex-col flex-1 py-10">
            <div className="w-full bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
                <h1 className="text-4xl text-gray-800 font-extrabold mb-8 tracking-tight">Documentaciones</h1>
                {documentaciones.length > 0 ? (
                    <div className="w-full flex flex-col gap-6">
                        {documentaciones.map(doc => (
                            <div key={doc.id} className="flex flex-col md:flex-row items-center justify-between bg-gray-50 rounded-xl shadow-md p-6 border border-gray-200">
                                <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                                    <span className="font-semibold text-white bg-gray-600 rounded-xl p-2 text-lg shadow w-40">{doc.tipo_documento.descripcion.toUpperCase()}</span>
                                    <label className="font-semibold text-gray-700 truncate max-w-xs">{doc.path}</label>
                                    <input
                                        className="bg-gray-200 text-gray-800 rounded px-2 py-1 border border-gray-300 focus:ring-2 focus:ring-orange-400"
                                        type="file"
                                        id={`doc-file-${doc.id}`}
                                        name={`doc-file-${doc.id}`}
                                        onChange={e => handleDocumentacionChange(doc.id, e.target.files[0])}
                                    />
                                    <select
                                        className="shadow border rounded py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        id="tipo_documento.id"
                                        value={doc.id_tipoDocumento ?? doc.tipo_documento?.id ?? ""}
                                        onChange={e => handleTipoDocumentoChange(doc.id, e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccione estado</option>
                                        <option value="1">Seguro</option>
                                        <option value="2">Examen Medico</option>
                                        <option value="3">Monotributo</option>
                                        <option value="4">ART/SVO</option>
                                        <option value="5">Capacitacion</option>
                                        <option value="6">EPP</option>
                                        <option value="7">Constancia AFIP</option>
                                    </select>
                                    <input
                                        className="bg-gray-200 text-gray-800 rounded px-2 py-1 border border-gray-300 focus:ring-2 focus:ring-orange-400"
                                        type="date"
                                        id="fecha_vencimiento"
                                        value={doc.fecha_vencimiento ? doc.fecha_vencimiento.split('T')[0] : ''}
                                        name="fecha_vencimiento"
                                        onChange={e => handleFechaVencimientoChange(doc.id, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-lg font-medium">No hay documentaciones</div>
                )}
                {file && (
                    <div className="flex flex-col md:flex-row items-center justify-center w-full gap-4 mt-8 bg-gray-50 rounded-xl shadow-md p-6 border border-gray-200">
                        <span className="font-semibold text-white bg-gradient-to-r from-green-600 to-green-400 rounded-xl px-4 py-2 text-lg shadow">Nuevo documento</span>
                        <input
                            className="bg-gray-200 text-gray-800 rounded px-2 py-1 border border-gray-300 focus:ring-2 focus:ring-green-400"
                            type="file"
                            id="new-doc-file"
                            name="new-doc-file"
                            onChange={e => setNewFile(e.target.files[0])}
                        />
                        <select
                            className="shadow border rounded py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                            id="new_tipo_documento"
                            value={newTipo || ""}
                            onChange={e => setNewTipo(e.target.value)}
                            required
                        >
                            <option value="">Seleccione estado</option>
                            <option value="1">Seguro</option>
                            <option value="2">Examen Medico</option>
                            <option value="3">Monotributo</option>
                            <option value="4">ART/SVO</option>
                            <option value="5">Capacitacion</option>
                            <option value="6">EPP</option>
                            <option value="7">Constancia AFIP</option>
                        </select>
                        <div className="flex gap-2 mt-4 md:mt-0">
                            <button onClick={handleAgregarNuevo} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow transition-all duration-150">Agregar</button>
                            <button onClick={()=> { setFile(false); setNewFile(null); setNewTipo(""); }} className="bg-gray-400 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded shadow transition-all duration-150">Cancelar</button>
                        </div>
                    </div>
                )}
                <div className="flex w-full justify-end items-center gap-4 mt-10">
                    <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150">
                        Guardar
                    </button>
                    <button onClick={()=>setExit(true)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded shadow transition-all duration-150">Cancelar</button>
                    <button onClick={()=> setFile(true)} className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded text-xl px-6 py-2 font-bold shadow transition-all duration-150">+</button>
                </div>
            </div>
        </div>
    );
}