import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RemoveEmpleado() {
    const { id } = useParams();
    const [apellido, setApellido] = useState("");
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener datos actuales del empleado desde el backend Laravel
        fetch(`http://localhost:8000/api/empleados/${id}`)
            .then(res => res.json())
            .then(data => {
                // El backend devuelve { empleado: {...}, status: 200 }
                if (data && data.empleado) {
                    setApellido(data.empleado.apellido);
                    setNombre(data.empleado.nombre);
                }
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8000/api/empleados/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                navigate("/empleados");
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
                <p className="mb-4 text-red-600">¿Está seguro que desea eliminar al empleado <strong>{nombre} {apellido}</strong>? Esta acción no se puede deshacer.</p>
                <div className="flex items-center">
                    <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-5 cursor-pointer"
                        type="submit"
                    >
                        Confirmar Eliminación
                    </button>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
                        type="button"
                        onClick={() => navigate("/empleados")}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}