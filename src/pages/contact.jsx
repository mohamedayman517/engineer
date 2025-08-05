import { useState, useEffect } from "react";
import "../styles/animations.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    message: "",
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus({ success: true, message: data.message || 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' });
        setFormData({
          name: "",
          email: "",
          phone: "",
          projectType: "",
          message: "",
        });
        
        // إخفاء رسالة النجاح تلقائياً بعد ثانية ونصف
        setTimeout(() => {
          setSubmitStatus({ success: false, message: '' });
        }, 1500);
      } else {
        throw new Error(data.error || 'حدث خطأ أثناء إرسال الرسالة');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ 
        success: false, 
        message: error.message || 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى لاحقاً.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: "fas fa-phone",
      title: "الهاتف",
      value: "+966 50 123 4567",
      color: "linear-gradient(45deg, #667eea, #764ba2)",
    },
    {
      icon: "fas fa-envelope",
      title: "البريد الإلكتروني",
      value: "architect@example.com",
      color: "linear-gradient(45deg, #4facfe, #00f2fe)",
    },
    {
      icon: "fas fa-map-marker-alt",
      title: "العنوان",
      value: "الرياض، المملكة العربية السعودية",
      color: "linear-gradient(45deg, #43e97b, #38f9d7)",
    },
    {
      icon: "fas fa-clock",
      title: "ساعات العمل",
      value: "الأحد - الخميس: 9:00 - 17:00",
      color: "linear-gradient(45deg, #fa709a, #fee140)",
    },
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section
        className="py-5 text-white position-relative overflow-hidden min-vh-100 d-flex align-items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay */}
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            zIndex: 1,
          }}
        ></div>
        {/* Animated Background Elements */}
        <div className="position-absolute w-100 h-100 overflow-hidden">
          {/* Floating Contact Icons */}
          <div
            className="position-absolute animate-float-slow"
            style={{ top: "15%", left: "8%" }}
          >
            <i
              className="fas fa-envelope"
              style={{
                fontSize: "4rem",
                color: "rgba(255,255,255,0.15)",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              }}
            ></i>
          </div>

          <div
            className="position-absolute animate-float-medium"
            style={{ top: "25%", right: "12%" }}
          >
            <i
              className="fas fa-phone"
              style={{
                fontSize: "3rem",
                color: "rgba(255,255,255,0.12)",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              }}
            ></i>
          </div>

          <div
            className="position-absolute animate-float-fast"
            style={{ bottom: "20%", left: "15%" }}
          >
            <i
              className="fas fa-map-marker-alt"
              style={{
                fontSize: "3.5rem",
                color: "rgba(255,255,255,0.1)",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              }}
            ></i>
          </div>

          <div
            className="position-absolute animate-float-slow"
            style={{ bottom: "30%", right: "8%" }}
          >
            <i
              className="fas fa-comments"
              style={{
                fontSize: "2.5rem",
                color: "rgba(255,255,255,0.13)",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              }}
            ></i>
          </div>

          {/* Geometric Shapes */}
          <div
            className="position-absolute animate-rotate-slow"
            style={{ top: "10%", right: "20%" }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background:
                  "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                transform: "rotate(45deg)",
                borderRadius: "15px",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            ></div>
          </div>

          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="position-absolute animate-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  background: "rgba(255,255,255,0.6)",
                  borderRadius: "50%",
                  boxShadow: "0 0 10px rgba(255,255,255,0.8)",
                }}
              ></div>
            </div>
          ))}
        </div>

        <div
          className="container text-center position-relative"
          style={{ zIndex: 2 }}
        >
          <div className={`${isVisible ? "animate-fade-in-up" : ""}`}>
            <h1
              className="display-3 fw-bold text-white mb-4"
              style={{
                textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
                lineHeight: "1.1",
              }}
            >
              تواصل معنا
            </h1>
            <p
              className="lead mb-5 text-white"
              style={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                maxWidth: "600px",
                margin: "0 auto",
                fontSize: "1.3rem",
                opacity: "0.9",
              }}
            >
              نحن هنا لمساعدتك في تحويل أحلامك المعمارية إلى واقع ملموس
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-5" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ color: "#2c3e50" }}>
              معلومات التواصل
            </h2>
            <p className="lead text-muted">
              تواصل معنا عبر أي من الطرق التالية
            </p>
          </div>

          <div className="row g-4">
            {contactInfo.map((info, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div
                  className={`card h-100 border-0 shadow hover-lift ${
                    isVisible ? `animate-scale-in stagger-${index + 1}` : ""
                  }`}
                  style={{
                    borderRadius: "15px",
                    transition: "all 0.3s ease",
                    background: "white",
                  }}
                >
                  <div className="card-body p-4 text-center">
                    <div className="mb-3">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{
                          width: "70px",
                          height: "70px",
                          background: "#f8f9fa",
                          border: "2px solid #e9ecef",
                        }}
                      >
                        <i
                          className={`${info.icon}`}
                          style={{ fontSize: "2rem", color: "#6c757d" }}
                        ></i>
                      </div>
                    </div>
                    <h5
                      className="card-title fw-bold mb-3"
                      style={{ color: "#333" }}
                    >
                      {info.title}
                    </h5>
                    <p
                      className="card-text text-muted"
                      style={{ fontSize: "0.95rem" }}
                    >
                      {info.value}
                    </p>
                    <div
                      className="mt-3 mx-auto"
                      style={{
                        width: "40px",
                        height: "3px",
                        background: info.color,
                        borderRadius: "2px",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section
        className="py-5 position-relative"
        style={{
          background: "#ffffff",
        }}
      >
        {/* Background Pattern */}
        <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="form-pattern"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="2" fill="white" />
                <circle cx="15" cy="15" r="1" fill="white" />
                <circle cx="45" cy="45" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#form-pattern)" />
          </svg>
        </div>

        <div className="container position-relative">
          <div className="text-center mb-5">
            <h2
              className="display-5 fw-bold text-dark mb-3"
              style={{ color: "#2c3e50" }}
            >
              أرسل لنا رسالة
            </h2>
            <p className="lead text-muted">
              املأ النموذج أدناه وسنتواصل معك في أقرب وقت
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                className={`card border-0 shadow ${
                  isVisible ? "animate-fade-in-up stagger-3" : ""
                }`}
                style={{
                  borderRadius: "15px",
                  background: "#f8f9fa",
                }}
              >
                <div className="card-body p-5">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label
                          htmlFor="name"
                          className="form-label fw-semibold"
                          style={{ color: "#333" }}
                        >
                          <i className="fas fa-user me-2"></i>
                          الاسم الكامل
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          style={{
                            borderRadius: "10px",
                            border: "1px solid #dee2e6",
                            padding: "12px 16px",
                          }}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>

                      <div className="col-md-6">
                        <label
                          htmlFor="email"
                          className="form-label fw-semibold"
                          style={{ color: "#333" }}
                        >
                          <i className="fas fa-envelope me-2"></i>
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          style={{
                            borderRadius: "15px",
                            border: "2px solid #e9ecef",
                            padding: "12px 20px",
                          }}
                          placeholder="example@email.com"
                        />
                      </div>

                      <div className="col-md-6">
                        <label
                          htmlFor="phone"
                          className="form-label fw-semibold"
                          style={{ color: "#333" }}
                        >
                          <i className="fas fa-phone me-2"></i>
                          رقم الهاتف
                        </label>
                        <input
                          type="tel"
                          className="form-control form-control-lg"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          style={{
                            borderRadius: "15px",
                            border: "2px solid #e9ecef",
                            padding: "12px 20px",
                          }}
                          placeholder="+0101264889"
                        />
                      </div>

                      <div className="col-md-6">
                        <label
                          htmlFor="projectType"
                          className="form-label fw-semibold"
                          style={{ color: "#333" }}
                        >
                          <i className="fas fa-building me-2"></i>
                          نوع المشروع
                        </label>
                        <select
                          className="form-select form-select-lg"
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          style={{
                            borderRadius: "15px",
                            border: "2px solid #e9ecef",
                            padding: "12px 20px",
                          }}
                        >
                          <option value="">اختر نوع المشروع</option>
                          <option value="residential">سكني</option>
                          <option value="commercial">تجاري</option>
                          <option value="religious">ديني</option>
                          <option value="other">أخرى</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label
                          htmlFor="message"
                          className="form-label fw-semibold"
                          style={{ color: "#333" }}
                        >
                          <i className="fas fa-comment me-2"></i>
                          الرسالة
                        </label>
                        <textarea
                          className="form-control form-control-lg"
                          id="message"
                          name="message"
                          rows="6"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          style={{
                            borderRadius: "15px",
                            border: "2px solid #e9ecef",
                            padding: "15px 20px",
                            resize: "vertical",
                          }}
                          placeholder="اكتب رسالتك هنا... أخبرنا عن مشروعك وكيف يمكننا مساعدتك"
                        ></textarea>
                      </div>

                      <div className="col-12 text-center">
                        <button
                          type="submit"
                          className="btn btn-lg px-5 py-3 hover-lift glow-effect"
                          disabled={isSubmitting}
                          style={{
                            borderRadius: "25px",
                            background: isSubmitting 
                              ? "linear-gradient(45deg, #6c757d, #495057)"
                              : "linear-gradient(45deg, #667eea, #764ba2)",
                            border: "none",
                            color: "white",
                            fontWeight: "600",
                            fontSize: "1.1rem",
                            boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
                            opacity: isSubmitting ? 0.7 : 1,
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-2"></i>
                              جاري الإرسال...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane me-2"></i>
                              إرسال الرسالة
                            </>
                          )}
                        </button>
                      </div>

                      {/* رسالة الحالة */}
                      {submitStatus.message && (
                        <div className="col-12 mt-4">
                          <div
                            className={`alert ${
                              submitStatus.success ? 'alert-success' : 'alert-danger'
                            } text-center animate-fade-in`}
                            style={{
                              borderRadius: "15px",
                              border: "none",
                              background: submitStatus.success
                                ? "linear-gradient(45deg, #28a745, #20c997)"
                                : "linear-gradient(45deg, #dc3545, #fd7e14)",
                              color: "white",
                              fontWeight: "600",
                              fontSize: "1.1rem",
                              boxShadow: submitStatus.success
                                ? "0 8px 20px rgba(40, 167, 69, 0.3)"
                                : "0 8px 20px rgba(220, 53, 69, 0.3)",
                              animation: "fadeInUp 0.5s ease-out",
                            }}
                          >
                            <i className={`fas ${
                              submitStatus.success ? 'fa-check-circle' : 'fa-exclamation-triangle'
                            } me-2`}></i>
                            {submitStatus.message}
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
