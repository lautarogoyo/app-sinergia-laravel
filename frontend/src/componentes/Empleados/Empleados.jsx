import { useState } from "react";
import Icon from "../Icons/Icons";
import { useEmpleados } from "../hooks/useEmpleados.jsx";

const backendUrl = import.meta.env.VITE_API_URL;

export default function Empleados() {
  
  const [vista, setVista] = useState("activos");
  const [ordenEstado, setOrdenEstado] = useState(null);
  const [filtro, setFiltro] = useState("");
  const textHeader = "text-xl lg:text-xl";
  const textContent = "text-xl lg:text-xl";
  const { data: empleados = [], isLoading, isError } = useEmpleados();
  const formatTipoDocumentoLabel = (value) =>
    String(value ?? "").replaceAll("_", " ");
  
  if (isLoading) return (
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
  
  if (isError) return <div className="text-center text-xl py-8 text-red-500">Error: {isError.message}</div>;

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
    const matchTexto = (
        e.nombre.toLowerCase().includes(val) ||
        e.apellido.toLowerCase().includes(val) ||
        (e.grupo?.nombre_apellido?.toLowerCase().includes(val) ?? false)
    );
    const matchVista = 
      vista === "archivados" ? !!e.archivado_at :
      vista === "cancelados" ? !!e.cancelado_at :
      !e.archivado_at && !e.cancelado_at;

      return matchTexto && matchVista;
    })
      .sort((a, b) => {
          if (!ordenEstado) return 0;
          const descA = a.estado_empleado?.descripcion ?? "";
          const descB = b.estado_empleado?.descripcion ?? "";
          return ordenEstado === "asc"
              ? descA.localeCompare(descB)
              : descB.localeCompare(descA);
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
        <div className="mt-2 flex justify-between items-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer" onClick={() => window.location.href = `/crear-empleado`}>
              Agregar Empleado
          </button>
          <div className="flex gap-2 items-end justify-end">
              <button
                  className={`text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer ${vista === "archivados" ? "bg-yellow-500 text-white" : "bg-white border border-yellow-500 text-yellow-500 hover:bg-yellow-50"}`}
                  onClick={() => setVista(v => v === "archivados" ? null : "archivados")}

              >
                  <span className="inline-flex items-center gap-1">
                  <Icon name="archive" className="h-5 w-5" />
                  </span>
              </button>
              <button
                  className={`text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer ${vista === "cancelados" ? "bg-red-500 text-white" : "bg-white border border-red-500 text-red-500 hover:bg-red-50"}`}
                  onClick={() => setVista(v => v === "cancelados" ? null : "cancelados")}
              >
                  <span className="inline-flex items-center gap-1">
                  <Icon name="canceled" className="h-5 w-5" />
                  </span>
              </button>
          </div>
      </div>
      </div>
      
      <div className="shadow-2xl rounded-xl border border-gray-300 bg-white flex flex-col overflow-x-auto">
        <table className="min-w-full table-auto w-full">
          <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
            <tr>
              <th className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Nombre</th>
              <th className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Apellido</th>
              <th className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Grupo</th>
              <th className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Teléfono</th>
              <th className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Datos Bancarios</th>
              <th
                  className={`px-3 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500 cursor-pointer select-none`}
                  onClick={() => setOrdenEstado(o => o === "asc" ? "desc" : "asc")}
              >
                  Estado {ordenEstado === "asc" ? "↑" : ordenEstado === "desc" ? "↓" : "↕"}
              </th>
              <th className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Documentaciones</th>
              <th className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 divide-y divide-gray-200">
            {empleadosFiltrados.length > 0 ? (
              empleadosFiltrados.map((empleado) => (
                <tr key={empleado.id} className="hover:bg-gray-200 transition-colors duration-150">
                  <td className={`${textContent} text-gray-800 px-4 py-3 break-words max-w-[180px]`}>{empleado.nombre}</td>
                  <td className={`${textContent} text-gray-800 px-4 py-3 break-words max-w-[180px]`}>{empleado.apellido}</td>
                  <td className={`${textContent} text-gray-800 px-4 py-3 break-words max-w-[200px]`}>{empleado.grupo?.nombre_apellido}</td>
                  <td className={`${textContent} text-gray-800 px-4 py-3 break-words max-w-[170px]`}>{empleado.telefono}</td>
                  <td className={`text-[18px] text-gray-800 px-4 py-3 max-w-[260px] break-words`}>
                    <div className="truncate">{empleado.cbu}</div>
                    <div className="text-sm text-gray-600 break-words">{empleado.alias}</div>
                  </td>
                  <td className={`px-4 py-3 text-center`}> 
                    <span className={`inline-block px-3 py-1 font-bold text-white rounded ${empleado.estado_empleado?.descripcion?.toLowerCase() === 'activo' ? 'bg-green-500' : 'bg-red-500'}`}>
                      {empleado.estado_empleado?.descripcion?.toUpperCase() ?? '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-[320px]">
                    {empleado.documentaciones.length > 0 ? (
                      empleado.documentaciones.map(doc => {
                        const nombreArchivo = doc.path ? doc.path.split('/').pop() : '';
                        const diasRestantes = calcularDiasRestantes(doc.fecha_vencimiento);
                        const clases = getDocumentClasses(doc.fecha_vencimiento);
                        const mensaje = diasRestantes !== null 
                          ? diasRestantes > 0 
                            ? `Vence en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}`
                            : `Vencido hace ${Math.abs(diasRestantes)} día${Math.abs(diasRestantes) !== 1 ? 's' : ''}`
                          : 'Sin fecha de vencimiento';
                        
                        return (
                          <div 
                            key={doc.documentacion_id} 
                            className={`${clases} rounded px-2 py-1 mb-2 text-[15px] shadow font-bold hover:bg-opacity-80 cursor-pointer relative group inline-block mr-2`} 
                            onClick={() => window.open(
                              `${backendUrl}/api/empleados/${empleado.empleado_id}/documentaciones/${doc.documentacion_id}/preview/${encodeURIComponent(nombreArchivo)}`,
                              '_blank'
                            )}
                            title={mensaje}
                          >
                            {formatTipoDocumentoLabel(doc.tipo_documentacion.descripcion).toUpperCase()}
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
                  <td className="px-4 py-3 max-w-[260px]">
                    <div className="">
                    <div className="flex gap-4 w-full justify-center p-2">
                      <button
                        title="Cambiar Documentación"
                        onClick={() => window.location.href = `/documentacionempleado/${empleado.empleado_id}`}
                        className="group bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center"
                      >
                        <Icon name="filetext" className="h-6 w-6 text-white group-hover:text-yellow-200 transition-colors" />
                        <span className="sr-only">Cambiar Documentación</span>
                      </button>
                      <button
                        title="Editar"
                        onClick={() => window.location.href = `/editarempleado/${empleado.empleado_id}`}
                        className="group bg-yellow-300 hover:bg-yellow-400 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center"
                      >
                        <Icon name="pencil" className="h-6 w-6 text-white group-hover:text-yellow-200 transition-colors" />
                        <span className="sr-only">Editar</span>
                      </button>
                      <button
                        title="Eliminar"
                        onClick={() => window.location.href = `/eliminarempleado/${empleado.empleado_id}`}
                        className="group bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center"
                      >
                        <Icon name="trash" className="h-6 w-6 text-white group-hover:text-yellow-200 transition-colors" />
                        <span className="sr-only">Eliminar</span>
                      </button>
                      
                    </div>
                    
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
