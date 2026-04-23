import { NavLink } from 'react-router-dom';
import Icon from '../Icons/Icons';

const modules = [
  {
    name: 'Personas',
    description: 'Gestión de personas y rubros',
    icon: 'supplier',
    to: '/personas',
    color: 'indigo',
  },
  {
    name: 'Empleados',
    description: 'Gestión de empleados y documentación',
    icon: 'employee',
    to: '/empleados',
    color: 'violet',
  },
  {
    name: 'Obras',
    description: 'Seguimiento y gestión de obras',
    icon: 'build',
    to: '/obras',
    color: 'sky',
  },
];

const colorMap = {
  indigo: {
    bg: 'bg-indigo-50',
    hover: 'hover:bg-indigo-100',
    icon: 'text-indigo-500',
    border: 'border-indigo-200',
    text: 'text-indigo-600',
  },
  violet: {
    bg: 'bg-violet-50',
    hover: 'hover:bg-violet-100',
    icon: 'text-violet-500',
    border: 'border-violet-200',
    text: 'text-violet-600',
  },
  blue: {
    bg: 'bg-blue-50',
    hover: 'hover:bg-blue-100',
    icon: 'text-blue-500',
    border: 'border-blue-200',
    text: 'text-blue-600',
  },
  sky: {
    bg: 'bg-sky-50',
    hover: 'hover:bg-sky-100',
    icon: 'text-sky-500',
    border: 'border-sky-200',
    text: 'text-sky-600',
  },
};

export default function Home() {
  return (
    <div className="flex-1 min-h-screen  bg-gray-50 p-8">
      <div className="mb-10 flex items-center gap-5">
        <Icon name="logo" className="w-16 h-16" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido al Sistema</h1>
          <p className="text-gray-500 mt-1 text-base">Sinergia CCI — Panel de control</p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-indigo-200 via-gray-200 to-transparent mb-10" />

      <div className='flex justify-items-center'>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
          Módulos del sistema
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map(({ name, description, icon, to, color }) => {
            const c = colorMap[color];
            return (
              <NavLink
                key={name}
                to={to}
                className={`group flex flex-col gap-4 p-6 rounded-2xl border ${c.border} ${c.bg} ${c.hover} transition-all duration-200 shadow-sm hover:shadow-md`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border ${c.border}`}>
                  <Icon name={icon} className={`w-6 h-6 ${c.icon}`} />
                </div>
                <div>
                  <p className={`font-semibold text-base ${c.text}`}>{name}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{description}</p>
                </div>
                <div className={`text-xs font-medium ${c.text} flex items-center gap-1 mt-auto`}>
                  Ir al módulo
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>

      <p className="mt-12 text-xs text-gray-300 text-center">
        Sistema Sinergia CCI · {new Date().getFullYear()}
      </p>
    </div>
  );
}
