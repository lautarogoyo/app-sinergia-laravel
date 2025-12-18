import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../Icons/Icons';

const Logo = ({ className }) => (
  <img 
    className={className}
    src="https://static.wixstatic.com/media/739f6f_72ea3433f31a45448cf67888b8f5f6e3~mv2.png/v1/fill/w_89,h_84,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/iczzlYy_edited.png"
    alt="Sinergia Logo"
  />
);

export default function Header() {
  const [visible, setVisible] = useState(true);
  
  const iconAnimation = `w-6 h-6 flex-shrink-0 transition-all duration-300 ${
    visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
  }`;
  
  const arrowAnimationShow = `fixed left-0 top-4 z-50 m-2 p-2 text-gray-600 hover:text-gray-900 
    bg-white/80 backdrop-blur-sm rounded-r-lg shadow-md hover:shadow-lg 
    transition-all duration-300 transform hover:scale-110 ${visible ? 'opacity-0 -translate-x-10' : 'opacity-100'}`;
    
  const arrowAnimationHide = `absolute right-3 top-2 p-1 text-gray-600 hover:text-gray-900 
    bg-white/50 rounded-full hover:bg-white/80 transition-all duration-300 
    transform hover:scale-110`;
    
  const headerAnimation = `h-screen transition-all duration-300 ease-in-out 
    bg-gradient-to-b from-white to-gray-50 shadow-lg overflow-hidden ${visible ? 'w-72' : 'w-16'}`;
    
  const navLinkBase = `flex items-center justify-center ${visible ? 'justify-start gap-4 p-4 mx-3 my-1' : 'p-3 my-1'} rounded-xl transition-all duration-300 
    text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium`;
    
  const navLinkActive = `bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-600 
    border-r-4 border-indigo-500`;
  return (
    <>
      <div className={headerAnimation}>
        <nav className="h-full py-4 flex flex-col relative items-center">
          <div className="mb-6 flex justify-between items-center">
            <div className={`flex items-center ${visible ? 'gap-3 px-4' : 'px-2'} py-6 w-full justify-center`}>
              <Logo className="w-10 h-10" />
              {visible && (
                <h1 className="text-lg font-bold bg-gray-600 bg-clip-text text-transparent ">
                  SINERGIA CCI
                </h1>
              )}
            </div>
            {visible && (
              <button 
                className="absolute right-0 top-4 z-50 p-2 text-gray-600 hover:text-gray-900 
                  bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 
                  transform hover:scale-110 border border-gray-200"
                onClick={() => setVisible(false)}
                aria-label="Ocultar menú"
              >
                <Icon name="arrowhide" className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="mt-6 space-y-1 px-3">
            <NavLink 
              to="/home" 
              className={({ isActive }) => 
                `${navLinkBase} ${isActive ? navLinkActive : ''}`}
            >
              <Icon name="house" className="w-6 h-6 flex-shrink-0" />
              {visible ? <span className="whitespace-nowrap">Inicio</span> : <span className="sr-only">Inicio</span>}
            </NavLink>
            
            <NavLink 
              to="/proveedores" 
              className={({ isActive }) => 
                `${navLinkBase} ${isActive ? navLinkActive : ''}`}
            >
              <Icon name="supplier" className="w-6 h-6 flex-shrink-0" />
              {visible ? <span className="whitespace-nowrap">Proveedores</span> : <span className="sr-only">Proveedores</span>}
            </NavLink>
            
            <NavLink 
              to="/empleados" 
              className={({ isActive }) => 
                `${navLinkBase} ${isActive ? navLinkActive : ''}`}
            >
              <Icon name="employee" className="w-6 h-6 flex-shrink-0" />
              {visible ? <span className="whitespace-nowrap">Empleados</span> : <span className="sr-only">Empleados</span>}
            </NavLink>

            <NavLink 
              to="/grupos" 
              className={({ isActive }) => 
                `${navLinkBase} ${isActive ? navLinkActive : ''}`}
            >
              <Icon name="group" className="w-6 h-6 flex-shrink-0" />
              {visible ? <span className="whitespace-nowrap">Grupos</span> : <span className="sr-only">Grupos</span>}
            </NavLink>
            
            <NavLink 
              to="/obras" 
              className={({ isActive }) => 
                `${navLinkBase} ${isActive ? navLinkActive : ''}`}
            >
              <Icon name="build" className="w-6 h-6 flex-shrink-0" />
              {visible ? <span className="whitespace-nowrap">Obras</span> : <span className="sr-only">Obras</span>}
            </NavLink>
          </div>
          
          <div className="mt-auto px-3 mb-6">
            <NavLink 
              to="/salir" 
              className={`${navLinkBase} mt-2 text-red-600 hover:bg-red-50`}
            >
              <Icon name="closeSesion" className="w-6 h-6 flex-shrink-0" />
              {visible ? <span className="whitespace-nowrap">Cerrar sesión</span> : <span className="sr-only">Cerrar sesión</span>}
            </NavLink>
          </div>
        </nav>
      </div>
      
      {!visible && (
        <button 
          className="fixed left-0 top-4 z-50 m-2 p-2 text-gray-600 hover:text-gray-900 
            bg-white/80 backdrop-blur-sm rounded-r-lg shadow-md hover:shadow-lg 
            transition-all duration-300 transform hover:scale-110"
          onClick={() => setVisible(true)}
          aria-label="Mostrar menú"
        >
          <Icon name="arrowshow" className="w-5 h-5" />
        </button>
      )}
    </>
  );
}


