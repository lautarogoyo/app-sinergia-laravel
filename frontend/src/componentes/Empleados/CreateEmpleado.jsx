import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



export default function CreateEmpleado() {
    const [apellido, setApellido] = useState("");
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [cbu, setCbu] = useState("");
    const [alias, setAlias] = useState("");
    const [estado, setEstado] = useState("activo");
    const [idGrupo, setIdGrupo] = useState("");
    const [grupos, setGrupos] = useState([]);
    const [cargandoGrupos, setCargandoGrupos] = useState(true);
    const [errorGrupos, setErrorGrupos] = useState(null);
    const backendUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGrupos = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/grupos`);
                const data = res.data?.grupos ?? res.data ?? [];
                setGrupos(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error cargando grupos", err);
                setErrorGrupos("No se pudieron cargar los grupos");
            } finally {
                setCargandoGrupos(false);
            }
        };
        fetchGrupos();
    }, [backendUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const telefonoNum = (telefono || "").replace(/\D/g, "");
        if (telefonoNum.length !== 10) {
            alert("El teléfono debe tener 10 dígitos");
            return;
        }
        const cbuSan = cbu.trim();
        if (cbuSan && cbuSan.replace(/\D/g, "").length !== 22) {
            alert("El CBU debe tener 22 dígitos");
            return;
        }
        const aliasSan = alias.trim();
        const empleado = {
            apellido,
            nombre,
            telefono: telefonoNum,
            cbu: cbuSan || null,
            alias: aliasSan || null,
            estado,
            id_grupo: idGrupo ? Number(idGrupo) : null,
        };

        try {
                const res = await axios.post(`${backendUrl}/api/empleados`, empleado);
                if (res.status === 201) {
                    alert("Empleado creado correctamente");
                    navigate("/empleados");
                } else {
                    alert("Error al crear empleado");
                }
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.message || "Error de conexión o validación";
            const errs = err?.response?.data?.errors;
            alert(errs ? `${msg}: ${JSON.stringify(errs)}` : msg);
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
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                        Teléfono (10 dígitos)
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="telefono"
                        type="text"
                        placeholder="Ej: 3511234567"
                        value={telefono}
                        onChange={e => setTelefono(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cbu">
                        CBU (opcional)
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="cbu"
                        type="text"
                        maxLength={22}
                        placeholder="22 dígitos"
                        value={cbu}
                        onChange={e => setCbu(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="alias">
                        Alias (opcional)
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="alias"
                        type="text"
                        maxLength={30}
                        placeholder="Alias bancario"
                        value={alias}
                        onChange={e => setAlias(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                        Estado
                    </label>
                    <select
                        id="estado"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={estado}
                        onChange={e => setEstado(e.target.value)}
                        required
                    >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id_grupo">
                        Grupo (opcional)
                    </label>
                    <select
                        id="id_grupo"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={idGrupo}
                        onChange={e => setIdGrupo(e.target.value)}
                        disabled={cargandoGrupos || !!errorGrupos}
                    >
                        <option value="">Sin grupo</option>
                        {grupos.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.denominacion ?? `Grupo ${g.id}`}
                            </option>
                        ))}
                    </select>
                    {cargandoGrupos && <p className="text-sm text-gray-500 mt-1">Cargando grupos...</p>}
                    {errorGrupos && <p className="text-sm text-red-600 mt-1">{errorGrupos}</p>}
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Crear Empleado
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => navigate("/empleados")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}