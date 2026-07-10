import { useState } from "react";
import Icon from "../Icons/Icons";
import { useUsuarios } from "../hooks/useUsuarios.jsx";
import Swal from 'sweetalert2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteUsuario, PostUsuario, UpdateUsuario } from '../api/usuarios.js';
import UsuarioModal from './UsuarioModal.jsx';

export default function Usuarios() {
  const [filtro, setFiltro] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const { data: usuarios = [], isLoading, isError } = useUsuarios();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => DeleteUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["usuarios"]);
    },
    onError: (error) => {
      console.error("Error al eliminar el usuario", error);
      Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
    },
  });

  const { mutate: guardarUsuario, isPending: isSaving } = useMutation({
    mutationFn: (data) =>
      usuarioEditando
        ? UpdateUsuario(usuarioEditando.usuario_id, data)
        : PostUsuario(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["usuarios"]);
      setModalAbierto(false);
      setUsuarioEditando(null);
    },
    onError: (error) => {
      console.error("Error al guardar el usuario", error);
      Swal.fire('Error', error?.response?.data?.message || 'No se pudo guardar el usuario', 'error');
    },
  });

  const handleAbrirCrear = () => {
    setUsuarioEditando(null);
    setModalAbierto(true);
  };

  const handleAbrirEditar = (usuario) => {
    setUsuarioEditando(usuario);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEditando(null);
  };

  const handleEliminar = (usuario) => {
    Swal.fire({
      title: '¿Eliminar usuario?',
      html: `¿Está seguro que desea eliminar a <strong>${usuario.nombre} ${usuario.apellido}</strong>? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        mutate(usuario.usuario_id);
      }
    });
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const val = filtro.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(val) ||
      u.apellido.toLowerCase().includes(val) ||
      u.nombre_usuario.toLowerCase().includes(val) ||
      u.email.toLowerCase().includes(val)
    );
  });

  if (isLoading) {
		return (
			<div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
				<div className="relative">
					<div className="mt-8 text-center">
						<h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Cargando Usuarios</h2>
						<div className="w-80 h-3 bg-gray-700 rounded-full overflow-hidden shadow-lg">
							<div className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full animate-loading-bar"></div>
						</div>
						<div className="mt-4 flex justify-center gap-2">
							<span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
							<span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
							<span className="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
						</div>
					</div>
				</div>
			</div>
		);
	}

  if (isError) return <div className="text-center text-xl py-8 text-red-500">Error: {isError.message}</div>;

  return (
    <div className="p-8 bg-gray-100 lg:w-full flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide">Panel de Usuarios</h2>
        <button
          onClick={handleAbrirCrear}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          + Nuevo usuario
        </button>
      </div>
      <div className="mb-6 w-full max-w-2xl flex flex-col">
        <label htmlFor="filtro" className="mb-2 text-lg font-medium text-gray-700">Filtrar:</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400 mb-2"
          placeholder="Filtrar por nombre, apellido, usuario o email..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <div className="table-card">
        <div className="table-card__viewport overflow-x-auto">
          <table className="min-w-max table-auto w-full">
            <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-xl font-bold text-gray-100 border-b border-gray-500"></th>
                <th className="px-4 py-3 text-left text-xl font-bold text-gray-100 border-b border-gray-500">Usuario</th>
                <th className="px-4 py-3 text-left text-xl font-bold text-gray-100 border-b border-gray-500">Nombre</th>
                <th className="px-4 py-3 text-left text-xl font-bold text-gray-100 border-b border-gray-500">Apellido</th>
                <th className="px-4 py-3 text-left text-xl font-bold text-gray-100 border-b border-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-xl font-bold text-gray-100 border-b border-gray-500">Admin</th>
              </tr>
            </thead>
            <tbody className="bg-gray-50 divide-y divide-gray-200">
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.usuario_id} className="hover:bg-gray-200 transition-colors duration-150">
                    <td className="px-4 py-3 max-w-[160px]">
                      <div className="flex gap-4 w-full justify-center p-2">
                        <button
                          title="Editar"
                          onClick={() => handleAbrirEditar(usuario)}
                          className="group bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center"
                        >
                          <Icon name="pencil" className="h-6 w-6 text-white transition-colors" />
                          <span className="sr-only">Editar</span>
                        </button>
                        <button
                          title="Eliminar"
                          onClick={() => handleEliminar(usuario)}
                          className="group bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white p-3 rounded shadow transition duration-150 flex items-center justify-center"
                        >
                          <Icon name="trash" className="h-6 w-6 text-white group-hover:text-yellow-200 transition-colors" />
                          <span className="sr-only">Eliminar</span>
                        </button>
                      </div>
                    </td>
                    <td className="text-xl text-gray-800 px-4 py-3 break-words max-w-[180px]">{usuario.nombre_usuario}</td>
                    <td className="text-xl text-gray-800 px-4 py-3 break-words max-w-[180px]">{usuario.nombre}</td>
                    <td className="text-xl text-gray-800 px-4 py-3 break-words max-w-[180px]">{usuario.apellido}</td>
                    <td className="text-xl text-gray-800 px-4 py-3 break-words max-w-[220px]">{usuario.email}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-3 py-1 font-bold text-white rounded ${usuario.admin ? 'bg-green-500' : 'bg-gray-400'}`}>
                        {usuario.admin ? 'SI' : 'NO'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No hay usuarios</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAbierto && (
        <UsuarioModal
          usuario={usuarioEditando}
          onClose={handleCerrarModal}
          onSubmit={guardarUsuario}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
