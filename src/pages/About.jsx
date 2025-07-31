import { useState, useEffect } from "react";
import "../styles/animations.css";

function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const skills = [
    {
      name: "التصميم المعماري",
      percentage: 95,
      icon: "fas fa-drafting-compass",
    },
    { name: "التصميم الداخلي", percentage: 90, icon: "fas fa-couch" },
    { name: "النمذجة ثلاثية الأبعاد", percentage: 85, icon: "fas fa-cube" },
    { name: "إدارة المشاريع", percentage: 88, icon: "fas fa-tasks" },
  ];

  const achievements = [
    { number: "50+", label: "مشروع مكتمل", icon: "fas fa-building" },
    { number: "10+", label: "سنوات خبرة", icon: "fas fa-calendar" },
    { number: "30+", label: "عميل راضي", icon: "fas fa-users" },
    { number: "5", label: "جوائز تصميم", icon: "fas fa-trophy" },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden min-vh-100 d-flex align-items-center">
        {/* Background Image */}
        <div
          className="position-absolute w-100 h-100"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
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
        <div className="position-absolute w-100 h-100 overflow-hidden">
          {/* Floating Architecture Icons */}
          <div
            className="position-absolute animate-float-slow"
            style={{ top: "15%", left: "8%" }}
          >
            <i
              className="fas fa-user-tie"
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
              className="fas fa-graduation-cap"
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
              className="fas fa-award"
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
              className="fas fa-lightbulb"
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
          {[...Array(6)].map((_, i) => (
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

        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className={`${isVisible ? "animate-fade-in-left" : ""}`}>
                <h1
                  className="display-2 fw-bold text-white mb-4"
                  style={{
                    textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
                    lineHeight: "1.1",
                    fontSize: "4rem",
                  }}
                >
                  <i className="fas fa-user-tie me-3"></i>
                  عن المهندس
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
                  مهندس معماري متخصص في التصميم المعماري والداخلي مع أكثر من 10
                  سنوات من الخبرة في إنشاء مساحات تجمع بين الوظيفية والجمال.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <button
                    className="btn btn-light btn-lg px-5 py-3 hover-lift glow-effect"
                    style={{
                      borderRadius: "25px",
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                      border: "2px solid rgba(255,255,255,0.3)",
                      fontWeight: "600",
                      fontSize: "1.1rem",
                    }}
                  >
                    <i className="fas fa-download me-2"></i>
                    تحميل السيرة الذاتية
                  </button>
                  <button
                    className="btn btn-outline-light btn-lg px-5 py-3 hover-lift"
                    style={{
                      borderRadius: "25px",
                      border: "2px solid rgba(255,255,255,0.6)",
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                      fontWeight: "600",
                      fontSize: "1.1rem",
                    }}
                  >
                    <i className="fas fa-envelope me-2"></i>
                    تواصل معي
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className={`text-center ${
                  isVisible ? "animate-fade-in-right" : ""
                }`}
              >
                <div className="position-relative d-inline-block">
                  <div
                    className="position-relative"
                    style={{
                      background:
                        "linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
                      borderRadius: "50%",
                      padding: "20px",
                      backdropFilter: "blur(10px)",
                      border: "3px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                      alt="المهندس المعماري"
                      className="rounded-circle img-fluid shadow-lg"
                      style={{
                        width: "300px",
                        height: "300px",
                        objectFit: "cover",
                        border: "5px solid rgba(255,255,255,0.5)",
                      }}
                    />
                  </div>
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 rounded-circle animate-float"
                    style={{
                      background:
                        "linear-gradient(45deg, rgba(255,255,255,0.1), transparent)",
                      filter: "blur(2px)",
                    }}
                  ></div>

                  {/* Floating Icons around image */}
                  <div
                    className="position-absolute animate-float-slow"
                    style={{ top: "10%", right: "10%" }}
                  >
                    <i
                      className="fas fa-star"
                      style={{
                        fontSize: "1.5rem",
                        color: "#FFD700",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                      }}
                    ></i>
                  </div>
                  <div
                    className="position-absolute animate-float-medium"
                    style={{ bottom: "15%", left: "15%" }}
                  >
                    <i
                      className="fas fa-trophy"
                      style={{
                        fontSize: "1.5rem",
                        color: "#FFD700",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                      }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section
        className="py-5 position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)",
        }}
      >
        {/* Background Pattern */}
        <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="achievement-pattern"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="2" fill="white" />
                <circle cx="10" cy="10" r="1" fill="white" />
                <circle cx="50" cy="50" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#achievement-pattern)" />
          </svg>
        </div>

        <div className="container position-relative">
          <div className="text-center mb-5">
            <h2
              className="display-5 fw-bold text-black mb-3"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
            >
              🏆 إنجازاتنا بالأرقام
            </h2>
            <p
              className="lead text-black-50"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
            >
              أرقام تتحدث عن خبرتنا ونجاحنا
            </p>
          </div>

          <div className="row text-center g-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div
                  className={`${
                    isVisible ? `animate-scale-in stagger-${index + 1}` : ""
                  }`}
                >
                  <div
                    className="card border-0 shadow-lg hover-lift h-100"
                    style={{
                      borderRadius: "25px",
                      transition: "all 0.4s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-15px) scale(1.05)";
                      e.currentTarget.style.boxShadow =
                        "0 25px 50px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 25px rgba(0,0,0,0.15)";
                    }}
                  >
                    <div className="card-body p-5">
                      {/* Icon with Gradient Background */}
                      <div className="mb-4 position-relative">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                          style={{
                            width: "80px",
                            height: "80px",
                            background: "#6c757d",
                            boxShadow: "0 8px 20px rgba(108, 117, 125, 0.3)",
                          }}
                        >
                          <i
                            className={`${achievement.icon} text-white`}
                            style={{ fontSize: "2.5rem" }}
                          ></i>
                        </div>
                        {/* Glow Effect */}
                        <div
                          className="position-absolute top-0 start-50 translate-middle-x"
                          style={{
                            width: "80px",
                            height: "80px",
                            background: "#6c757d",
                            borderRadius: "50%",
                            filter: "blur(20px)",
                            opacity: 0.3,
                            zIndex: -1,
                          }}
                        ></div>
                      </div>

                      {/* Number with Animation */}
                      <h3
                        className="fw-bold mb-3 text-dark"
                        style={{
                          fontSize: "3rem",
                        }}
                      >
                        {achievement.number}
                      </h3>

                      {/* Label */}
                      <p
                        className="text-dark mb-0 fw-semibold"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {achievement.label}
                      </p>

                      {/* Decorative Line */}
                      <div
                        className="mt-3 mx-auto"
                        style={{
                          width: "40px",
                          height: "3px",
                          background: "#6c757d",
                          borderRadius: "2px",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
