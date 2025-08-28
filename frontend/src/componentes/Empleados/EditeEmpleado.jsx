import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOne } from "../Fetch/getOne.js";
import { put } from "../Fetch/put.js";

export default function EditeEmpleado() {
    const { id } = useParams();
    const [apellido, setApellido] = useState("");
    const [nombre, setNombre] = useState("");
    const [grupo, setGrupo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [estado, setEstado] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener datos actuales del empleado
        getOne(`http://localhost:8000/api/empleados/${id}`, "empleado")
            .then(data => {
                setApellido(data.apellido);
                setNombre(data.nombre);
                setGrupo(data.grupo);
                setTelefono(data.telefono);
                setEstado(data.estado);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const empleado = { nombre, apellido, grupo, telefono, estado };
        try {
            const res = await put(`http://localhost:8000/api/empleados/${id}`, empleado);
            if (res){
            navigate("/empleados");
            window.location.reload();}
            else {
                alert("Error al editar empleado");
            }
        } catch (err) {
            alert("Error al editar empleado");
        }
    };

    return (
        <div className="p-6 relative mb-[100%] flex-1">
            <h1 className="text-3xl text-gray-800 mb-6 font-sans">Editar Empleado</h1>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                        Nombre
                    </label>
                    <input
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                        Apellido
                    </label>
                    <input
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="apellido"
                        type="text"
                        value={apellido}
                        onChange={e => setApellido(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="grupo">
                        Grupo
                    </label>
                    <input
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="grupo"
                        type="text"
                        value={grupo}
                        onChange={e => setGrupo(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                        Telefono
                    </label>
                    <input
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="telefono"
                        type="text"
                        value={telefono}
                        onChange={e => setTelefono(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                        Estado
                    </label>
                    <select
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="estado"
                        value={estado}
                        onChange={e => setEstado(e.target.value)}
                        required
                    >
                        <option value="">Seleccione estado</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Guardar
                </button>
            </form>
        </div>
    );
}