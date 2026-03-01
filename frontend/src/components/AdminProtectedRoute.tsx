import { Navigate, useLocation } from "react-router-dom";

export function useAdminAuth() {
  // Replace with your actual admin auth logic
  // For demo: check localStorage for admin token
  const token = localStorage.getItem("adminToken");
  return Boolean(token);
}

export function AdminProtectedRoute({ children }) {
  const isAdmin = useAdminAuth();
  const location = useLocation();
  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}
