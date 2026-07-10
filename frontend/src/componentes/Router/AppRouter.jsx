import Empleados from "../Empleados/Empleados.jsx";
import Home from "../Home/Home.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import CreateEmpleado from "../Empleados/CreateEmpleado.jsx";
import EditeEmpleado from "../Empleados/EditeEmpleado.jsx";
import EditDocument from "../Empleados/EditDocument.jsx";
import Obras from "../Obras/Obras.jsx";
import CreateObra from "../Obras/CRUD/CreateObra.jsx";
import EditObra from "../Obras/CRUD/EditObra.jsx";
import Gestionar from "../Obras/Gestionar.jsx";
import Gastos from "../Obras/Gastos.jsx";
import PedidoCompraPage from "../Obras/PedidoCompraPage.jsx";
import DiagramaObras from "../Obras/DiagramaObras.jsx";
import Personas from "../Personas/Personas.jsx";
import Finanzas from "../Finanzas/Finanzas.jsx";
import Facturas from "../Finanzas/Facturas.jsx";
import FacturaPage from "../Finanzas/FacturaPage.jsx";
import OrdenesDeCompra from "../Finanzas/OrdenesDeCompra.jsx";
import Login from "../Login/Login.jsx";
import Usuarios from "../Usuarios/Usuarios.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function AppRouter({ isAuthenticated, isAdmin, onLoginSuccess }) {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated
                        ? <Navigate to="/home" replace />
                        : <Login onLoginSuccess={onLoginSuccess} />
                }
            />
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home isAdmin={isAdmin} />} />
                <Route path="/empleados" element={<Empleados />} />
                <Route path="/obras" element={<Obras />} />
                <Route path="/obras/diagrama" element={<DiagramaObras />} />
                <Route path="/personas" element={<Personas />} />
                <Route path="/crear-obra" element={<CreateObra />} />
                <Route path="/editarobra/:id" element={<EditObra />} />
                <Route path="/crear-empleado" element={<CreateEmpleado />} />
                <Route path="/editarempleado/:id" element={<EditeEmpleado />} />
                <Route path="/documentacionempleado/:id" element={<EditDocument />} />
                <Route path="/obra/:id/gestionar" element={<Gestionar />} />
                <Route path="/obra/:id/gastos" element={<Gastos />} />
                <Route path="/obra/:id/gestionar/pedido/nuevo" element={<PedidoCompraPage />} />
                <Route path="/obra/:id/gestionar/pedido/:pedidoId" element={<PedidoCompraPage />} />
                <Route path="/finanzas" element={<Finanzas />} />
                <Route path="/finanzas/facturas" element={<Facturas />} />
                <Route path="/finanzas/facturas/nueva" element={<FacturaPage />} />
                <Route path="/finanzas/facturas/:nroFactura/editar" element={<FacturaPage />} />
                <Route path="/finanzas/ordenes-de-compra" element={<OrdenesDeCompra />} />
                <Route path="/salir" element={<Navigate to="/login" replace />} />
            </Route>
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} requireAdmin isAdmin={isAdmin} />}>
                <Route path="/usuarios" element={<Usuarios />} />
            </Route>
        </Routes>
    );
}

export default AppRouter;
