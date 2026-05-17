import { useState, useRef, useEffect } from "react";
import { useGrupos } from "../hooks/useGrupos.jsx";

export default function GruposSelect({ value = [], onChange }) {
  const { data: grupos = [] } = useGrupos();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const numericValue = value.map(Number);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtrados = grupos.filter(g =>
    g.nombre_apellido.toLowerCase().includes(query.toLowerCase()) &&
    !numericValue.includes(g.grupo_id)
  );


  const agregar = (grupo) => {
    onChange([...value, grupo.grupo_id]);
    setQuery("");
    setOpen(false);
  };

  const quitar = (id) => onChange(value.filter(v => v !== id));

  const seleccionados = grupos.filter(g => numericValue.includes(g.grupo_id));

  return (
    <div className="relative" ref={ref}>
      <div className="flex flex-wrap gap-1 mb-1">
        {seleccionados.map(g => (
          <span
            key={g.grupo_id}
            className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
          >
            {g.nombre_apellido}
            <button type="button" onClick={() => quitar(g.grupo_id)} className="hover:text-red-500 font-bold">×</button>
          </span>
        ))}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Escribir para buscar grupo..."
        className="w-full px-4 py-2 rounded border border-gray-300 text-base focus:outline-none focus:ring focus:border-blue-400"
      />

      {open && filtrados.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
          {filtrados.map(g => (
            <li
              key={g.grupo_id}
              onClick={() => agregar(g)}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
            >
              {g.nombre_apellido}
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