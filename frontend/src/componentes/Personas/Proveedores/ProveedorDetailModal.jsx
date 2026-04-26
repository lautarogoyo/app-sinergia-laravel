function Row({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="text-base text-gray-800 mt-0.5">
        {value || <span className="text-gray-400 italic">Sin datos</span>}
      </span>
    </div>
  );
}

export default function ProveedorDetailModal({ proveedor, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-extrabold mb-5 text-gray-800">Detalle del Proveedor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div className="sm:col-span-2">
              <Row label="Nombre / Razón Social" value={proveedor.nombre_apellido} />
            </div>
            <Row label="Tipo de Facturación" value={proveedor.tipoFacturacion?.descripcion} />
            <Row label="Teléfono" value={proveedor.telefono} />
            <Row label="Email" value={proveedor.email} />
            <Row label="Dirección" value={proveedor.direccion} />
            <Row label="Ciudad" value={proveedor.ciudad} />
            <Row label="Calificación" value={proveedor.calificacion} />
            <Row label="Contacto" value={proveedor.contacto} />
            <Row label="Fecha de Ingreso" value={proveedor.fecha_ingreso} />
            <div className="sm:col-span-2">
              <Row label="Observación" value={proveedor.observacion} />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-base font-semibold py-2 px-4 rounded shadow transition duration-150"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
