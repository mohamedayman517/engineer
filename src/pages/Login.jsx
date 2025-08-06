import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/animations.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // عرض رسالة النجاح من صفحة التسجيل
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // مسح الأخطاء عند الكتابة
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { email: formData.email });
      const response = await axios.post("/api/auth/login", formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      console.log("Login response:", response.data);
      
      if (response.data && response.data.token) {
        const userData = response.data.user || response.data;
        login(userData, response.data.token);
        
        // توجيه المستخدم بناءً على الدور
        if (userData.role === 'admin') {
          navigate("/admin", { replace: true, state: { message: "مرحباً بك في لوحة التحكم" } });
        } else {
          navigate("/", { replace: true, state: { message: "تم تسجيل الدخول بنجاح" } });
        }
      } else {
        throw new Error("Invalid response from server");
      }

    } catch (err) {
      console.error("Login error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data
        }
      });
      
      let errorMessage = "حدث خطأ أثناء محاولة تسجيل الدخول";
      
      if (err.response?.status === 401) {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة. تأكد من البيانات وحاول مرة أخرى.";
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message_ar || "البيانات المدخلة غير صحيحة";
      } else if (err.response?.status === 500) {
        errorMessage = "خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.";
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        errorMessage = "خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.";
      } else {
        errorMessage = err.response?.data?.message_ar || 
                      err.response?.data?.error || 
                      err.response?.data?.message || 
                      "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center" 
         style={{
           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
           fontFamily: "'Cairo', sans-serif"
         }}>
      
      {/* Background Pattern */}
      <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
        <div className="position-absolute" style={{ top: "15%", left: "10%" }}>
          <i className="fas fa-sign-in-alt fa-3x text-white animate-float"></i>
        </div>
        <div className="position-absolute" style={{ top: "25%", right: "15%" }}>
          <i className="fas fa-key fa-2x text-white animate-float-delayed"></i>
        </div>
        <div className="position-absolute" style={{ bottom: "20%", left: "20%" }}>
          <i className="fas fa-user-shield fa-2x text-white animate-float"></i>
        </div>
        <div className="position-absolute" style={{ bottom: "30%", right: "10%" }}>
          <i className="fas fa-home fa-3x text-white animate-float-delayed"></i>
        </div>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card border-0 shadow-lg animate-fade-in-up" 
                 style={{ borderRadius: "20px", backdropFilter: "blur(10px)" }}>
              
              {/* Header */}
              <div className="card-header bg-transparent border-0 text-center py-4">
                <div className="mb-3">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                       style={{ width: "80px", height: "80px", fontSize: "2rem" }}>
                    <i className="fas fa-sign-in-alt"></i>
                  </div>
                </div>
                <h2 className="fw-bold text-dark mb-2">تسجيل الدخول</h2>
                <p className="text-muted">مرحباً بك مرة أخرى! سجل دخولك للمتابعة</p>
              </div>

              {/* Form */}
              <div className="card-body px-5 pb-5">
                {error && (
                  <div className="alert alert-danger animate-shake" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success animate-bounce" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      <i className="fas fa-envelope me-2 text-primary"></i>
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                      style={{ 
                        borderRadius: "15px", 
                        border: "2px solid #e9ecef",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#667eea"}
                      onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
                    />
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      <i className="fas fa-lock me-2 text-primary"></i>
                      كلمة المرور
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="أدخل كلمة المرور"
                        required
                        style={{ 
                          borderRadius: "15px", 
                          border: "2px solid #e9ecef",
                          transition: "all 0.3s ease",
                          paddingRight: "45px"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#667eea"}
                        onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          top: "50%",
                          left: "10px",
                          transform: "translateY(-50%)",
                          color: "#6c757d",
                          textDecoration: "none"
                        }}
                      >
                        <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg w-100 fw-bold"
                    style={{ 
                      borderRadius: "15px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      padding: "12px",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        جاري تسجيل الدخول...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        تسجيل الدخول
                      </>
                    )}
                  </button>
                </form>

                {/* Register Link */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    ليس لديك حساب؟{" "}
                    <Link 
                      to="/register" 
                      className="text-primary fw-bold text-decoration-none"
                      style={{ transition: "all 0.3s ease" }}
                    >
                      إنشاء حساب جديد
                    </Link>
                  </p>
                </div>

                {/* Home Link */}
                <div className="text-center mt-3">
                  <Link 
                    to="/" 
                    className="text-muted text-decoration-none"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <i className="fas fa-arrow-right me-2"></i>
                    العودة للصفحة الرئيسية
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
