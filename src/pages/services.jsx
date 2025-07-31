import "../styles/animations.css";

function Services() {
  const services = [
    {
      title: "التصميم المعماري",
      description:
        "تصميم معماري إبداعي ووظيفي للمساحات السكنية والتجارية والعامة مع مراعاة أحدث المعايير العالمية.",
      icon: "🏛️",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "التصميم الداخلي",
      description:
        "حلول تصميم داخلي أنيقة وعصرية مصممة خصيصاً لتناسب ذوقك واحتياجاتك الشخصية.",
      icon: "🛋️",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "التصور ثلاثي الأبعاد",
      description:
        "عروض ثلاثية الأبعاد عالية الجودة لمساعدتك على تصور النتيجة النهائية قبل البدء في البناء.",
      icon: "🎨",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "إشراف البناء",
      description:
        "إشراف مهني على الموقع لضمان تنفيذ المشروع وفقاً للتصميم والمعايير المطلوبة.",
      icon: "🧱",
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      title: "التخطيط العمراني",
      description:
        "تخطيط استراتيجي للمخططات العمرانية المستدامة وتطوير المجتمعات الحديثة.",
      icon: "🌆",
      color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      title: "الاستشارات الهندسية",
      description:
        "استشارات هندسية متخصصة في جميع مراحل المشروع من التخطيط إلى التنفيذ.",
      icon: "📐",
      color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
  ];

  return (
    <div
      className="min-vh-100 d-flex flex-column position-relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark Overlay */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          zIndex: 1,
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
            className="fas fa-building"
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
            className="fas fa-home"
            style={{
              fontSize: "3rem",
              color: "rgba(255,255,255,0.12)",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
            }}
          ></i>
        </div>

        <div
          className="position-absolute animate-float-fast"
          style={{ top: "45%", left: "15%" }}
        >
          <i
            className="fas fa-city"
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
            className="fas fa-drafting-compass"
            style={{
              fontSize: "2.5rem",
              color: "rgba(255,255,255,0.13)",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
            }}
          ></i>
        </div>

        <div
          className="position-absolute animate-float-medium"
          style={{ bottom: "15%", left: "25%" }}
        >
          <i
            className="fas fa-ruler-combined"
            style={{
              fontSize: "3rem",
              color: "rgba(255,255,255,0.11)",
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

        <div
          className="position-absolute animate-float-fast"
          style={{ bottom: "40%", right: "25%" }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.15)",
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

      {/* Header Section */}
      <section
        className="py-5 text-white position-relative"
        style={{ zIndex: 2 }}
      >
        <div className="container text-center">
          <h1
            className="display-3 fw-bold mb-4 animate-fade-in-up text-white"
            style={{
              textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
              lineHeight: "1.1",
            }}
          >
            خدماتنا
          </h1>
          <p
            className="lead mb-5 animate-fade-in-up"
            style={{
              animationDelay: "0.2s",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              fontSize: "1.3rem",
              maxWidth: "600px",
              margin: "0 auto",
              opacity: "0.9",
            }}
          >
            نقدم مجموعة شاملة من الخدمات المعمارية والهندسية المتطورة
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section
        className="flex-grow-1 py-5 position-relative"
        style={{ zIndex: 2 }}
      >
        <div className="container">
          <div className="row g-4">
            {services.map((service, index) => (
              <div
                className="col-lg-4 col-md-6 mb-4 animate-fade-in-up"
                key={index}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="card h-100 text-center shadow-lg hover-lift border-0 position-relative overflow-hidden"
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "20px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-10px) scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.15)";
                  }}
                >
                  <div className="card-body p-5 position-relative">
                    {/* Icon */}
                    <div className="mb-4">
                      <div
                        className="icon-wrapper d-inline-flex align-items-center justify-content-center mx-auto"
                        style={{
                          width: "80px",
                          height: "80px",
                          background: "#f8f9fa",
                          borderRadius: "50%",
                          border: "2px solid #e9ecef",
                        }}
                      >
                        <span style={{ fontSize: "2.5rem" }}>
                          {service.icon}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h5 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>
                      {service.title}
                    </h5>

                    {/* Description */}
                    <p className="text-muted small lh-lg">
                      {service.description}
                    </p>
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

export default Services;
