import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import ProjectDetails from "./pages/ProjectDetails";
import Services from "./pages/services";
import Contact from "./pages/contact";
import Chat from "./pages/chat";
import Videos from "./pages/Videos";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { useEffect } from "react";

// Simple wrapper for Navbar
function NavbarWrapper() {
  return <Navbar />;
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Home route is public, no authentication required
function HomeRoute() {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </div>
    );
  }
  
  // Redirect admin users to admin dashboard
  if (isAuthenticated() && isAdmin()) {
    return <Navigate to="/admin" replace />;
  }
  
  return <Home />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavbarWrapper />
        <ScrollToTop />
        <div className="app-container">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomeRoute />} />
            
            {/* Auth Routes (only for non-authenticated users) */}
            <Route
              path="/login"
              element={
                <PublicRoute restricted={true}>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute restricted={true}>
                  <Register />
                </PublicRoute>
              }
            />
            
            {/* Protected Routes */}
            <Route
              path="/about"
              element={
                <ProtectedRoute requireEngineer={true}>
                  <About />
                </ProtectedRoute>
              }
            />
            
            <Route 
              path="/portfolio" 
              element={<Portfolio />} 
            />
            
            <Route 
              path="/project/:id" 
              element={<ProjectDetails />} 
            />
            
            <Route 
              path="/services" 
              element={<Services />} 
            />
            
            <Route
              path="/contact"
              element={<Contact />}
            />
            
            <Route 
              path="/videos" 
              element={<Videos />} 
            />
            
            <Route
              path="/chat"
              element={<Chat />}
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            
            {/* 404 Not Found */}
            <Route 
              path="*" 
              element={
                <div className="container mt-5">
                  <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                      <h1 className="text-danger">404 - الصفحة غير موجودة</h1>
                      <p className="lead">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
                      <button 
                        className="btn btn-primary mt-3"
                        onClick={() => window.history.back()}
                      >
                        العودة للصفحة السابقة
                      </button>
                    </div>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
