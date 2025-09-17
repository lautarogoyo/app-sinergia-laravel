import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



export default function CreateEmpleado() {
    const [apellido, setApellido] = useState("");
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const empleado = { apellido, nombre };

        try {
                const res = await axios.post("http://localhost:3000/api/empleados", empleado);
                if (res.status === 201) {
                    navigate("/proveedores"); // Redirige al listado
                    window.location.reload(); // Recarga la página para mostrar el nuevo empleado
                    alert("Empleado creado:", res.data);
                } else {
                    alert("Error al crear empleado");
                }
        } catch  {
            alert("Error de conexión");
        }
    };

    return (
        <div className="p-6 relative mb-[100%] flex-1">
            <h1 className="text-3xl text-gray-800 mb-6 font-sans">Crear Empleado</h1>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                        Apellido
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="apellido"
                        type="text"
                        placeholder="Apellido"
                        value={apellido}
                        onChange={e => setApellido(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                        Nombre
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="nombre"
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Crear Empleado
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => navigate("/proveedores")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}