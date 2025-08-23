import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { getData } from "../Fetch/get.js";




export default function ManoObra() {
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getData("http://localhost:8000/api/students", "students")
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  if (loading) return <div className="text-center text-xl py-8">Cargando...</div>;
  if (error) return <div className="text-center text-xl py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Listado de Estudiantes</h2>
      <div className="overflow-x-auto w-full max-w-4xl shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-300">
            <tr>
              <th className="px-6 py-3 text-center text-lg font-semibold text-gray-700 border-b border-gray-200">ID</th>
              <th className="px-6 py-3 text-center text-lg font-semibold text-gray-700 border-b border-gray-200">Nombre</th>
              <th className="px-6 py-3 text-center text-lg font-semibold text-gray-700 border-b border-gray-200">Email</th>
              <th className="px-6 py-3 text-center text-lg font-semibold text-gray-700 border-b border-gray-200">Teléfono</th>
              <th className="px-6 py-3 text-center text-lg font-semibold text-gray-700 border-b border-gray-200">Idioma</th>
              <th className="px-6 py-3 text-center text-lg font-semibold text-gray-700 border-b border-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-center">
            {students && students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{student.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{student.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{student.language}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 flex gap-2 justify-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200" onClick={() => window.location.href = `/editar-estudiante/${student.id}`}>Editar</button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200" onClick={() => window.location.href = `/eliminar-estudiante/${student.id}`}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No hay estudiantes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
