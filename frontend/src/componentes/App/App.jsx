import { useEffect, useState } from 'react';
import Header from '../Templates/Header.jsx';
import AppRouter from '../Router/AppRouter.jsx';
import { useLocation } from 'react-router-dom';
import { obtenerUsuarioActual, logoutUsuario } from '../api/login.js';

export default function App() {
  const location = useLocation();
  const showHeader = location.pathname !== '/home' && location.pathname !== '/login';
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    obtenerUsuarioActual().then((data) => {
      setUsuario(data);
      setCargandoSesion(false);
    });
  }, []);

  if (cargandoSesion) {
    return null;
  }

  const handleLogout = async () => {
    await logoutUsuario();
    setUsuario(null);
  };

  return (
    <div className="flex min-h-screen items-stretch">
      {showHeader && <div className="shrink-0 flex"><Header onLogout={handleLogout} isAdmin={!!usuario?.admin} /></div>}
      <div className="flex-1 min-w-0 flex flex-col">
        <AppRouter
          isAuthenticated={!!usuario}
          isAdmin={!!usuario?.admin}
          onLoginSuccess={setUsuario}
        />
      </div>
    </div>
  );
}
