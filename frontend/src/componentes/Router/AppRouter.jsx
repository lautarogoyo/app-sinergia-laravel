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
import DiagramaObras from "../Obras/DiagramaObras.jsx";
import Personas from "../Personas/Personas.jsx";
import Finanzas from "../Finanzas/Finanzas.jsx";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/home" element={<Home />} />
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
            <Route path="/finanzas" element={<Finanzas />} />
            
            <Route path="/salir" element={<Navigate to="/home" replace />} />
        </Routes>
    );
}

export default AppRouter;
