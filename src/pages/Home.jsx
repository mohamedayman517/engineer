import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/animations.css";

function Home() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden min-vh-100 d-flex align-items-center">
        {/* Background Image */}
        <div
          className="position-absolute w-100 h-100"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: -2,
          }}
        ></div>

        {/* Dark Overlay */}
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: -1,
          }}
        ></div>

        {/* Animated Background Elements */}
        <div
          className="position-absolute w-100 h-100 overflow-hidden"
          style={{ zIndex: -1 }}
        >
          {/* Large Architecture Icons */}
          <div
            className="position-absolute animate-float-slow"
            style={{ top: "10%", left: "5%" }}
          >
            <i
              className="fas fa-building"
              style={{
                fontSize: "6rem",
                color: "rgba(255,255,255,0.1)",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              }}
            ></i>
          </div>

          <div
            className="position-absolute animate-float-medium"
            style={{ top: "20%", right: "8%" }}
          >
            <i
              className="fas fa-city"
              style={{
                fontSize: "5rem",
                color: "rgba(255,255,255,0.08)",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              }}
            ></i>
          </div>

          <div
            className="position-absolute animate-float-fast"
            style={{ bottom: "15%", left: "10%" }}
          >
            <i
              className="fas fa-home"
              style={{
                fontSize: "4rem",
                color: "rgba(255,255,255,0.12)",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              }}
            ></i>
          </div>

          <div
            className="position-absolute animate-float-slow"
            style={{ bottom: "25%", right: "15%" }}
          >
            <i
              className="fas fa-drafting-compass"
              style={{
                fontSize: "3.5rem",
                color: "rgba(255,255,255,0.09)",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              }}
            ></i>
          </div>

          {/* Geometric Shapes */}
          <div
            className="position-absolute animate-rotate-slow"
            style={{ top: "30%", left: "20%" }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                background:
                  "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                transform: "rotate(45deg)",
                borderRadius: "20px",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            ></div>
          </div>

          <div
            className="position-absolute animate-float-medium"
            style={{ top: "60%", right: "25%" }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            ></div>
          </div>

          {/* Floating Particles */}
          {[...Array(12)].map((_, i) => (
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
                  width: "6px",
                  height: "6px",
                  background: "rgba(255,255,255,0.7)",
                  borderRadius: "50%",
                  boxShadow: "0 0 15px rgba(255,255,255,0.9)",
                }}
              ></div>
            </div>
          ))}
        </div>

        <div className="container position-relative">
          <div className="row justify-content-start">
            <div className="col-lg-8">
              <div className={`${isVisible ? "animate-fade-in-up" : ""}`}>
                <div className="mb-4">
                  <span
                    className="badge bg-light text-dark px-3 py-2 rounded-pill"
                    style={{ fontSize: "0.9rem", fontWeight: "500" }}
                  ></span>
                </div>
                <h1
                  className="display-2 fw-bold text-white mb-4"
                  style={{
                    textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
                    lineHeight: "1.1",
                    fontSize: "4rem",
                  }}
                >
                  نحن شغوفون بإبداع{" "}
                  <span className="d-block">مساحات جديدة وفريدة</span>
                </h1>
                <p
                  className="lead text-white mb-5"
                  style={{
                    textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                    maxWidth: "600px",
                    fontSize: "1.2rem",
                    opacity: "0.9",
                  }}
                >
                  تصميمات معمارية أنيقة ووظيفية مصممة بإبداع ودقة لتحويل أحلامك
                  إلى واقع
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${
              isVisible ? "animate-scale-in stagger-2" : ""
            } d-flex flex-wrap justify-content-center gap-3`}
          >
            <button
              className="btn btn-light btn-lg px-5 py-3 hover-lift glow-effect"
              onClick={() => navigate("/chat")}
              style={{
                borderRadius: "25px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255,255,255,0.3)",
                fontWeight: "600",
                fontSize: "1.1rem",
              }}
            >
              <i className="fas fa-robot me-2"></i>
              💬 تحدث مع ArchiBot
            </button>
            <button
              className="btn btn-outline-light btn-lg px-5 py-3 hover-lift"
              onClick={() => navigate("/portfolio")}
              style={{
                borderRadius: "25px",
                border: "2px solid rgba(255,255,255,0.6)",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                fontWeight: "600",
                fontSize: "1.1rem",
              }}
            >
              <i className="fas fa-images me-2"></i>
              🎨 شاهد أعمالي
            </button>
            <button
              className="btn btn-outline-light btn-lg px-5 py-3 hover-lift"
              onClick={() => navigate("/services")}
              style={{
                borderRadius: "25px",
                border: "2px solid rgba(255,255,255,0.6)",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                fontWeight: "600",
                fontSize: "1.1rem",
              }}
            >
              <i className="fas fa-tools me-2"></i>
              🛠️ خدماتنا
            </button>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section
        className="py-5 position-relative"
        style={{
          background: "#f8f9fa",
        }}
      >
        {/* Background Pattern */}
        <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid-pattern"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="container position-relative">
          <div className="text-center mb-5">
            <h2
              className="display-5 fw-bold text-dark mb-3"
              style={{ color: "#2c3e50" }}
            >
              خدماتنا
            </h2>
            <p className="lead text-muted">نقدم حلول معمارية شاملة ومتطورة</p>
          </div>

          <div className="row justify-content-center g-4">
            <div className="col-lg-4 col-md-6 text-center">
              <div
                className="service-card p-4 hover-lift"
                style={{
                  borderRadius: "15px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-10px) scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 15px rgba(0,0,0,0.08)";
                }}
              >
                <div className="service-icon mb-4">
                  <div
                    className="icon-wrapper d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "#f8f9fa",
                      borderRadius: "50%",
                      border: "2px solid #e9ecef",
                    }}
                  >
                    <i
                      className="fas fa-drafting-compass"
                      style={{
                        fontSize: "2rem",
                        color: "#6c757d",
                      }}
                    ></i>
                  </div>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>
                  تصميم مثالي
                </h5>
                <p className="text-muted small lh-lg">
                  تصميمات معمارية مبتكرة ومتطورة تجمع بين الجمال والوظائف
                  العملية
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 text-center">
              <div
                className="service-card p-4 hover-lift"
                style={{
                  borderRadius: "15px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-10px) scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 15px rgba(0,0,0,0.08)";
                }}
              >
                <div className="service-icon mb-4">
                  <div
                    className="icon-wrapper d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "#f8f9fa",
                      borderRadius: "50%",
                      border: "2px solid #e9ecef",
                    }}
                  >
                    <i
                      className="fas fa-cube"
                      style={{
                        fontSize: "2rem",
                        color: "#6c757d",
                      }}
                    ></i>
                  </div>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>
                  تخطيط دقيق
                </h5>
                <p className="text-muted small lh-lg">
                  تخطيط دقيق ومدروس لكل مشروع مع مراعاة جميع التفاصيل والمتطلبات
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 text-center">
              <div
                className="service-card p-4 hover-lift"
                style={{
                  borderRadius: "15px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-10px) scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 15px rgba(0,0,0,0.08)";
                }}
              >
                <div className="service-icon mb-4">
                  <div
                    className="icon-wrapper d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "#ffffff",
                      borderRadius: "50%",
                      border: "2px solid #e9ecef",
                    }}
                  >
                    <i
                      className="fas fa-hard-hat"
                      style={{
                        fontSize: "2rem",
                        color: "#6c757d",
                      }}
                    ></i>
                  </div>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>
                  تنفيذ ذكي
                </h5>
                <p className="text-muted small lh-lg">
                  تنفيذ ذكي ومتطور للمشاريع مع ضمان أعلى معايير الجودة والدقة
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
