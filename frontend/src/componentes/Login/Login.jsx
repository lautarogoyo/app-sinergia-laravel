import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Icon from '../Icons/Icons.jsx';

export default function Login() {
  const [cargando, setCargando] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      usuario: '',
      contrasena: '',
    },
  });

  const onSubmit = (data) => {
    setCargando(true);
    console.log('Datos de login:', data);
    
    // Simular pequeño delay
    setTimeout(() => {
      setCargando(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-950 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-4">
              <Icon name="logo" className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bienvenido</h1>
            <p className="text-slate-500 text-sm mt-2">Inicia sesión en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errors.usuario && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.usuario.message || 'El usuario es requerido'}
              </div>
            )}
            {errors.contrasena && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.contrasena.message || 'La contraseña es requerida'}
              </div>
            )}

            <div>
              <label htmlFor="usuario" className="block text-sm font-semibold text-slate-700 mb-2">
                Usuario
              </label>
              <input
                id="usuario"
                type="text"
                placeholder="ingresa tu usuario"
                disabled={cargando}
                {...register('usuario', { required: 'El usuario es requerido' })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 text-sm transition-colors focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-sm font-semibold text-slate-700 mb-2">
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                placeholder="ingresa tu contraseña"
                disabled={cargando}
                {...register('contrasena', { required: 'La contraseña es requerida' })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 text-sm transition-colors focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
