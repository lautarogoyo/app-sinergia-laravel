import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Editor() {
    const { id } = useParams();
    const [apellido, setApellido] = useState("");
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener datos actuales del empleado
        fetch(`http://localhost:3000/api/empleados/${id}`)
            .then(res => res.json())
            .then(data => {
                setApellido(data.data.apellido);
                setNombre(data.data.nombre);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const empleado = { apellido, nombre };

        try {
            const res = await fetch(`http://localhost:3000/api/empleados/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(empleado),
            });
            if (res.ok) {
                navigate("/proveedores");
                window.location.reload();
            } else {
                alert("Error al borrar empleado");
            }
        } catch (err) {
            alert("Error de conexión");
        }
    };

    return (
        <div className="p-6 relative mb-[100%] flex-1">
            <h1 className="text-3xl text-gray-800 mb-6 font-sans">Eliminar Empleado</h1>
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
                        disabled
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
                        disabled
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Confirmar Eliminación
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={() => navigate("/proveedores")}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    )
}