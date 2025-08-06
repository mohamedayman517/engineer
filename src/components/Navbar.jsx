import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import "../styles/navbar.css";

function Navbar() {
  const { user, isAuthenticated, isAdmin, isEngineer, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // تهيئة Bootstrap dropdowns
  useEffect(() => {
    // تأكد من تحميل Bootstrap
    if (typeof window !== "undefined" && window.bootstrap) {
      // تهيئة جميع الـ dropdowns
      const dropdownElementList = document.querySelectorAll(".dropdown-toggle");
      dropdownElementList.forEach((dropdownToggleEl) => {
        if (!dropdownToggleEl.getAttribute("data-bs-initialized")) {
          new window.bootstrap.Dropdown(dropdownToggleEl);
          dropdownToggleEl.setAttribute("data-bs-initialized", "true");
        }
      });
    }
  }, [isAuthenticated]);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow fixed-top">
      <div className="container">
        {!isAdmin() && (
        <Link className="navbar-brand fw-bold" to="/">
          🏗️ المهندس المعماري
        </Link>
        )}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              {!isAdmin() && (
              <Link className="nav-link" to="/">
                <i className="fas fa-home me-1"></i>الرئيسية
              </Link>
              )}
            </li>
            {/* About Page - Only visible to engineers */}
            {!isAdmin() && isEngineer() && (
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  <i className="fas fa-user me-1"></i>عني
                </Link>
              </li>
            )}
            {/* Public Pages - Available to all users including guests */}
            {!isAdmin() && (
            <li className="nav-item">
              <Link className="nav-link" to="/portfolio">
                <i className="fas fa-briefcase me-1"></i>الاعمال
              </Link>
            </li>
            )}
            {!isAdmin() && (
            <li className="nav-item">
              <Link className="nav-link" to="/services">
                <i className="fas fa-cogs me-1"></i>الخدمات
              </Link>
            </li>
            )}
            {!isAdmin() && (
            <li className="nav-item">
              <Link className="nav-link" to="/videos">
                <i className="fas fa-video me-1"></i>مكتبة الفيديوهات
              </Link>
            </li>
            )}
            {/* Contact and Chat - Available to all users including guests */}
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                <i className="fas fa-envelope me-1"></i>تواصل
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/chat">
                <i className="fas fa-comments me-1"></i>المحادثة
              </Link>
            </li>

            {/* Admin Panel - Visible only to admins */}
            {isAdmin() && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  <i className="fas fa-user-shield me-1"></i>لوحة التحكم
                </Link>
              </li>
            )}

            {/* Authentication Links */}
            {isAuthenticated() ? (
              isAdmin() ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                      borderRadius: '20px',
                      padding: '5px 15px',
                      color: 'white',
                      marginRight: '5px'
                    }}
                  >
                    <i className="fas fa-user-shield me-2"></i>
                    <span className="fw-bold">{user?.name || "المدير"}</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                   
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        تسجيل الخروج
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLogout}
                    style={{
                      padding: '5px 15px',
                      borderRadius: '20px',
                      marginRight: '5px'
                    }}
                  >
                    <i className="fas fa-sign-out-alt me-1"></i>
                    خروج
                  </button>
                </li>
              )
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i>تسجيل الدخول
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link btn btn-outline-primary ms-2"
                    to="/register"
                  >
                    <i className="fas fa-user-plus me-1"></i>إنشاء حساب
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
