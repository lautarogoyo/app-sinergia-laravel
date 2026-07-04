import { useState, useRef, useEffect } from "react";

export default function ObraSelect({ obras, value, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const ref = useRef(null);

  const obraActual = obras.find(o => o.obra_id === value);

  const filtradas = obras.filter(o =>
    `#${o.nro_obra} ${o.detalle}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cerrar al click fuera
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (obraId) => {
    onChange(obraId);
    setOpen(false);
    setBusqueda("");
  };

  if (disabled) {
    return (
      <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-700 cursor-not-allowed">
        {obraActual ? `#${obraActual.nro_obra} — ${obraActual.detalle}` : "— Sin obra —"}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 flex justify-between items-center"
      >
        <span className={obraActual ? "text-gray-800" : "text-gray-400"}>
          {obraActual ? `#${obraActual.nro_obra} — ${obraActual.detalle}` : "— Seleccionar obra —"}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              placeholder="Buscar obra..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <ul className="max-h-52 overflow-y-auto">
            <li
              onClick={() => handleSelect("")}
              className="px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer"
            >
              — Sin obra —
            </li>
            {filtradas.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400 italic">Sin resultados</li>
            ) : (
              filtradas.map(o => (
                <li
                  key={o.obra_id}
                  onClick={() => handleSelect(o.obra_id)}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-emerald-50 hover:text-emerald-800 ${value === o.obra_id ? "bg-emerald-50 font-semibold text-emerald-700" : "text-gray-800"}`}
                >
                  #{o.nro_obra} — {o.detalle}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}