import { useEffect, useState } from "react";
import { getData } from "../Fetch/get.js";




export default function Empleados() {
  
  
  const [empleados, setempleados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const textHeader = "text-xl lg:text-xl";
  const textContent = "text-xl lg:text-xl";
  const backendUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    getData(`${backendUrl}/api/empleados`, "empleados")
      .then((data) => {
        setempleados(data);
        console.log(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
      <div className="relative">
        
        {/* Texto de carga */}
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Empleados</h2>
          
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
  
  if (error) return <div className="text-center text-xl py-8 text-red-500">Error: {error}</div>;

  // Función para calcular días restantes hasta el vencimiento
  const calcularDiasRestantes = (fechaVencimiento) => {
    if (!fechaVencimiento) return null;
    const hoy = new Date();
    const fechaVenc = new Date(fechaVencimiento);
    const diferencia = fechaVenc - hoy;
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    return dias;
  };

  // Función para determinar las clases CSS según días restantes
  const getDocumentClasses = (fechaVencimiento) => {
    const dias = calcularDiasRestantes(fechaVencimiento);
    if (dias === null) return "bg-gray-200 text-gray-800";
    if (dias <= 30 && dias > 0) return "bg-red-800 text-white";
    if (dias <= 0) return "bg-black text-white";
    return "bg-gray-200 text-gray-800";
  };

  // Filtrado simple por nombre, apellido o grupo
  const empleadosFiltrados = empleados.filter(e => {
    const val = filtro.toLowerCase();
    return (
      e.nombre.toLowerCase().includes(val) ||
      e.apellido.toLowerCase().includes(val) ||
      (e.grupo ? e.grupo.toLowerCase().includes(val) : false)
    );
  });

  return (
    <div className="p-8 bg-gray-100  lg:w-full flex flex-col ">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide">Panel de Empleados</h2>
      <div className="mb-6 w-full max-w-2xl flex flex-col ">
        <label htmlFor="filtro" className="mb-2 text-lg font-medium text-gray-700">Filtrar:</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400 mb-2"
          placeholder="Filtrar por nombre, apellido o grupo..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
        />
        <div className="mt-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer" onClick={() => window.location.href = `/crear-empleado`}>Agregar Empleado</button>
        </div>
      </div>
      
      <div className="shadow-2xl rounded-xl border border-gray-300 bg-white flex flex-col">
        <table className="">
          <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
            <tr>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Nombre</th>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Apellido</th>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Grupo</th>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Teléfono</th>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Datos Bancarios</th>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Estado</th>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Documentaciones</th>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 divide-y divide-gray-200 text-center">
            {empleadosFiltrados.length > 0 ? (
              empleadosFiltrados.map((empleado) => (
                <tr key={empleado.id} className="hover:bg-gray-200 transition-colors duration-150">
                  <td className={`whitespace-nowrap ${textContent} text-gray-800`}>{empleado.nombre}</td>
                  <td className={`whitespace-nowrap ${textContent} text-gray-800`}>{empleado.apellido}</td>
                  <td className={`whitespace-nowrap ${textContent} text-gray-800`}>{empleado.grupo}</td>
                  <td className={`whitespace-nowrap ${textContent} text-gray-800`}>{empleado.telefono}</td>
                  <td className={`whitespace-nowrap text-[18px] text-gray-800 p-6`}>
                    {empleado.cbu} <br />
                    {empleado.alias}
                  </td>
                  <td className={`whitespace-nowrap ${textContent} text-gray-800 ${empleado.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'} font-bold`}>{empleado.estado.toUpperCase()}</td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-700">
                    {empleado.documentaciones.length > 0 ? (
                      empleado.documentaciones.map(doc => {
                        const diasRestantes = calcularDiasRestantes(doc.fecha_vencimiento);
                        const clases = getDocumentClasses(doc.fecha_vencimiento);
                        const mensaje = diasRestantes !== null 
                          ? diasRestantes > 0 
                            ? `Vence en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}`
                            : `Vencido hace ${Math.abs(diasRestantes)} día${Math.abs(diasRestantes) !== 1 ? 's' : ''}`
                          : 'Sin fecha de vencimiento';
                        
                        return (
                          <div 
                            key={doc.id} 
                            className={`${clases} rounded px-2 py-1 mb-3 text-[17px] shadow font-bold hover:bg-opacity-80 cursor-pointer relative group`} 
                            onClick={() => window.open(`${backendUrl}/storage/${doc.path}`, '_blank')}
                            title={mensaje}
                          >
                            {doc.tipo_documento.descripcion.toUpperCase()}
                            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                              {mensaje}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-gray-400 italic">Sin documentos</span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex-1 gap-2 ">
                    <div className="">
                    <div className="flex gap-2 w-full justify-center p-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer" onClick={() => window.location.href = `/editarempleado/${empleado.id}`}>Editar</button>
                      <button className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer" onClick={() => window.location.href = `/eliminarempleado/${empleado.id}`}>Eliminar</button>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 w-full cursor-pointer" onClick={() => window.location.href = `/documentacionempleado/${empleado.id}`}>Cambiar Documentacion</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No hay empleados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
