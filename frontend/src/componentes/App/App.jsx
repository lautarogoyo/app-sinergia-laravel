import Header from '../Templates/Header.jsx';
import AppRouter from '../Router/AppRouter.jsx';
import { useLocation } from 'react-router-dom';


// TODO: re-enable auth
export default function App() {
  const location = useLocation();
  const showHeader = location.pathname !== '/home';

  return (
    <>
      <div className="flex">
        {showHeader && <Header />}
        <AppRouter />
      </div>
    </>
  );

}
