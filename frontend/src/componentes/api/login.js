import axios from "axios";

const backendUrl = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: `${backendUrl}/api`,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
  },
});

const ensureCsrfCookie = async () => {
  await axios.get(`${backendUrl}/sanctum/csrf-cookie`, {
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    headers: {
      Accept: "application/json",
    },
  });
};

export const loginUsuario = async (usuario, contrasena) => {
  try {
    // CSRF token para cookies de sesión seguras en Sanctum
    await ensureCsrfCookie();

    const { data } = await apiClient.post(
      "/auth/login",
      {
        usuario,
        contrasena,
      }
    );

    return {
      success: true,
      user: data.user,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || 'Error de conexión con el servidor',
    };
  }
};

export const logoutUsuario = async () => {
  try {
    await ensureCsrfCookie();
    await apiClient.post("/auth/logout", {});

    return {
      success: true,
      message: 'Sesión cerrada correctamente',
    };
  } catch (error) {
    const status = error?.response?.status;

    // Si la sesión ya no existe del lado servidor, consideramos logout efectivo.
    if (status === 401 || status === 419) {
      return {
        success: true,
        message: 'Sesión cerrada correctamente',
      };
    }

    return {
      success: false,
      message: error?.response?.data?.message || error.message || 'Error de conexión',
    };
  }
};

export const obtenerUsuarioActual = async () => {
  try {
    const { data } = await apiClient.get("/auth/me");
    return data;
  } catch {
    return null;
  }
};

export const limpiarSesion = () => {
  // La sesión vive en cookie HttpOnly del backend; no hay token local para limpiar.
};
