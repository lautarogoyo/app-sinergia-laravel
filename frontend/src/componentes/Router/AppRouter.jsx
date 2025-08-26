import Empleados from "../Empleados/Empleados.jsx";
import Home from "../Home/Home.jsx";
import { Routes, Route } from "react-router-dom";
import CreateEmpleado from "../Empleados/CreateEmpleado.jsx";
import Editor from "../Empleados/EditeEmpleado.jsx";
import RemoveEmpleado from "../Empleados/RemoveEmpleado.jsx";


function AppRouter() {
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/crear-empleado" element={<CreateEmpleado />} />
            <Route path="/editar-empleado/:id" element={<Editor />} />
            <Route path="/remove-empleado/:id" element={<RemoveEmpleado />} />
            <Route path="/obras" element={<div>Obras</div>} />
            <Route path="/empleados" element={<div>Empleados</div>} />
            <Route path="/salir" element={<div>Salir</div>} />
        </Routes>
    );
}

export default AppRouter;