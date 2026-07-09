import Header from '../Templates/Header.jsx';
import AppRouter from '../Router/AppRouter.jsx';
import { useLocation } from 'react-router-dom';


// TODO: re-enable auth
export default function App() {
  const location = useLocation();
  const showHeader = location.pathname !== '/home';

  return (
    <>
      <div className="flex min-h-screen items-stretch">
        {showHeader && <div className="shrink-0 flex"><Header /></div>}
        <div className="flex-1 min-w-0 flex flex-col">
          <AppRouter />
        </div>
      </div>
    </>
  );

}
