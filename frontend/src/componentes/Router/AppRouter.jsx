import Empleados from "../Empleados/Empleados.jsx";
import Home from "../Home/Home.jsx";
import { Routes, Route } from "react-router-dom";
import CreateEmpleado from "../Empleados/CreateEmpleado.jsx";
import EditeEmpleado from "../Empleados/EditeEmpleado.jsx";
import RemoveEmpleado from "../Empleados/RemoveEmpleado.jsx";
import EditDocument from "../Empleados/EditDocument.jsx";
import Obras from "../Obras/Obras.jsx";
import Grupos from "../Grupos/Grupos.jsx";


function AppRouter() {
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/obras" element={<Obras />} />
            <Route path="/grupos" element={<Grupos />} />
            <Route path="/crear-empleado" element={<CreateEmpleado />} />
            <Route path="/editarempleado/:id" element={<EditeEmpleado />} />
            <Route path="/eliminarempleado/:id" element={<RemoveEmpleado />} />
            <Route path="/documentacionempleado/:id" element={<EditDocument />} />
            <Route path="/obras" element={<div>Obras</div>} />
            <Route path="/empleados" element={<div>Empleados</div>} />
            <Route path="/salir" element={<div>Salir</div>} />
        </Routes>
    );
}

export default AppRouter;