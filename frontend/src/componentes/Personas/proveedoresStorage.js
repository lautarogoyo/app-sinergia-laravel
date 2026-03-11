const STORAGE_KEY = "personas_proveedores_v1";

export const PROVEEDORES_SEMILLA = [
  {
    id: 1,
    nombre: "Carlos",
    apellido: "Perez",
    telefono: "1144556677",
    email: "carlos.perez@acerosdelsur.com",
    monotributista: true,
    direccion: "Av. Belgrano 1200",
    comentario: "Entregas semanales de perfiles",
    fecha_ingreso: "2025-12-01",
  },
  {
    id: 2,
    nombre: "Ana",
    apellido: "Roca",
    telefono: "1133355511",
    email: "ana@pinturasroca.com",
    monotributista: false,
    direccion: "Sarmiento 450",
    comentario: "",
    fecha_ingreso: "2026-01-15",
  },
];

const FORM_DEFAULTS = {
  nombre: "",
  apellido: "",
  telefono: "",
  email: "",
  monotributista: false,
  direccion: "",
  comentario: "",
  fecha_ingreso: "",
};

function limpiarProveedor(raw) {
  return {
    nombre: String(raw?.nombre || "").trim(),
    apellido: String(raw?.apellido || "").trim(),
    telefono: String(raw?.telefono || "").trim(),
    email: String(raw?.email || "").trim(),
    monotributista: Boolean(raw?.monotributista),
    direccion: String(raw?.direccion || "").trim(),
    comentario: String(raw?.comentario || "").trim(),
    fecha_ingreso: String(raw?.fecha_ingreso || ""),
  };
}

function leerStorage() {
  if (typeof window === "undefined") return [...PROVEEDORES_SEMILLA];

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(PROVEEDORES_SEMILLA));
    return [...PROVEEDORES_SEMILLA];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [...PROVEEDORES_SEMILLA];
  } catch {
    return [...PROVEEDORES_SEMILLA];
  }
}

function escribirStorage(proveedores) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(proveedores));
}

export function getFormDefaults() {
  return { ...FORM_DEFAULTS };
}

export function obtenerProveedores() {
  return leerStorage();
}

export function obtenerProveedorPorId(id) {
  const proveedores = leerStorage();
  return proveedores.find((p) => String(p.id) === String(id)) || null;
}

export function crearProveedor(data) {
  const proveedores = leerStorage();
  const nuevo = {
    id: Date.now(),
    ...limpiarProveedor(data),
  };

  escribirStorage([nuevo, ...proveedores]);
  return nuevo;
}

export function actualizarProveedor(id, data) {
  const proveedores = leerStorage();
  const payload = limpiarProveedor(data);
  const actualizados = proveedores.map((p) => (String(p.id) === String(id) ? { ...p, ...payload } : p));

  escribirStorage(actualizados);
  return actualizados.find((p) => String(p.id) === String(id)) || null;
}

export function eliminarProveedor(id) {
  const proveedores = leerStorage();
  const actualizados = proveedores.filter((p) => String(p.id) !== String(id));
  escribirStorage(actualizados);
}
