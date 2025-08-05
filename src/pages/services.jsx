import "../styles/animations.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ServiceModal from "../components/ServiceModal";
import Swal from 'sweetalert2';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isEngineer } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/services");
      setServices(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("حدث خطأ أثناء جلب الخدمات");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleShowModal = (service = null) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const handleSaveService = async (serviceData) => {
    try {
      if (selectedService) {
        // تحديث الخدمة
        await axios.put(`/api/services/${selectedService._id}`, serviceData);
      } else {
        // إضافة خدمة جديدة
        await axios.post("/api/services", serviceData);
      }
      fetchServices(); // إعادة تحميل الخدمات
      handleCloseModal();
      Swal.fire('نجاح!', 'تم حفظ الخدمة بنجاح.', 'success');
    } catch (error) {
      console.error("Error saving service:", error);
      Swal.fire('خطأ!', 'حدث خطأ أثناء حفظ الخدمة.', 'error');
    }
  };

  const handleDeleteService = async (serviceId) => {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "لن تتمكن من التراجع عن هذا!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/services/${serviceId}`);
          fetchServices(); // إعادة تحميل الخدمات
          Swal.fire('تم الحذف!', 'تم حذف الخدمة بنجاح.', 'success');
        } catch (error) {
          console.error("Error deleting service:", error);
          Swal.fire('خطأ!', 'حدث خطأ أثناء حذف الخدمة.', 'error');
        }
      }
    });
  };

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
        {/* ... (rest of the animated elements) ... */}
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
          {isEngineer() && (
            <div className="text-center mb-4">
              <button className="btn btn-primary" onClick={() => handleShowModal()}>
                <i className="fas fa-plus me-2"></i>إضافة خدمة جديدة
              </button>
            </div>
          )}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
              </div>
              <p className="text-white mt-3">جاري تحميل الخدمات...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          ) : (
            <div className="row g-4">
              {services.length === 0 ? (
                <div className="col-12 text-center text-white">
                  <p>لا توجد خدمات متاحة حالياً</p>
                </div>
              ) : (
                services.map((service) => (
                  <div
                    className="col-lg-4 col-md-6 mb-4 animate-fade-in-up"
                    key={service._id}
                    style={{ animationDelay: `${service.order * 0.1}s` }}
                  >
                    <div
                      className="card h-100 text-center shadow-lg hover-lift border-0 position-relative overflow-hidden"
                      style={{
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "20px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div className="card-body p-5 position-relative">
                        {isEngineer() && (
                          <div
                            className="position-absolute top-0 end-0 p-3"
                            style={{ zIndex: 10 }}
                          >
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleShowModal(service)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteService(service._id)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        )}
                        {/* Icon */}
                        <div className="mb-4">
                          <div
                            className="icon-wrapper d-inline-flex align-items-center justify-content-center mx-auto"
                            style={{
                              width: "80px",
                              height: "80px",
                              background: service.color || "#f8f9fa",
                              borderRadius: "50%",
                              border: "2px solid #e9ecef",
                            }}
                          >
                            {service.icon && (
                              <span 
                                style={{
                                  fontSize: service.icon.startsWith('fa-') ? '1.8rem' : '2.5rem',
                                  lineHeight: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '100%',
                                  height: '100%'
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: service.icon.startsWith('fa-') 
                                    ? `<i class="fas ${service.icon}"></i>` 
                                    : service.icon
                                }}
                              />
                            )}
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
                ))
              )}
            </div>
          )}
        </div>
      </section>

      <ServiceModal 
        show={showModal} 
        handleClose={handleCloseModal} 
        handleSave={handleSaveService} 
        service={selectedService} 
      />
    </div>
  );
}

export default Services;
