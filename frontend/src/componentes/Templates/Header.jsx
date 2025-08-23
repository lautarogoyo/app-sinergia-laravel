import {useState} from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../Icons/Icons';

export default function Header() {
  const [visible, setVisible] = useState(true);
  console.log(visible);
  const iconAnimation = `w-6 h-6 flex-shrink-0 transition-all duration-500 ${
    visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
  }`;
  const arrowAnimationShow = `m-4 text-xl flex max-h-12 justify-end p-2 hover:scale-x-150 hover:scale-y-101 transition-all duration-300 overflow-hidden ${visible ? "w-0": "w-10 overflow-visible"}`;
  const arrowAnimationHide = `m-4 text-xl flex justify-end p-2 hover:scale-x-120 hover:scale-y-101 transition duration-300`;
  const headerAnimation = `transition-all duration-500 ${visible ? "w-64" : "w-10 overflow-hidden"}`;
  return (
    <>
    <div
      className={`
        ${headerAnimation}
        bg-gradient-to-b from-gray-50 to-gray-200 h-screen flex flex-col
      `}
    >
      <nav className="bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col mt-2 h-full transition-all duration-500 overflow-hidden">
        
        <button className={arrowAnimationHide} onClick={() => setVisible(!visible)}>
          <Icon name="arrowhide"/>
        </button>
        <NavLink className="m-4 text-3xl font-sans font-semibold flex items-center gap-3 hover:text-black cursor-pointer hover:opacity-95" to="/home"><Icon name="house" className={iconAnimation}/>Inicio</NavLink>
        <NavLink className="m-4 text-3xl font-sans font-semibold flex items-center gap-3 hover:text-black cursor-pointer" to="/proveedores"><Icon name="supplier" className={iconAnimation} />Proveedores</NavLink>
        <NavLink className="m-4 text-3xl font-sans font-semibold flex items-center gap-3 hover:text-black cursor-pointer" to="/empleados">
          <Icon name="employee" className={iconAnimation}/>
          Empleados
        </NavLink>
        <NavLink className="m-4 text-3xl font-sans font-semibold flex items-center gap-3 hover:text-black cursor-pointer" to="/obras"><Icon name="build" className={iconAnimation}/>Obras</NavLink>
        <NavLink className="m-4 text-3xl font-sans font-semibold flex items-center gap-3 hover:text-black cursor-pointer" to="/salir"><Icon name="closeSesion" className={iconAnimation}/>Salir</NavLink>
        {/*<div className="m-4 text-3xl font-sans font-semibold flex items-center gap-3"><Icon name="" />Usuarios</div>*/}
      </nav>
    </div>
    <button className={arrowAnimationShow} onClick={() => setVisible(!visible)}>
      <Icon name="arrowshow"/>
    </button>
    </>
  );
}


