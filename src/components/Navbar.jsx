import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🏗️ المهندس المعماري
        </Link>
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
              <Link className="nav-link" to="/">
                <i className="fas fa-home me-1"></i>الرئيسية
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                <i className="fas fa-user me-1"></i>عني
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/portfolio">
                <i className="fas fa-briefcase me-1"></i>أعمالي
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">
                <i className="fas fa-cogs me-1"></i>الخدمات
              </Link>
            </li>
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
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
