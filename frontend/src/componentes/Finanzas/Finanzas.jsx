import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../Icons/Icons';

const modules = [
  {
    name: 'Facturas',
    description: 'Gestión y seguimiento de facturas',
    to: '/finanzas/facturas',
    color: 'emerald',
    customIcon: (
      <svg viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-500">
        <path d="M192 96C156.7 96 128 124.7 128 160L128 384C128 419.3 156.7 448 192 448L544 448C579.3 448 608 419.3 608 384L608 160C608 124.7 579.3 96 544 96L192 96zM368 192C412.2 192 448 227.8 448 272C448 316.2 412.2 352 368 352C323.8 352 288 316.2 288 272C288 227.8 323.8 192 368 192zM192 216L192 168C192 163.6 195.6 160 200 160L248 160C252.4 160 256.1 163.6 255.5 168C251.9 197 228.9 219.9 200 223.5C195.6 224 192 220.4 192 216zM192 328C192 323.6 195.6 319.9 200 320.5C229 324.1 251.9 347.1 255.5 376C256 380.4 252.4 384 248 384L200 384C195.6 384 192 380.4 192 376L192 328zM536 223.5C507 219.9 484.1 196.9 480.5 168C480 163.6 483.6 160 488 160L536 160C540.4 160 544 163.6 544 168L544 216C544 220.4 540.4 224.1 536 223.5zM544 328L544 376C544 380.4 540.4 384 536 384L488 384C483.6 384 479.9 380.4 480.5 376C484.1 347 507.1 324.1 536 320.5C540.4 320 544 323.6 544 328zM80 216C80 202.7 69.3 192 56 192C42.7 192 32 202.7 32 216L32 480C32 515.3 60.7 544 96 544L488 544C501.3 544 512 533.3 512 520C512 506.7 501.3 496 488 496L96 496C87.2 496 80 488.8 80 480L80 216z" />
      </svg>
    ),
  },
  {
    name: 'Órdenes de Compra',
    description: 'Gestión de órdenes de compra',
    to: '/finanzas/ordenes-de-compra',
    color: 'amber',
    customIcon: (
      <div className="w-6 h-6 flex items-center justify-center text-black-500 font-semibold">OC</div>
    ),
  },
];

const colorMap = {
  emerald: {
    icon: 'text-emerald-500',
  },
  amber: {
    icon: 'text-amber-500',
  },
};

export default function Finanzas() {
  return (
    <div className="flex-1 min-h-screen bg-gray-50 p-8">
      <div className="mb-10 flex items-center gap-5">
        <Icon name="finance" className="w-16 h-16 text-indigo-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">FINANZAS</h1>
          <p className="text-gray-500 mt-1 text-base">Sinergia CCI — Gestión financiera</p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-indigo-200 via-gray-200 to-transparent mb-10" />

      <div className="flex justify-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {modules.map(({ name, description, icon, to, color, customIcon }) => {
            const c = colorMap[color];
            return (
              <NavLink
                key={name}
                to={to}
                className="group flex flex-col gap-4 p-6 rounded-2xl border-2 border-gray-200 bg-white transition-all duration-200 shadow-sm hover:border-[#2c4d81] hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 shadow-sm border-2 border-gray-200 transition-all duration-200 group-hover:border-[#2c4d81]">
                  {customIcon ? (
                    customIcon
                  ) : (
                    <Icon name={icon} className={`w-6 h-6 ${c.icon}`} />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-base text-gray-800">{name}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{description}</p>
                </div>
                <div className="text-xs font-medium text-gray-600 group-hover:text-[#2c4d81] flex items-center gap-1 mt-auto transition-colors duration-200">
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