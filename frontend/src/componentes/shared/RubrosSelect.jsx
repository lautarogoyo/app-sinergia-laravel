import { useState, useRef, useEffect } from "react";
import { useRubros } from "../hooks/useRubros.jsx";

export default function RubrosSelect({ value = [], onChange }) {
  const { data: rubros = [] } = useRubros();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtrados = rubros.filter(r =>
    r.descripcion.toLowerCase().includes(query.toLowerCase()) &&
    !value.includes(r.rubro_id)
  );

  const agregar = (rubro) => {
    onChange([...value, rubro.rubro_id]);
    setQuery("");
    setOpen(false);
  };

  const quitar = (id) => onChange(value.filter(v => v !== id));

  const seleccionados = rubros.filter(r => value.includes(r.rubro_id));

  return (
    <div className="relative" ref={ref}>
      {/* Tags seleccionados */}
      <div className="flex flex-wrap gap-1 mb-1">
        {seleccionados.map(r => (
          <span
            key={r.rubro_id}
            className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
          >
            {r.descripcion}
            <button type="button" onClick={() => quitar(r.rubro_id)} className="hover:text-red-500 font-bold">×</button>
          </span>
        ))}
      </div>

      {/* Input de búsqueda */}
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Escribir para buscar rubro..."
        className="w-full px-4 py-2 rounded border border-gray-300 text-base focus:outline-none focus:ring focus:border-blue-400"
      />

      {/* Dropdown */}
      {open && filtrados.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
          {filtrados.map(r => (
            <li
              key={r.rubro_id}
              onClick={() => agregar(r)}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
            >
              {r.descripcion}
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