import Header from '../Templates/Header.jsx';
import AppRouter from '../Router/AppRouter.jsx';
import Login from '../Login/Login.jsx';


export default function App() {
  
  return (
    <>
      <div className=''>
        <Login />
      </div>
      
      <div className="flex">
        <Header />
        <AppRouter />
      </div>
    </>
  );

}
