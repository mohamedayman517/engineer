import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/animations.css";
import "../styles/projectDetails.css";
import Swal from "sweetalert2";

function ProjectDetails() {
  const { id } = useParams();
  const { isEngineer } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectImages, setProjectImages] = useState([]);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      // جلب تفاصيل المشروع من الخادم
      console.log("جاري جلب تفاصيل المشروع بالمعرف:", id);
      const response = await axios.get(`/api/projects/${id}`);
      const projectData = response.data;
      console.log("تم استلام بيانات المشروع:", projectData);
      console.log("الصورة الرئيسية:", projectData.imageUrl);
      console.log("الصور الإضافية:", projectData.images);
      setProject(projectData);
      
      // تجهيز مصفوفة الصور للعرض
      const allImages = [];
      
      // إضافة الصورة الرئيسية أولاً
      if (projectData.imageUrl) {
        allImages.push(projectData.imageUrl);
      }
      
      // إضافة الصور الإضافية إذا كانت موجودة
      if (projectData.images && Array.isArray(projectData.images) && projectData.images.length > 0) {
        // تصفية الصور للتأكد من أنها روابط صالحة
        const validImages = projectData.images.filter(img => {
          // التحقق من أن الرابط صالح وليس مجرد نص وهمي
          return img && typeof img === 'string' && img.startsWith('http');
        });
        
        console.log("الصور الإضافية الصالحة:", validImages);
        allImages.push(...validImages);
      }
      
      console.log("مصفوفة جميع الصور:", allImages);
      
      setProjectImages(allImages);
      setError(null);
    } catch (err) {
      console.error("Error fetching project details:", err);
      setError("فشل في تحميل تفاصيل المشروع. يرجى المحاولة مرة أخرى لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  const [activeImage, setActiveImage] = useState(0);

  const handleImageClick = (index) => {
    setActiveImage(index);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
        <p className="mt-3">جاري تحميل تفاصيل المشروع...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/portfolio" className="btn btn-primary mt-3">
          العودة إلى صفحة المشاريع
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning" role="alert">
          المشروع غير موجود
        </div>
        <Link to="/portfolio" className="btn btn-primary mt-3">
          العودة إلى صفحة المشاريع
        </Link>
      </div>
    );
  }

  return (
    <div className="container project-details-page animate-fade-in">
      <div className="row mb-4">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">الرئيسية</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/portfolio">المشاريع</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {project.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mb-4">
          {/* عرض الصورة الرئيسية */}
          <div className="position-relative overflow-hidden mb-4">
            <img
              src={projectImages[activeImage] || project.imageUrl}
              alt={project.title}
              className="img-fluid w-100 project-main-image"
              style={{ maxHeight: "600px", objectFit: "cover" }}
            />
          </div>

          {/* معرض الصور المصغرة */}
          <div className="row g-2 mb-4">
            {projectImages.map((img, index) => (
              <div className="col-3" key={index}>
                <div
                  className={`thumbnail-container ${index === activeImage ? 'active-thumbnail' : ''}`}
                  onClick={() => handleImageClick(index)}
                  style={{
                    cursor: "pointer",
                    border: index === activeImage ? "3px solid #0d6efd" : "1px solid #dee2e6",
                    borderRadius: "8px",
                    overflow: "hidden",
                    height: "100px",
                  }}
                >
                  <img
                    src={img}
                    alt={`صورة ${index + 1}`}
                    className="img-fluid w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card project-details-card border-0 h-100">
            <div className="card-body">
              <h2 className="card-title mb-4 fw-bold">{project.title}</h2>
              
              <div className="mb-4">
                <span
                  className={`project-category-badge ${project.category === "residential" ? "bg-success" : project.category === "commercial" ? "bg-warning" : "bg-info"}`}
                >
                  {project.category === "residential"
                    ? "سكني"
                    : project.category === "commercial"
                    ? "تجاري"
                    : project.category === "interior"
                    ? "تصميم داخلي"
                    : "ترميم"}
                </span>
              </div>
              
              <p className="card-text mb-4">{project.description}</p>
              
              <div className="project-details">
                <div className="project-info-row row">
                  <div className="col-5 project-info-label">الموقع:</div>
                  <div className="col-7">{project.location || "غير محدد"}</div>
                </div>
                
                <div className="project-info-row row">
                  <div className="col-5 project-info-label">المساحة:</div>
                  <div className="col-7">{project.area || "غير محدد"}</div>
                </div>
                
                <div className="project-info-row row">
                  <div className="col-5 project-info-label">العميل:</div>
                  <div className="col-7">{project.client || "غير محدد"}</div>
                </div>
                
                <div className="project-info-row row">
                  <div className="col-5 project-info-label">سنة الإنجاز:</div>
                  <div className="col-7">{project.year || "غير محدد"}</div>
                </div>
              </div>
              
             
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12 text-center">
          <Link to="/portfolio" className="btn btn-outline-primary btn-lg px-5 back-to-projects-btn">
            <i className="fas fa-arrow-right me-2"></i>
            العودة إلى جميع المشاريع
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;