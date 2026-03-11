import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearProveedor, getFormDefaults } from "./proveedoresStorage.js";

export default function CreatePersona() {
  const navigate = useNavigate();
  const [form, setForm] = useState(getFormDefaults());

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;

    crearProveedor(form);
    navigate("/personas");
  };

  return (
    <div className="p-8 bg-gray-100 w-full flex flex-col items-center">
      <h1 className="text-3xl text-gray-800 mb-6 font-sans">Crear Proveedor</h1>
      <form className="w-full max-w-3xl bg-white shadow-2xl rounded-xl border border-gray-300 p-6 space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-3 lg:grid-cols-4">
          <input
            value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
            placeholder="Nombre *"
            required
          />
          <input
            value={form.apellido}
            onChange={(e) => handleChange("apellido", e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
            placeholder="Apellido"
          />
          <input
            value={form.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
            placeholder="Telefono"
            maxLength={10}
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
            placeholder="Email"
          />
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <input
            type="date"
            value={form.fecha_ingreso}
            onChange={(e) => handleChange("fecha_ingreso", e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
          />
          <input
            value={form.direccion}
            onChange={(e) => handleChange("direccion", e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
            placeholder="Direccion"
          />
          <label className="flex items-center gap-2 px-2 text-gray-700 font-semibold">
            <input
              type="checkbox"
              checked={form.monotributista}
              onChange={(e) => handleChange("monotributista", e.target.checked)}
              className="h-5 w-5 accent-blue-600"
            />
            Monotributista
          </label>
        </div>
        <textarea
          value={form.comentario}
          onChange={(e) => handleChange("comentario", e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:border-blue-400"
          placeholder="Comentario"
          rows={3}
        />
        <div className="flex gap-2 max-w-md">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded shadow transition duration-150 cursor-pointer w-full"
          >
            Crear
          </button>
          <button
            type="button"
            onClick={() => navigate("/personas")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg font-semibold py-2 px-4 rounded shadow transition duration-150 w-full"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
