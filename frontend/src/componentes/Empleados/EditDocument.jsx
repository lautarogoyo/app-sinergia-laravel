import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOne } from "../Fetch/getOne.js";
import { put } from "../Fetch/put.js";
import { post } from "../Fetch/post.js";

export default function EditDocument() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exit, setExit] = useState(false);
    const [documentaciones, setDocumentaciones] = useState([]);
    useEffect(() => {
        getOne(`http://localhost:8000/api/empleados/${id}`, "empleado")
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
                  id_tipo_documento: Number(value), // actualiza el campo raíz
                  tipo_documento: { ...doc.tipo_documento, id_tipo_documento: Number(value) }
                }
              : doc
          )
        );
      }
    const handleDocumentacionChange = (docId, file) => {
        setDocumentaciones(prev => prev.map(doc =>
            doc.id === docId
              ? { ...doc, newFile: file }  // Aquí solo actualizamos el nombre del archivo
              : doc
          )
        );
      };
    
    const updateDocumentacion = async ({ id, id_empleado, id_tipo_documento, file }) => {
        const formData = new FormData();
        formData.append('id_empleado', id_empleado);
        formData.append('id_tipo_documento', id_tipo_documento);
        if (file) formData.append('archivo', file);
        // Si tienes fecha_vencimiento, también puedes agregarla
        // formData.append('fecha_vencimiento', fecha_vencimiento);
        try {
            return await put(`http://localhost:8000/api/documentaciones/${id}`, formData, true);
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
        formData.append("id_tipo_documento", Number(newTipo));
        formData.append("archivo", newFile);
        try {
            const res = await post("http://localhost:8000/api/documentaciones", formData);
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

        const changes = documentaciones.filter(doc =>
        doc.newFile ||
        (typeof doc.id_tipo_documento !== "undefined" &&
         doc.id_tipo_documento !== doc.tipo_documento.id_tipo_documento)
        );

        if (changes.length === 0) {
        alert("No hay cambios para guardar.");
        return;
        }

        try {
        await Promise.all(changes.map(doc =>
            updateDocumentacion({
            id: doc.id,
            id_empleado: Number(id),
            id_tipo_documento: Number(doc.id_tipo_documento ?? doc.tipo_documento?.id_tipo_documento),
            file: doc.newFile || null,
            // fecha_vencimiento: doc.fecha_vencimiento ?? null, // si lo editás en UI
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
        <div className="">
            <div className="p-6 relative flex flex-col justify-start items-center">
                <h1 className="text-3xl text-gray-800 font-bold m-6">Documentaciones</h1>
                {documentaciones.length > 0 ? (
                    documentaciones.map(doc => (
                        <div key={doc.id} className="flex items-center px-4">
                            <span className="m-4 font-semibold border-1 text-white bg-orange-500 rounded-xl p-2">{doc.tipo_documento.descripcion.toUpperCase()}</span>
                            <label className="m-4 font-semibold text-gray-700">{doc.path_archivo_documento}</label>
                            <input
                                className="bg-gray-500 text-white rounded px-2 py-1"
                                type="file"
                                id={`doc-file-${doc.id}`}
                                name={`doc-file-${doc.id}`}
                                onChange={e => handleDocumentacionChange(doc.id, e.target.files[0])}
                            />
                            <select
                            className="shadow appearance-none border rounded py-2 px-3 m-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="tipo_documento.descripcion"
                            value={doc.tipo_documento.id_tipo_documento}
                            onChange={(e) => handleTipoDocumentoChange(doc.id, e.target.value)}
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
                        </div>
                        
                    ))
                ) : (
                    <div>No hay documentaciones</div>
                )}
                {file && (
                    <div className="flex items-center px-4 w-full justify-center">
                        <span className="m-4 font-semibold border-1 text-white bg-orange-500 rounded-xl p-2">Nuevo documento</span>
                        <input
                            className="bg-gray-500 text-white rounded px-2 py-1"
                            type="file"
                            id="new-doc-file"
                            name="new-doc-file"
                            onChange={e => setNewFile(e.target.files[0])}
                        />
                        <select
                            className="shadow appearance-none border rounded py-2 px-3 m-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                        <button onClick={handleAgregarNuevo} className="ml-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Agregar</button>
                        <button onClick={()=> { setFile(false); setNewFile(null); setNewTipo(""); }} className="ml-2 bg-gray-400 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded">Cancelar</button>
                        
                    </div>
                )}
                
            </div>
                <div className="flex w-full justify-end items-center gap-4 m-6">
                    <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer">
                        Guardar
                    </button>
                    <button onClick={()=>setExit(true)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded cursor-pointer">Cancelar</button>
                    <button onClick={()=> setFile(true)} className="text-white flex items-center justify-center bg-green-600 rounded text-xl px-4 py-2 cursor-pointer hover:bg-green-700 ml-5">+</button>
                </div>
        </div>
    );
}