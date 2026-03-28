import { useEffect, useState } from 'react';
import Header from '../Templates/Header.jsx';
import AppRouter from '../Router/AppRouter.jsx';
import Login from '../Login/Login.jsx';
import { obtenerUsuarioActual } from '../api/login.js';


export default function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  useEffect(() => {
    const validarSesion = async () => {
      const usuario = await obtenerUsuarioActual();
      setAutenticado(Boolean(usuario));
      setCargandoAuth(false);
    };

    validarSesion();
  }, []);

  if (cargandoAuth) {
    return <div className="min-h-screen bg-blue-950" />;
  }

  if (!autenticado) {
    return (
      <div className=''>
        <Login onLoginSuccess={() => setAutenticado(true)} />
      </div>
    );
  }

  return (
    <>
      <div className="flex">
        <Header onLogout={() => setAutenticado(false)} />
        <AppRouter />
      </div>
    </>
  );

}
