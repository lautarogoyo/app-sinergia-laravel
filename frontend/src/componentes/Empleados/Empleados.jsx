import { useState } from "react";
import Icon from "../Icons/Icons";
import { useEmpleados } from "../hooks/useEmpleados.jsx";
import Swal from 'sweetalert2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteEmpleado } from '../api/empleados.js';
import PaginationControls from "../shared/PaginationControls.jsx";
import { usePagination } from "../shared/usePagination.jsx";

const backendUrl = import.meta.env.VITE_API_URL;

export default function Empleados() {

  const [vista, setVista] = useState("activos");
  const [filtro, setFiltro] = useState("");
  const textHeader = "text-xl lg:text-xl";
  const textContent = "text-xl lg:text-xl";
  const { data: empleados = [], isLoading, isError } = useEmpleados();

  const [sortConfig, setSortConfig] = useState({ key: null, dir: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  };

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col) return <span className="ml-1 text-gray-400 text-xs">⇅</span>;
    return <span className="ml-1 text-xs">{sortConfig.dir === "asc" ? "↑" : "↓"}</span>;
  };
  const formatTipoDocumentoLabel = (value) =>
    String(value ?? "").replaceAll("_", " ");
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => DeleteEmpleado(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["empleados"]);
    },
    onError: (error) => {
      console.error("Error al eliminar el empleado", error);
      Swal.fire('Error', 'No se pudo eliminar el empleado', 'error');
    },
  });
  const handleEliminar = (empleado) => {
    Swal.fire({
      title: '¿Eliminar empleado?',
      html: `¿Está seguro que desea eliminar a <strong>${empleado.nombre} ${empleado.apellido}</strong>? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        mutate(empleado.empleado_id);
      }
    });
  };
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
      if (!sortConfig.key) return 0;
      let aVal, bVal;
      if (sortConfig.key === "grupo") {
        aVal = (a.grupo?.nombre_apellido ?? "").toLowerCase();
        bVal = (b.grupo?.nombre_apellido ?? "").toLowerCase();
      } else if (sortConfig.key === "estado") {
        aVal = (a.estado_empleado?.descripcion ?? "").toLowerCase();
        bVal = (b.estado_empleado?.descripcion ?? "").toLowerCase();
      } else {
        aVal = (a[sortConfig.key] ?? "").toString().toLowerCase();
        bVal = (b[sortConfig.key] ?? "").toString().toLowerCase();
      }
      if (aVal < bVal) return sortConfig.dir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.dir === "asc" ? 1 : -1;
      return 0;
    });

  const empleadosPage = usePagination(empleadosFiltrados, 8);

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
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isError) return <div className="text-center text-xl py-8 text-red-500">Error: {isError.message}</div>;

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

      <div className="table-card">
        <div className="table-card__viewport overflow-x-auto">
        <table className="min-w-max table-auto w-full">
          <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
            <tr>
              <th className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Acciones</th>
              <th onClick={() => handleSort("nombre")} className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500 cursor-pointer select-none hover:bg-gray-600 transition`}>
                Nombre<SortIcon col="nombre" />
              </th>
              <th onClick={() => handleSort("apellido")} className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500 cursor-pointer select-none hover:bg-gray-600 transition`}>
                Apellido<SortIcon col="apellido" />
              </th>
              <th onClick={() => handleSort("grupo")} className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500 cursor-pointer select-none hover:bg-gray-600 transition`}>
                Grupo<SortIcon col="grupo" />
              </th>
              <th className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Teléfono</th>
              <th className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Datos Bancarios</th>
              <th onClick={() => handleSort("estado")} className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500 cursor-pointer select-none hover:bg-gray-600 transition`}>
                Estado<SortIcon col="estado" />
              </th>
              <th className={`px-4 py-3 text-left ${textHeader} font-bold text-gray-100 border-b border-gray-500`}>Documentaciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 divide-y divide-gray-200">
            {empleadosPage.paginatedItems.length > 0 ? (
              empleadosPage.paginatedItems.map((empleado) => (
                <tr key={empleado.id} className="hover:bg-gray-200 transition-colors duration-150">
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
                          onClick={() => handleEliminar(empleado)}
                          className="group bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center"
                        >
                          <Icon name="trash" className="h-6 w-6 text-white group-hover:text-yellow-200 transition-colors" />
                          <span className="sr-only">Eliminar</span>
                        </button>

                      </div>

                    </div>
                  </td>
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
        <PaginationControls
          currentPage={empleadosPage.currentPage}
          totalPages={empleadosPage.totalPages}
          totalItems={empleadosPage.totalItems}
          startItem={empleadosPage.startItem}
          endItem={empleadosPage.endItem}
          pageSize={empleadosPage.pageSize}
          onPageSizeChange={empleadosPage.setPageSize}
          hasPrevious={empleadosPage.hasPrevious}
          hasNext={empleadosPage.hasNext}
          onPrevious={() => empleadosPage.setCurrentPage((page) => Math.max(1, page - 1))}
          onNext={() => empleadosPage.setCurrentPage((page) => Math.min(empleadosPage.totalPages, page + 1))}
        />
      </div>
    </div>
  );
}
