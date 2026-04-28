import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Icon from '../Icons/Icons';




export default function Header({ onLogout }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/', { replace: true });
  };
  
  const headerAnimation = `min-h-screen transition-all duration-300 ease-in-out 
    bg-gradient-to-b from-white to-gray-50 shadow-lg overflow-hidden ${visible ? 'w-72' : 'w-16'}`;
    
  const navLinkBase = `flex items-center justify-center ${visible ? 'justify-start gap-4 p-4 mx-3 my-1' : 'p-3 my-1'} rounded-xl transition-all duration-300 
    text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium`;
    
  const navLinkActive = `bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-600 
    border-r-4 border-indigo-500`;
  return (
    <>
      <div className={headerAnimation}>
        <nav className="min-h-screen py-4 flex flex-col relative items-center">
          <div className="mb-6 flex justify-between items-center">
            <div className={`flex items-center ${visible ? 'gap-3 px-4' : 'px-2'} py-6 w-full justify-center`}>
              <Icon name="logo" className="w-10 h-10" />
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
              to="/personas" 
              className={({ isActive }) => 
                `${navLinkBase} ${isActive ? navLinkActive : ''}`}
            >
              <Icon name="supplier" className="w-6 h-6 flex-shrink-0" />
              {visible ? <span className="whitespace-nowrap">Personas</span> : <span className="sr-only">Personas</span>}
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
              to="/obras" 
              className={({ isActive }) => 
                `${navLinkBase} ${isActive ? navLinkActive : ''}`}
            >
              <Icon name="build" className="w-6 h-6 flex-shrink-0" />
              {visible ? <span className="whitespace-nowrap">Obras</span> : <span className="sr-only">Obras</span>}
            </NavLink>
          </div>

          <div className="mt-auto px-3 mb-6">
            <button
              type="button"
              onClick={handleLogout}
              className={`${navLinkBase} mt-2 text-red-600 hover:bg-red-50 w-full`}
            >
              <Icon name="closeSesion" className="w-6 h-6 flex-shrink-0" />
              {visible ? (
                <span className="whitespace-nowrap">Cerrar sesión</span>
              ) : (
                <span className="sr-only">Cerrar sesión</span>
              )}
            </button>
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


