import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { getData } from "../Fetch/get.js";




export default function Empleados() {
  
  
  const [empleados, setempleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const textHeader = "text-3xl";
  const textContent = "text-2xl";
  useEffect(() => {
    getData("http://localhost:8000/api/empleados", "empleados")
      .then((data) => {
        setempleados(data);
        setLoading(false);
        console.log(data);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  if (loading) return <div className="text-center text-xl py-8">Cargando...</div>;
  if (error) return <div className="text-center text-xl py-8 text-red-500">Error: {error}</div>;

  return (
    
    <div className="p-8 bg-gray-100 min-h-screen w-full flex flex-col items-center">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide">Panel de Empleados</h2>
      <div className="shadow-2xl rounded-xl border border-gray-300 bg-white flex flex-col items-center">
        <table className="">
          <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
            <tr>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Nombre</th>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Apellido</th>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Grupo</th>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Teléfono</th>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Estado</th>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Documentaciones</th>
              <th className={`px-6 py-3 text-center ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 divide-y divide-gray-200 text-center">
            {empleados.length > 0 ? (
              empleados.map((empleado) => (
                <tr key={empleado.id} className="hover:bg-gray-200 transition-colors duration-150">
                  <td className={`px-6 py-4 whitespace-nowrap ${textContent} text-gray-800`}>{empleado.nombre}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${textContent} text-gray-800`}>{empleado.apellido}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${textContent} text-gray-800`}>{empleado.grupo}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${textContent} text-gray-800`}>{empleado.telefono}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${textContent} text-gray-800 bg-green-500 font-bold`}>{empleado.estado.toUpperCase()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {empleado.documentaciones.length > 0 ? (
                      empleado.documentaciones.map(doc => (
                        <div key={doc.id} className="bg-gray-200 rounded px-2 py-1 mb-3 text-xl text-gray-800 shadow font-bold" onClick={()=> window.location.href = `assets/documentacion_empleados/${doc.path_archivo_documento}`}>
                          {doc.tipo_documento.descripcion.toUpperCase()}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 italic">Sin documentos</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base flex gap-2 justify-center">
                    <button className={`bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold py-2 px-4 rounded shadow transition duration-150`} onClick={() => window.location.href = `/editarempleado/${empleado.id}`}>Editar</button>
                    <button className={`bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-2 px-4 rounded shadow transition duration-150`} onClick={() => window.location.href = `/eliminar-empleado/${empleado.id}`}>Eliminar</button>
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
