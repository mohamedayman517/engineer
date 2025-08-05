import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/animations.css";
import Swal from "sweetalert2";

function Portfolio() {
  const { isEngineer } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    category: "residential",
    imageUrl: "",
    images: [],
    client: "",
    year: new Date().getFullYear(),
    location: "",
    area: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log("Fetching projects from API...");
      const response = await axios.get("/api/projects");
      console.log("Projects API response:", response.data);
      setProjects(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects:", err);
      console.error("Error details:", err.response ? err.response.data : "No response data");
      console.error("Error status:", err.response ? err.response.status : "No status");
      console.error("Error headers:", err.response ? err.response.headers : "No headers");
      setError("فشل في تحميل المشاريع. يرجى المحاولة مرة أخرى لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      // عرض تأكيد الحذف
      const result = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تتمكن من استعادة هذا المشروع!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "نعم، قم بالحذف!",
        cancelButtonText: "إلغاء"
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // تحديث قائمة المشاريع
        fetchProjects();
        
        Swal.fire({
          title: "تم الحذف!",
          text: "تم حذف المشروع بنجاح.",
          icon: "success",
          confirmButtonText: "حسناً"
        });
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      Swal.fire({
        title: "خطأ!",
        text: "حدث خطأ أثناء حذف المشروع.",
        icon: "error",
        confirmButtonText: "حسناً"
      });
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      let finalImageUrl = editingProject.imageUrl;
      let additionalImageUrls = editingProject.images || [];

      // إذا تم اختيار ملف جديد، قم برفعه أولاً
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const uploadResponse = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        finalImageUrl = uploadResponse.data.imageUrl;
      }

      // رفع الصور الإضافية إذا وجدت
      console.log("الصور الإضافية قبل الرفع:", additionalFiles);
      console.log("روابط الصور الإضافية الحالية:", additionalImageUrls);
      
      if (additionalFiles.length > 0) {
        for (const file of additionalFiles) {
          const formData = new FormData();
          formData.append("image", file);

          console.log("جاري رفع الصورة الإضافية:", file.name);
          const uploadResponse = await axios.post("/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("تم رفع الصورة الإضافية بنجاح:", uploadResponse.data.imageUrl);
          additionalImageUrls.push(uploadResponse.data.imageUrl);
        }
      }
      
      console.log("روابط الصور الإضافية بعد الرفع:", additionalImageUrls);

      // تأكد من أن additionalImageUrls هو مصفوفة
      if (!additionalImageUrls) {
        additionalImageUrls = [];
      } else if (!Array.isArray(additionalImageUrls)) {
        // إذا كان additionalImageUrls ليس مصفوفة ولكنه رابط صالح، قم بتحويله إلى مصفوفة
        if (typeof additionalImageUrls === 'string' && additionalImageUrls.startsWith('http')) {
          additionalImageUrls = [additionalImageUrls];
        } else {
          additionalImageUrls = [];
        }
      }

      // تصفية الصور للتأكد من أنها روابط صالحة
      const validImageUrls = additionalImageUrls.filter(url => {
        return url && typeof url === 'string' && url.startsWith('http');
      });

      console.log("روابط الصور الإضافية بعد التصفية:", validImageUrls);

      const projectData = {
        ...editingProject,
        imageUrl: finalImageUrl,
        images: validImageUrls,
      };

      console.log("بيانات المشروع المرسلة للتحديث:", projectData);
      console.log("الصور الإضافية المرسلة للتحديث:", projectData.images);

      const updateResponse = await axios.put(`/api/projects/${editingProject._id}`, projectData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("استجابة تحديث المشروع:", updateResponse.data);

      setShowEditModal(false);
      setEditingProject(null);
      setSelectedFile(null);
      setImagePreview(null);
      setAdditionalFiles([]);
      setAdditionalPreviews([]);
      fetchProjects();
      
      Swal.fire({
        title: "تم بنجاح!",
        text: "تم تحديث المشروع بنجاح",
        icon: "success",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#28a745"
      });
    } catch (err) {
      console.error("Error updating project:", err);
      Swal.fire({
        title: "خطأ!",
        text: "فشل في تحديث المشروع. يرجى المحاولة مرة أخرى.",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#dc3545"
      });
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      let finalImageUrl = newProject.imageUrl;
      let additionalImageUrls = [];

      // إذا تم اختيار ملف رئيسي، قم برفعه أولاً
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const uploadResponse = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        finalImageUrl = uploadResponse.data.imageUrl;
      }

      // رفع الصور الإضافية إذا وجدت
      console.log("الصور الإضافية قبل الرفع (إضافة مشروع جديد):", additionalFiles);
      
      if (additionalFiles.length > 0) {
        for (const file of additionalFiles) {
          const formData = new FormData();
          formData.append("image", file);

          console.log("جاري رفع الصورة الإضافية (إضافة مشروع جديد):", file.name);
          const uploadResponse = await axios.post("/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("تم رفع الصورة الإضافية بنجاح (إضافة مشروع جديد):", uploadResponse.data.imageUrl);
          additionalImageUrls.push(uploadResponse.data.imageUrl);
        }
      }
      
      console.log("روابط الصور الإضافية بعد الرفع (إضافة مشروع جديد):", additionalImageUrls);

      // تأكد من أن additionalImageUrls هو مصفوفة
      if (!additionalImageUrls) {
        additionalImageUrls = [];
      } else if (!Array.isArray(additionalImageUrls)) {
        // إذا كان additionalImageUrls ليس مصفوفة ولكنه رابط صالح، قم بتحويله إلى مصفوفة
        if (typeof additionalImageUrls === 'string' && additionalImageUrls.startsWith('http')) {
          additionalImageUrls = [additionalImageUrls];
        } else {
          additionalImageUrls = [];
        }
      }

      // تصفية الصور للتأكد من أنها روابط صالحة
      const validImageUrls = additionalImageUrls.filter(url => {
        return url && typeof url === 'string' && url.startsWith('http');
      });

      console.log("روابط الصور الإضافية بعد التصفية (إضافة مشروع جديد):", validImageUrls);

      const projectData = {
        ...newProject,
        imageUrl: finalImageUrl,
        images: validImageUrls,
      };

      console.log("بيانات المشروع الجديد المرسلة للإضافة:", projectData);
      console.log("الصور الإضافية المرسلة للإضافة:", projectData.images);

      const addResponse = await axios.post("/api/projects", projectData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("استجابة إضافة المشروع الجديد:", addResponse.data);

      setShowAddModal(false);
      setNewProject({
        title: "",
        description: "",
        category: "residential",
        imageUrl: "",
        images: [],
        client: "",
        year: new Date().getFullYear(),
        location: "",
        area: "",
      });
      setSelectedFile(null);
      setImagePreview(null);
      setAdditionalFiles([]);
      setAdditionalPreviews([]);
      fetchProjects();
      Swal.fire({
        title: "تم بنجاح!",
        text: "تم إضافة المشروع بنجاح",
        icon: "success",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#28a745"
      });
    } catch (err) {
      console.error("Error adding project:", err);
      Swal.fire({
        title: "خطأ!",
        text: "فشل في إضافة المشروع. يرجى المحاولة مرة أخرى.",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#dc3545"
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = [
    { id: "all", name: "جميع المشاريع", icon: "fas fa-th" },
    { id: "residential", name: "سكني", icon: "fas fa-home" },
    { id: "commercial", name: "تجاري", icon: "fas fa-building" },
    { id: "interior", name: "تصميم داخلي", icon: "fas fa-couch" },
    { id: "renovation", name: "تجديد", icon: "fas fa-tools" },
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

                {/* Add Project Button - Only visible to engineers */}
                {isEngineer() && (
                  <button
                    className="btn btn-success btn-lg"
                    onClick={() => setShowAddModal(true)}
                    style={{
                      borderRadius: "25px",
                      padding: "12px 30px",
                      fontWeight: "600",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <i className="fas fa-plus me-2"></i>
                    إضافة مشروع جديد
                  </button>
                )}
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

          {loading && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
              </div>
              <p className="mt-2">جاري تحميل المشاريع...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {!loading && !error && filteredProjects.length === 0 && (
            <div className="text-center text-muted">
              <i className="fas fa-folder-open fa-3x mb-3"></i>
              <p>لا توجد مشاريع لعرضها حالياً.</p>
            </div>
          )}

          <div className="row g-4">
            {filteredProjects.map((project, index) => (
              <div key={project._id} className="col-lg-4 col-md-6 mb-4">
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
                      src={project.imageUrl}
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
                      <Link
                        to={`/project/${project._id}`}
                        className="btn btn-light btn-lg shadow-lg"
                        style={{
                          borderRadius: "25px",
                          padding: "12px 25px",
                          fontWeight: "600",
                          backdropFilter: "blur(10px)",
                          background: "rgba(255,255,255,0.95)",
                          textDecoration: "none"
                        }}
                      >
                        <i className="fas fa-eye me-2"></i>
                        عرض التفاصيل
                      </Link>
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
                        
                        {/* Edit/Delete buttons for engineers */}
                        {/* أزرار التعديل والحذف تم نقلها إلى داخل بطاقة المشروع */}
                        {
                          categories.find((cat) => cat.id === project.category)
                            ?.name
                        }
                      </span>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5
                        className="card-title fw-bold mb-0"
                        style={{
                          color: "#333",
                          fontSize: "1.3rem",
                        }}
                      >
                        {project.title}
                      </h5>
                      {isEngineer() && (
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-warning" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingProject(project);
                              setShowEditModal(true);
                              // تهيئة الصور الإضافية عند فتح نافذة التعديل
                              setAdditionalFiles([]);
                              setAdditionalPreviews([]);
                            }}
                            title="تعديل المشروع"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project._id);
                            }}
                            title="حذف المشروع"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    <p
                      className="card-text text-muted lh-lg mb-4"
                      style={{ fontSize: "1rem" }}
                    >
                      {project.description}
                    </p>

                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      {project.year && (
                        <div className="d-flex align-items-center text-muted mb-1">
                          <i className="fas fa-calendar me-2"></i>
                          <small className="fw-semibold">{project.year}</small>
                        </div>
                      )}
                      {project.location && (
                        <div className="d-flex align-items-center text-muted mb-1">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          <small className="fw-semibold">
                            {project.location}
                          </small>
                        </div>
                      )}
                      {project.area && (
                        <div className="d-flex align-items-center text-muted mb-1">
                          <i className="fas fa-ruler-combined me-2"></i>
                          <small className="fw-semibold">{project.area}</small>
                        </div>
                      )}
                      {project.client && (
                        <div className="d-flex align-items-center text-muted mb-1">
                          <i className="fas fa-user me-2"></i>
                          <small className="fw-semibold">
                            {project.client}
                          </small>
                        </div>
                      )}
                    </div>

                    {project.isFeatured && (
                      <div className="mt-2">
                        <span className="badge bg-warning text-dark">
                          <i className="fas fa-star me-1"></i>
                          مشروع مميز
                        </span>
                      </div>
                    )}

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

      {/* Add Project Modal */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">إضافة مشروع جديد</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddProject}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">عنوان المشروع</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={newProject.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">الفئة</label>
                      <select
                        className="form-control"
                        name="category"
                        value={newProject.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="residential">سكني</option>
                        <option value="commercial">تجاري</option>
                        <option value="interior">تصميم داخلي</option>
                        <option value="renovation">تجديد</option>
                      </select>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">وصف المشروع</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={newProject.description}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">صورة المشروع الرئيسية</label>
                      <div className="row">
                        <div className="col-md-6">
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          <small className="text-muted">أو</small>
                          <input
                            type="url"
                            className="form-control mt-2"
                            name="imageUrl"
                            value={newProject.imageUrl}
                            onChange={handleInputChange}
                            placeholder="رابط الصورة: https://example.com/image.jpg"
                          />
                        </div>
                        <div className="col-md-6">
                          {imagePreview && (
                            <div className="text-center">
                              <img
                                src={imagePreview}
                                alt="معاينة"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "150px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  border: "2px solid #dee2e6",
                                }}
                              />
                              <p className="small text-muted mt-1">
                                معاينة الصورة الرئيسية
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">صور إضافية للمشروع</label>
                      <div className="row">
                        <div className="col-md-6">
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files);
                              setAdditionalFiles(prev => [...prev, ...files]);
                              
                              // إنشاء معاينات للصور
                              const newPreviews = [];
                              files.forEach(file => {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  newPreviews.push(e.target.result);
                                  if (newPreviews.length === files.length) {
                                    setAdditionalPreviews(prev => [...prev, ...newPreviews]);
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            }}
                          />
                          <small className="text-muted d-block mt-1">
                            <i className="fas fa-info-circle me-1"></i>
                            يمكنك اختيار صور متعددة أو النقر على زر التحميل مرات متعددة لإضافة المزيد من الصور
                          </small>
                        </div>
                        <div className="col-md-6">
                          {additionalPreviews.length > 0 && (
                            <div>
                              <div className="d-flex flex-wrap gap-2 mt-2">
                                {additionalPreviews.map((preview, index) => (
                                  <div key={index} className="position-relative">
                                    <img
                                      src={preview}
                                      alt={`معاينة ${index + 1}`}
                                      style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        border: "2px solid #dee2e6",
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-danger position-absolute"
                                      style={{ top: "-10px", right: "-10px", borderRadius: "50%", padding: "0.2rem 0.5rem" }}
                                      onClick={() => {
                                        setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
                                        setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
                                      }}
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <p className="small text-muted mt-1">
                                {additionalPreviews.length} صورة إضافية
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">العميل</label>
                      <input
                        type="text"
                        className="form-control"
                        name="client"
                        value={newProject.client}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">السنة</label>
                      <input
                        type="number"
                        className="form-control"
                        name="year"
                        value={newProject.year}
                        onChange={handleInputChange}
                        min="2000"
                        max="2030"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">الموقع</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={newProject.location}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">المساحة</label>
                      <input
                        type="text"
                        className="form-control"
                        name="area"
                        value={newProject.area}
                        onChange={handleInputChange}
                        placeholder="مثال: 150 متر مربع"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="btn btn-success">
                    إضافة المشروع
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && editingProject && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">تعديل المشروع</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProject(null);
                    setSelectedFile(null);
                    setImagePreview(null);
                    setAdditionalFiles([]);
                    setAdditionalPreviews([]);
                  }}
                ></button>
              </div>
              <form onSubmit={handleUpdateProject}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">عنوان المشروع</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">الفئة</label>
                      <select
                        className="form-control"
                        name="category"
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                        required
                      >
                        <option value="residential">سكني</option>
                        <option value="commercial">تجاري</option>
                        <option value="interior">تصميم داخلي</option>
                        <option value="renovation">تجديد</option>
                      </select>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">وصف المشروع</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">صورة المشروع الرئيسية</label>
                      <div className="row">
                        <div className="col-md-6">
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          <small className="text-muted">الصورة الحالية</small>
                        </div>
                        <div className="col-md-6">
                          <div className="text-center">
                            <img
                              src={imagePreview || editingProject.imageUrl}
                              alt="معاينة"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "150px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "2px solid #dee2e6",
                              }}
                            />
                            <p className="small text-muted mt-1">
                              معاينة الصورة الرئيسية
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">صور إضافية للمشروع</label>
                      <div className="row">
                        <div className="col-md-6">
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files);
                              setAdditionalFiles(prev => [...prev, ...files]);
                              
                              // إنشاء معاينات للصور
                              const newPreviews = [];
                              files.forEach(file => {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  newPreviews.push(e.target.result);
                                  if (newPreviews.length === files.length) {
                                    setAdditionalPreviews(prev => [...prev, ...newPreviews]);
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            }}
                          />
                          <small className="text-muted d-block mt-1">
                            <i className="fas fa-info-circle me-1"></i>
                            يمكنك اختيار صور متعددة أو النقر على زر التحميل مرات متعددة لإضافة المزيد من الصور
                          </small>
                        </div>
                        <div className="col-md-6">
                          <div>
                            {/* عرض الصور الحالية للمشروع */}
                            {editingProject.images && editingProject.images.length > 0 && (
                              <div className="mb-3">
                                <p className="small text-muted mb-2">الصور الحالية:</p>
                                <div className="d-flex flex-wrap gap-2">
                                  {editingProject.images.map((imgUrl, index) => (
                                    <div key={`existing-${index}`} className="position-relative">
                                      <img
                                        src={imgUrl}
                                        alt={`صورة ${index + 1}`}
                                        style={{
                                          width: "80px",
                                          height: "80px",
                                          objectFit: "cover",
                                          borderRadius: "8px",
                                          border: "2px solid #dee2e6",
                                        }}
                                      />
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger position-absolute"
                                        style={{ top: "-10px", right: "-10px", borderRadius: "50%", padding: "0.2rem 0.5rem" }}
                                        onClick={() => {
                                          const updatedImages = [...editingProject.images];
                                          updatedImages.splice(index, 1);
                                          setEditingProject({...editingProject, images: updatedImages});
                                        }}
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* عرض الصور الجديدة المضافة */}
                            {additionalPreviews.length > 0 && (
                              <div>
                                <p className="small text-muted mb-2">الصور الجديدة:</p>
                                <div className="d-flex flex-wrap gap-2">
                                  {additionalPreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="position-relative">
                                      <img
                                        src={preview}
                                        alt={`معاينة ${index + 1}`}
                                        style={{
                                          width: "80px",
                                          height: "80px",
                                          objectFit: "cover",
                                          borderRadius: "8px",
                                          border: "2px solid #dee2e6",
                                        }}
                                      />
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger position-absolute"
                                        style={{ top: "-10px", right: "-10px", borderRadius: "50%", padding: "0.2rem 0.5rem" }}
                                        onClick={() => {
                                          setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
                                          setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
                                        }}
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">العميل</label>
                      <input
                        type="text"
                        className="form-control"
                        name="client"
                        value={editingProject.client || ""}
                        onChange={(e) => setEditingProject({...editingProject, client: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">السنة</label>
                      <input
                        type="number"
                        className="form-control"
                        name="year"
                        value={editingProject.year}
                        onChange={(e) => setEditingProject({...editingProject, year: e.target.value})}
                        min="2000"
                        max="2030"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">الموقع</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={editingProject.location || ""}
                        onChange={(e) => setEditingProject({...editingProject, location: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">المساحة</label>
                      <input
                        type="text"
                        className="form-control"
                        name="area"
                        value={editingProject.area || ""}
                        onChange={(e) => setEditingProject({...editingProject, area: e.target.value})}
                        placeholder="مثال: 150 متر مربع"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingProject(null);
                      setSelectedFile(null);
                      setImagePreview(null);
                      setAdditionalFiles([]);
                      setAdditionalPreviews([]);
                    }}
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="btn btn-primary">
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
