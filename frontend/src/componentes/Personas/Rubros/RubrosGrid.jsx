export default function RubrosGrid({ rubros, onEdit, onDelete }) {
  return (
    <div className="shadow-2xl rounded-xl border border-gray-300 bg-white flex flex-col overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
          <tr>
            <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">ID</th>
            <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Descripción</th>
            <th className="px-6 py-3 text-center text-xl font-bold text-gray-100 border-b border-gray-500">Acciones</th>
          </tr>
        </thead>

        <tbody className="bg-gray-50 divide-y divide-gray-200 text-center">
          {rubros.length > 0 ? (
            rubros.map((rubro) => (
              <tr key={rubro.rubro_id} className="hover:bg-gray-200 transition-colors duration-150">
                <td className="text-lg text-gray-500 px-4 py-3">{rubro.rubro_id}</td>
                <td className="text-lg text-gray-800 px-4 py-3">{rubro.descripcion ?? "Sin descripción"}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-center flex-wrap">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
                      onClick={() => onEdit(rubro)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer"
                      onClick={() => onDelete(rubro)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No hay rubros</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
