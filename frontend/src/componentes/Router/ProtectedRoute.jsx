import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ isAuthenticated, requireAdmin = false, isAdmin = false }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
