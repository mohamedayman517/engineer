import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  requireAdmin = false,
  requireEngineer = false,
}) {
  const { user, loading, isAuthenticated, isAdmin, isEngineer } = useAuth();

  // إذا كان التطبيق لا يزال يحمل بيانات المستخدم
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
          <p className="text-muted">جاري التحقق من صلاحيات المستخدم...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسجل دخول
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // إذا كانت الصفحة تتطلب صلاحيات إدارة والمستخدم ليس أدمن أو مهندس
  if (requireAdmin && !isAdmin() && !isEngineer()) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-warning">
              <div className="card-body text-center">
                <i className="fas fa-shield-alt text-warning fa-3x mb-3"></i>
                <h4 className="card-title text-warning">الوصول مرفوض</h4>
                <p className="card-text">
                  عذراً، هذه الصفحة مخصصة للمديرين والمهندسين فقط. ليس لديك
                  الصلاحيات اللازمة للوصول إلى هذه الصفحة.
                </p>
                <div className="mt-4">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => window.history.back()}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    العودة
                  </button>
                  <a href="/" className="btn btn-outline-primary">
                    <i className="fas fa-home me-2"></i>
                    الصفحة الرئيسية
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // إذا كانت الصفحة تتطلب صلاحيات مهندس فقط والمستخدم ليس مهندس
  if (requireEngineer && !requireAdmin && !isEngineer()) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-warning">
              <div className="card-body text-center">
                <i className="fas fa-hard-hat text-warning fa-3x mb-3"></i>
                <h4 className="card-title text-warning">الوصول مرفوض</h4>
                <p className="card-text">
                  عذراً، هذه الصفحة مخصصة للمهندسين فقط. ليس لديك الصلاحيات
                  اللازمة للوصول إلى هذه الصفحة.
                </p>
                <div className="mt-4">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => window.history.back()}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    العودة
                  </button>
                  <a href="/" className="btn btn-outline-primary">
                    <i className="fas fa-home me-2"></i>
                    الصفحة الرئيسية
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // إذا كان كل شيء على ما يرام، عرض المحتوى
  // إذا كان children دالة، نمررها المستخدم كمعامل
  if (typeof children === 'function') {
    return children({ user });
  }
  
  // وإلا نعرض المحتوى مباشرة
  return children;
}

export default ProtectedRoute;
