import Empleados from "../Empleados/Empleados.jsx";
import Home from "../Home/Home.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import CreateEmpleado from "../Empleados/CreateEmpleado.jsx";
import EditeEmpleado from "../Empleados/EditeEmpleado.jsx";
import RemoveEmpleado from "../Empleados/RemoveEmpleado.jsx";
import EditDocument from "../Empleados/EditDocument.jsx";
import Obras from "../Obras/Obras.jsx";
import CreateObra from "../Obras/CreateObra.jsx";
import EditObra from "../Obras/EditObra.jsx";
import Grupos from "../Grupos/Grupos.jsx";
import CreateGrupo from "../Grupos/CreateGrupo.jsx";
import EditGrupo from "../Grupos/EditGrupo.jsx";
import RemoveGrupo from "../Grupos/RemoveGrupo.jsx";
import Gestionar from "../Obras/Gestionar.jsx";
import DiagramaObras from "../Obras/DiagramaObras.jsx";
import Personas from "../Personas/Personas.jsx";
import Rubros from "../Personas/Rubros/Rubros.jsx";
import CreatePersona from "../Personas/Proveedores/CreatePersona.jsx";
import EditPersona from "../Personas/Proveedores/EditPersona.jsx";
import RemovePersona from "../Personas/Proveedores/RemovePersona.jsx";

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
            <Route path="/rubros" element={<Rubros />} />
            <Route path="/crear-persona" element={<CreatePersona />} />
            <Route path="/editarpersona/:id" element={<EditPersona />} />
            <Route path="/eliminarpersona/:id" element={<RemovePersona />} />
            <Route path="/crear-obra" element={<CreateObra />} />
            <Route path="/editarobra/:id" element={<EditObra />} />
            <Route path="/grupos" element={<Grupos />} />
            <Route path="/crear-empleado" element={<CreateEmpleado />} />
            <Route path="/editarempleado/:id" element={<EditeEmpleado />} />
            <Route path="/eliminarempleado/:id" element={<RemoveEmpleado />} />
            <Route path="/crear-grupo" element={<CreateGrupo />} />
            <Route path="/editargrupo/:id" element ={<EditGrupo />} />
            <Route path="/eliminargrupo/:id" element ={<RemoveGrupo />} />
            <Route path="/documentacionempleado/:id" element={<EditDocument />} />
            <Route path="/obras" element={<div>Obras</div>} />
            <Route path="/obra/:id/gestionar" element={<Gestionar />} />
            <Route path="/empleados" element={<div>Empleados</div>} />
            <Route path="/salir" element={<Navigate to="/home" replace />} />
        </Routes>
    );
}

export default AppRouter;
