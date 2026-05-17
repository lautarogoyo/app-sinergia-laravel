import { useState, useRef, useEffect } from "react";

export default function OcSelect({ ordenes, value, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const ref = useRef(null);

  const ocActual = ordenes.find(oc => oc.nro_oc === value);

  const filtradas = ordenes.filter(oc =>
    `${oc.nro_oc} ${oc.detalle ?? ""}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (nroOc) => {
    onChange(nroOc);
    setOpen(false);
    setBusqueda("");
  };

  if (disabled) {
    return (
      <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-700 cursor-not-allowed">
        {ocActual ? `${ocActual.nro_oc}${ocActual.detalle ? ` — ${ocActual.detalle}` : ""}` : "— Sin OC —"}
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
        <span className={ocActual ? "text-gray-800" : "text-gray-400"}>
          {ocActual
            ? `${ocActual.nro_oc}${ocActual.detalle ? ` — ${ocActual.detalle}` : ""}`
            : "— Sin orden de compra —"}
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
              placeholder="Buscar OC..."
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
              — Sin orden de compra —
            </li>
            {filtradas.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400 italic">Sin resultados</li>
            ) : (
              filtradas.map(oc => (
                <li
                  key={oc.nro_oc}
                  onClick={() => handleSelect(oc.nro_oc)}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-emerald-50 hover:text-emerald-800 ${value === oc.nro_oc ? "bg-emerald-50 font-semibold text-emerald-700" : "text-gray-800"}`}
                >
                  <span className="font-semibold">{oc.nro_oc}</span>
                  {oc.detalle && <span className="text-gray-500"> — {oc.detalle}</span>}
                  {oc.importe && (
                    <span className="ml-2 text-xs text-gray-400">
                      ${Number(oc.importe).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}