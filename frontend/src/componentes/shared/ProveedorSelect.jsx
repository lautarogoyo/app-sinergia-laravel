import { useState, useRef, useEffect } from "react";
import { useProveedores } from "../hooks/useProveedores.jsx";
import Icon from "../Icons/Icons.jsx";

export default function ProveedorSelect({ value = [], onChange }) {
  const { data: proveedores = [] } = useProveedores();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(); 
  const numericValue = value.map(Number);


  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtrados = proveedores.filter(p =>
    p.nombre_apellido.toLowerCase().includes(query.toLowerCase()) &&
    !numericValue.includes(p.proveedor_id)
  );

  const agregar = (proveedor) => {
    onChange([...value, proveedor.proveedor_id]);
    setQuery("");
    setOpen(false);
  };

  const quitar = (id) => onChange(value.filter(v => v !== id));

  const seleccionados = proveedores.filter(p => numericValue.includes(p.proveedor_id));

  return (
    <div className="relative" ref={ref}>
      <div className="flex flex-wrap gap-1 mb-1">
        {seleccionados.map(p => (
          <span key={p.proveedor_id} className="bg-blue-100 text-blue-800 text-base font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-red-200">
            {p.nombre_apellido}
            <button type="button" onClick={() => quitar(p.proveedor_id)} className="hover:text-red-500 font-bold cursor-pointer"><Icon name="cancel" className="w-5 h-5" /></button>
          </span>
        ))}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Escribir para buscar proveedor..."
        className="w-full px-4 py-2 rounded border border-gray-300 text-base focus:outline-none focus:ring focus:border-blue-400"
      />

      {open && filtrados.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
          {filtrados.map(p => (
            <li key={p.proveedor_id} onClick={() => agregar(p)} className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700">
              {p.nombre_apellido}
            </li>
          ))}
        </ul>
      )}

      {open && query && filtrados.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow px-3 py-2 text-sm text-gray-400">
          Sin resultados
        </div>
      )}
    </div>
  );
}