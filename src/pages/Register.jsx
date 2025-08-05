import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/animations.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // مسح الأخطاء عند الكتابة
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/auth/register", formData);
      
      setSuccess(response.data.message);
      
      // الانتقال إلى صفحة تسجيل الدخول بعد 2 ثانية
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            message: "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول" 
          }
        });
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page min-vh-100 d-flex align-items-center" 
         style={{
           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
           fontFamily: "'Cairo', sans-serif"
         }}>
      
      {/* Background Pattern */}
      <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
        <div className="position-absolute" style={{ top: "10%", left: "10%" }}>
          <i className="fas fa-user-plus fa-3x text-white animate-float"></i>
        </div>
        <div className="position-absolute" style={{ top: "20%", right: "15%" }}>
          <i className="fas fa-envelope fa-2x text-white animate-float-delayed"></i>
        </div>
        <div className="position-absolute" style={{ bottom: "15%", left: "20%" }}>
          <i className="fas fa-lock fa-2x text-white animate-float"></i>
        </div>
        <div className="position-absolute" style={{ bottom: "25%", right: "10%" }}>
          <i className="fas fa-shield-alt fa-3x text-white animate-float-delayed"></i>
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
                    <i className="fas fa-user-plus"></i>
                  </div>
                </div>
                <h2 className="fw-bold text-dark mb-2">إنشاء حساب جديد</h2>
                <p className="text-muted">انضم إلينا واستكشف عالم التصميم المعماري</p>
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
                  {/* Name Field */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      <i className="fas fa-user me-2 text-primary"></i>
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="أدخل اسمك الكامل"
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
                        minLength="6"
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
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      <i className="fas fa-lock me-2 text-primary"></i>
                      تأكيد كلمة المرور
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control form-control-lg"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="أعد إدخال كلمة المرور"
                        required
                        minLength="6"
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          top: "50%",
                          left: "10px",
                          transform: "translateY(-50%)",
                          color: "#6c757d",
                          textDecoration: "none"
                        }}
                      >
                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
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
                        جاري إنشاء الحساب...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        إنشاء الحساب
                      </>
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    لديك حساب بالفعل؟{" "}
                    <Link 
                      to="/login" 
                      className="text-primary fw-bold text-decoration-none"
                      style={{ transition: "all 0.3s ease" }}
                    >
                      تسجيل الدخول
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

export default Register;
