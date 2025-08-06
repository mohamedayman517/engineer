import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/animations.css";
import Swal from "sweetalert2";
import VideoPlayer from "../components/VideoPlayer";

function Videos() {
  const { isEngineer } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoUrl: "",
    category: "residential",
  });
  
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  
  const categories = [
    { id: "all", name: "جميع الفيديوهات", icon: "fas fa-th" },
    { id: "residential", name: "سكني", icon: "fas fa-home" },
    { id: "commercial", name: "تجاري", icon: "fas fa-building" },
    { id: "renovation", name: "تجديد", icon: "fas fa-tools" },
    { id: "interior", name: "تصميم داخلي", icon: "fas fa-couch" },
  ];

  useEffect(() => {
    // Trigger animations on component mount
    setIsVisible(true);
    fetchVideos();
  }, []);
  
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/videos");
      setVideos(response.data);
      setError(null);
    } catch (err) {
      setError("فشل في تحميل الفيديوهات. يرجى المحاولة مرة أخرى لاحقاً.");
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVideoUpload = async (file) => {
    if (!file) return null;
    
    try {
      setUploadingVideo(true);
      setUploadProgress(0);
      
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      
      console.log("Starting video upload...");
      const response = await axios.post("/api/upload/video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
          setUploadProgress(percentCompleted);
        },
        timeout: 300000 // زيادة مهلة الطلب إلى 5 دقائق
      });
      
      console.log("Upload successful:", response.data);
      setUploadingVideo(false);
      return response.data.videoUrl;
    } catch (err) {
      setUploadingVideo(false);
      console.error("Error uploading video:", err);
      
      // عرض رسالة خطأ أكثر تفصيلاً
      let errorMessage = "فشل في رفع الفيديو. يرجى المحاولة مرة أخرى.";
      let errorDetails = "";
      
      if (err.response) {
        // الخادم استجاب برمز حالة خارج نطاق 2xx
        console.error("Server error:", err.response.data);
        errorMessage = err.response.data.message || errorMessage;
        errorDetails = `رمز الخطأ: ${err.response.status}`;
      } else if (err.request) {
        // لم يتم استلام استجابة من الخادم
        console.error("No response from server:", err.request);
        errorMessage = "لم يتم استلام استجابة من الخادم. تحقق من اتصالك بالإنترنت.";
        errorDetails = "ERR_CONNECTION_RESET - قد يكون حجم الملف كبير جدًا أو انقطع الاتصال";
      } else {
        // خطأ في إعداد الطلب
        errorDetails = err.message || "خطأ غير معروف";
      }
      
      console.error("Upload error details:", errorDetails);
      
      Swal.fire({
        title: "خطأ!",
        html: `${errorMessage}<br><small class="text-muted">${errorDetails}</small>`,
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#dc3545"
      });
      return null;
    }
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // التحقق من نوع الملف
    if (!file.type.includes("video/")) {
      Swal.fire({
        title: "خطأ!",
        text: "يرجى اختيار ملف فيديو صالح",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#dc3545"
      });
      return;
    }
    
    // التحقق من حجم الملف (100MB كحد أقصى)
    if (file.size > 100 * 1024 * 1024) {
      Swal.fire({
        title: "خطأ!",
        text: "حجم الفيديو يجب أن يكون أقل من 100 ميجابايت",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#dc3545"
      });
      return;
    }
    
    const videoUrl = await handleVideoUpload(file);
    if (videoUrl) {
      setNewVideo({
        ...newVideo,
        videoUrl
      });
    }
  };
  
  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      // التحقق من وجود رابط فيديو مرفوع
      if (!newVideo.videoUrl) {
        Swal.fire({
          title: "خطأ!",
          text: "يجب رفع فيديو",
          icon: "error",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#dc3545"
        });
        return;
      }
      
      const videoData = {
        ...newVideo,
      };

      await axios.post("/api/videos", videoData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowAddModal(false);
      setNewVideo({
        title: "",
        description: "",
        videoUrl: "",
        category: "residential",
      });
      fetchVideos();
      Swal.fire({
        title: "تم بنجاح!",
        text: "تم إضافة الفيديو بنجاح",
        icon: "success",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#28a745"
      });
    } catch (err) {
      console.error("Error adding video:", err);
      Swal.fire({
        title: "خطأ!",
        text: err.response?.data?.error || "حدث خطأ أثناء إضافة الفيديو",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#dc3545"
      });
    }
  };
  
  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    try {
      if (!editingVideo.videoUrl) {
        Swal.fire({
          title: "خطأ!",
          text: "يرجى رفع فيديو أولاً",
          icon: "error",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#dc3545"
        });
        return;
      }
      
      const token = localStorage.getItem("token");
      const videoData = {
        ...editingVideo
      };

      await axios.put(`/api/videos/${editingVideo._id}`, videoData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowEditModal(false);
      setEditingVideo(null);
      fetchVideos();
      
      Swal.fire({
        title: "تم بنجاح!",
        text: "تم تحديث الفيديو بنجاح",
        icon: "success",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#28a745"
      });
    } catch (err) {
      console.error("Error updating video:", err);
      
      Swal.fire({
        title: "خطأ!",
        text: "فشل في تحديث الفيديو. يرجى المحاولة مرة أخرى.",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#dc3545"
      });
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      // عرض تأكيد الحذف
      const result = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تتمكن من استعادة هذا الفيديو!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "نعم، قم بالحذف!",
        cancelButtonText: "إلغاء"
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/videos/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // تحديث قائمة الفيديوهات
        fetchVideos();
        
        Swal.fire({
          title: "تم الحذف!",
          text: "تم حذف الفيديو بنجاح.",
          icon: "success",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#28a745"
        });
      }
    } catch (err) {
      console.error("Error deleting video:", err);
      Swal.fire({
        title: "خطأ!",
        text: "حدث خطأ أثناء حذف الفيديو.",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#dc3545"
      });
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVideo({
      ...newVideo,
      [name]: value,
    });
  };

  return (
    <div className="videos-page">
      {/* Header Section */}
      <section
        className="hero-section position-relative overflow-hidden min-vh-100 d-flex align-items-center"
      >
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
        <div
          className="position-absolute w-100 h-100"
          style={{ background: "rgba(0, 0, 0, 0.6)", zIndex: 1 }}
        ></div>
        <div
          className="container text-center position-relative"
          style={{ zIndex: 2 }}
        >
          <div className={`${isVisible ? "animate-fade-in-up" : ""}`}>
            <h1
              className="display-3 fw-bold text-white mb-4"
              style={{ textShadow: "3px 3px 6px rgba(0,0,0,0.7)" }}
            >
              مكتبة الفيديوهات
            </h1>
            <p
              className="lead mb-5 text-white"
              style={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                maxWidth: "700px",
                margin: "0 auto",
                fontSize: "1.3rem",
              }}
            >
              شاهد أعمالنا وتصميماتنا تنبض بالحياة من خلال مجموعتنا المختارة من
              الفيديوهات.
            </p>
          </div>
        </div>
      </section>

      {/* Video Categories Section */}
      <section
        className="py-5"
        style={{
          backgroundColor: "#f8f9fa",
          position: "relative",
          overflow: "hidden",
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
                <rect width="2" height="2" x="10" y="10" fill="black" />
                <rect width="2" height="2" x="30" y="30" fill="black" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#filter-pattern)" />
          </svg>
        </div>

        <div className="container position-relative">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-dark mb-4" style={{ color: "#2c3e50" }}>
              فئات الفيديوهات
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

                {/* Add Video Button - Only visible to engineers */}
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
                    إضافة فيديو جديد
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ color: "#2c3e50" }}>
              أحدث الفيديوهات
            </h2>
            <p className="lead text-muted">
              استكشف جولات افتراضية ومقابلات ولقطات من وراء الكواليس لمشاريعنا.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {loading && <p className="text-center">جاري تحميل الفيديوهات...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && !error && videos.length === 0 && (
              <p className="text-center">لا توجد فيديوهات لعرضها حالياً.</p>
            )}
            {videos
              .filter(video => activeCategory === "all" || video.category === activeCategory)
              .map((video, index) => (
              <div key={video._id} className="col-lg-6 col-md-8 mb-4">
                <div
                  className={`card h-100 border-0 shadow hover-lift ${
                    isVisible ? `animate-fade-in-up stagger-${index + 1}` : ""
                  }`}
                  style={{ borderRadius: "15px", overflow: "hidden" }}
                >
                  <div className="ratio ratio-16x9">
                    <VideoPlayer 
                      embedUrl={video.embedUrl} 
                      videoUrl={video.videoUrl} 
                    />
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title fw-bold">{video.title}</h5>
                      {isEngineer() && (
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-warning" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingVideo(video);
                              setShowEditModal(true);
                            }}
                            title="تعديل الفيديو"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteVideo(video._id);
                            }}
                            title="حذف الفيديو"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="card-text text-muted">{video.description}</p>
                    <span className="badge bg-secondary">{categories.find(c => c.id === video.category)?.name || video.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add Video Modal */}
      {showAddModal && (
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">إضافة فيديو جديد</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAddModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddVideo}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    عنوان الفيديو *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={newVideo.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    وصف الفيديو *
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={newVideo.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>


                
                <div className="mb-3">
                  <label htmlFor="videoFile" className="form-label">
                    قم برفع فيديو *
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="videoFile"
                    accept="video/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <small className="form-text text-muted">
                    الحد الأقصى لحجم الملف: 100 ميجابايت. الصيغ المدعومة: MP4, MOV, AVI, etc.
                  </small>
                  
                  {(uploadingVideo || uploadProgress > 0) && (
                    <div className="mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small fw-bold">جاري الرفع...</span>
                        <span className="small">{uploadProgress}%</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                          role="progressbar" 
                          style={{ width: `${uploadProgress}%` }}
                          aria-valuenow={uploadProgress} 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        />
                      </div>
                      <small className="text-muted d-block mt-1">
                        يرجى الانتظار حتى يكتمل التحميل قبل المتابعة
                      </small>
                    </div>
                  )}
                  
                  {newVideo.videoUrl && (
                    <div className="mt-3">
                      <div className="alert alert-success d-flex align-items-center mb-3">
                        <i className="fas fa-check-circle me-2 fs-4"></i>
                        <div>
                          <h6 className="mb-0">تم رفع الفيديو بنجاح!</h6>
                          <small className="d-block mt-1">يمكنك الآن إضافة تفاصيل الفيديو وحفظه</small>
                        </div>
                      </div>
                      <div className="mt-2 border rounded p-2">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">معاينة الفيديو:</h6>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setNewVideo({
                                ...newVideo,
                                videoUrl: ""
                              });
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                          >
                            <i className="fas fa-times me-1"></i>
                            إزالة
                          </button>
                        </div>
                        <div className="ratio ratio-16x9">
                          <VideoPlayer videoUrl={newVideo.videoUrl} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    الفئة *
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={newVideo.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="residential">سكني</option>
                    <option value="commercial">تجاري</option>
                    <option value="renovation">تجديد</option>
                    <option value="interior">تصميم داخلي</option>
                  </select>
                </div>



                <div className="modal-footer d-flex justify-content-between">
                  <div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAddModal(false)}
                      disabled={uploadingVideo}
                    >
                      <i className="fas fa-times me-1"></i>
                      إلغاء
                    </button>
                  </div>
                  <div>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={!newVideo.videoUrl || uploadingVideo}
                    >
                      {uploadingVideo ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          جاري الرفع...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus-circle me-1"></i>
                          إضافة الفيديو
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Edit Video Modal */}
    {showEditModal && editingVideo && (
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">تعديل الفيديو</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingVideo(null);
                }}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateVideo}>
                <div className="mb-3">
                  <label htmlFor="edit-title" className="form-label">
                    عنوان الفيديو *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edit-title"
                    name="title"
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="edit-description" className="form-label">
                    وصف الفيديو *
                  </label>
                  <textarea
                    className="form-control"
                    id="edit-description"
                    name="description"
                    rows="3"
                    value={editingVideo.description}
                    onChange={(e) => setEditingVideo({...editingVideo, description: e.target.value})}
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="edit-videoFile" className="form-label">
                    الفيديو الحالي
                  </label>
                  <div className="mt-2 border rounded p-2">
                    <div className="ratio ratio-16x9">
                      <VideoPlayer 
                        embedUrl={editingVideo.embedUrl} 
                        videoUrl={editingVideo.videoUrl} 
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="edit-category" className="form-label">
                    الفئة *
                  </label>
                  <select
                    className="form-select"
                    id="edit-category"
                    name="category"
                    value={editingVideo.category}
                    onChange={(e) => setEditingVideo({...editingVideo, category: e.target.value})}
                    required
                  >
                    <option value="residential">سكني</option>
                    <option value="commercial">تجاري</option>
                    <option value="interior">تصميم داخلي</option>
                    <option value="renovation">تجديد</option>
                  </select>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingVideo(null);
                    }}
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

export default Videos;