import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublicRoute({ children, restricted = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading state while checking auth status
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  // If route is restricted and user is authenticated, redirect to home
  // or admin dashboard if user is admin
  if (restricted && isAuthenticated()) {
    return isAdmin() ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;
