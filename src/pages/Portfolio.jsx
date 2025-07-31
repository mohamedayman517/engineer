import { useState, useEffect } from "react";
import "../styles/animations.css";

function Portfolio() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const projects = [
    {
      id: 1,
      title: "فيلا سكنية عصرية",
      category: "residential",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
      description: "تصميم فيلا عصرية بمساحة 400 متر مربع",
    },
    {
      id: 2,
      title: "مجمع تجاري",
      category: "commercial",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
      description: "مجمع تجاري متعدد الطوابق في وسط المدينة",
    },
    {
      id: 3,
      title: "مسجد حديث",
      category: "religious",
      image:
        "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=400",
      description: "تصميم مسجد بطراز معماري حديث",
    },
    {
      id: 4,
      title: "شقة سكنية",
      category: "residential",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
      description: "تصميم داخلي لشقة سكنية 150 متر",
    },
    {
      id: 5,
      title: "مكتب إداري",
      category: "commercial",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
      description: "مكتب إداري بتصميم عصري ومريح",
    },
    {
      id: 6,
      title: "منزل ريفي",
      category: "residential",
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400",
      description: "منزل ريفي بطراز تقليدي محدث",
    },
  ];

  const categories = [
    { id: "all", name: "جميع المشاريع", icon: "fas fa-th" },
    { id: "residential", name: "سكني", icon: "fas fa-home" },
    { id: "commercial", name: "تجاري", icon: "fas fa-building" },
    { id: "religious", name: "ديني", icon: "fas fa-mosque" },
  ];

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <div className="portfolio-page">
      {/* Header */}
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
          {/* Floating Portfolio Icons */}
          <div
            className="position-absolute animate-float-slow"
            style={{ top: "15%", left: "8%" }}
          >
            <i
              className="fas fa-images"
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
              className="fas fa-camera"
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
              className="fas fa-palette"
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
              className="fas fa-pencil-ruler"
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

        <div className="container text-center position-relative">
          <div className={`${isVisible ? "animate-fade-in-up" : ""}`}>
            <h1
              className="display-3 fw-bold text-white mb-4"
              style={{
                textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
                lineHeight: "1.1",
              }}
            >
              معرض أعمالنا
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
              مجموعة مختارة من أفضل مشاريعنا المعمارية والتصميمية
            </p>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
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
                id="filter-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <rect width="2" height="2" x="10" y="10" fill="white" />
                <rect width="2" height="2" x="30" y="30" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#filter-pattern)" />
          </svg>
        </div>

        <div className="container position-relative">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-dark mb-4" style={{ color: "#2c3e50" }}>
              فئات المشاريع
            </h3>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div
                className={`d-flex flex-wrap justify-content-center gap-3 ${
                  isVisible ? "animate-scale-in stagger-2" : ""
                }`}
              >
                {categories.map((category, index) => (
                  <button
                    key={category.id}
                    className={`btn btn-lg portfolio-filter-btn ${
                      activeCategory === category.id
                        ? "btn-dark"
                        : "btn-outline-dark"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                    style={{
                      borderRadius: "25px",
                      padding: "12px 30px",
                      fontWeight: "600",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <i className={`${category.icon} me-2`}></i>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ color: "#2c3e50" }}>
              المشاريع المميزة
            </h2>
            <p className="lead text-muted">
              استكشف مجموعة متنوعة من المشاريع المعمارية المبتكرة
            </p>
          </div>

          <div className="row g-4">
            {filteredProjects.map((project, index) => (
              <div key={project.id} className="col-lg-4 col-md-6 mb-4">
                <div
                  className={`card h-100 border-0 shadow hover-lift ${
                    isVisible
                      ? `animate-fade-in-up stagger-${(index % 6) + 1}`
                      : ""
                  }`}
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                >
                  <div className="position-relative overflow-hidden">
                    <img
                      src={project.image}
                      className="card-img-top"
                      alt={project.title}
                      style={{
                        height: "280px",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                    />

                    {/* Hover Overlay */}
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{
                        background: "rgba(0,0,0,0.7)",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.opacity = 1;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = 0;
                      }}
                    >
                      <button
                        className="btn btn-light btn-lg shadow-lg"
                        style={{
                          borderRadius: "25px",
                          padding: "12px 25px",
                          fontWeight: "600",
                          backdropFilter: "blur(10px)",
                          background: "rgba(255,255,255,0.95)",
                        }}
                      >
                        <i className="fas fa-eye me-2"></i>
                        عرض التفاصيل
                      </button>
                    </div>

                    {/* Category Badge */}
                    <div className="position-absolute top-3 end-3">
                      <span
                        className={`badge fs-6 px-3 py-2 ${
                          project.category === "residential"
                            ? "bg-success"
                            : project.category === "commercial"
                            ? "bg-warning"
                            : "bg-info"
                        }`}
                        style={{
                          borderRadius: "15px",
                          backdropFilter: "blur(10px)",
                          fontWeight: "600",
                        }}
                      >
                        <i
                          className={`${
                            categories.find(
                              (cat) => cat.id === project.category
                            )?.icon
                          } me-1`}
                        ></i>
                        {
                          categories.find((cat) => cat.id === project.category)
                            ?.name
                        }
                      </span>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    <h5
                      className="card-title fw-bold mb-3"
                      style={{
                        color: "#333",
                        fontSize: "1.3rem",
                      }}
                    >
                      {project.title}
                    </h5>
                    <p
                      className="card-text text-muted lh-lg mb-4"
                      style={{ fontSize: "1rem" }}
                    >
                      {project.description}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center text-muted">
                        <i className="fas fa-calendar me-2"></i>
                        <small className="fw-semibold">2024</small>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          style={{ borderRadius: "15px" }}
                        >
                          <i className="fas fa-heart"></i>
                        </button>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          style={{ borderRadius: "15px" }}
                        >
                          <i className="fas fa-share"></i>
                        </button>
                      </div>
                    </div>

                    {/* Decorative Line */}
                    <div
                      className="mt-3"
                      style={{
                        width: "50px",
                        height: "3px",
                        background: "#6c757d",
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

      {/* Call to Action */}
      <section
        className="py-5 position-relative overflow-hidden"
        style={{
          background: "#ffffff",
        }}
      >
        {/* Background Pattern */}
        <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="cta-pattern"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="40" cy="40" r="3" fill="white" />
                <circle cx="20" cy="20" r="2" fill="white" />
                <circle cx="60" cy="60" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-pattern)" />
          </svg>
        </div>

        <div className="container text-center position-relative">
          <div className={`${isVisible ? "animate-fade-in-up stagger-3" : ""}`}>
            <h3
              className="display-5 fw-bold mb-4 text-dark"
              style={{
                fontSize: "2.5rem",
                lineHeight: "1.2",
              }}
            >
              💡 هل لديك مشروع في ذهنك؟
            </h3>
            <p
              className="lead mb-5 text-muted fs-4"
              style={{
                maxWidth: "600px",
                margin: "0 auto 2rem",
                lineHeight: "1.6",
              }}
            >
              دعني أساعدك في تحويل أفكارك إلى واقع معماري مذهل يجمع بين الجمال
              والوظيفية
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button
                className="btn btn-primary btn-lg px-5 py-3 hover-lift"
                style={{
                  borderRadius: "25px",
                  background: "#007bff",
                  border: "2px solid #007bff",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)",
                }}
              >
                <i className="fas fa-phone me-2"></i>
                تواصل معي الآن
              </button>

              <button
                className="btn btn-outline-secondary btn-lg px-5 py-3 hover-lift"
                style={{
                  borderRadius: "25px",
                  border: "2px solid #6c757d",
                  background: "transparent",
                  color: "#6c757d",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                }}
              >
                <i className="fas fa-calendar me-2"></i>
                احجز استشارة مجانية
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Portfolio;
