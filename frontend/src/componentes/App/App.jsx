import Header from '../Templates/Header.jsx';
import AppRouter from '../Router/AppRouter.jsx';

// TODO: re-enable auth
export default function App() {
  return (
    <>
      <div className="flex">
        <Header onLogout={() => {}} />
        <AppRouter />
      </div>
    </>
  );

}
