import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError, showConfirm } from "../utils/sweetAlert";

function Admin() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  
  // Set up axios defaults with the token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // If no token, redirect to login
      navigate('/login');
    }
    
    return () => {
      // Clean up axios defaults when component unmounts
      delete axios.defaults.headers.common['Authorization'];
    };
  }, [token, navigate]);
  const [activeTab, setActiveTab] = useState("videos");
  
  // Services state
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    icon: "",
    color: "#3498db",
    isActive: true,
    order: 0
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editService, setEditService] = useState({});
  
  // FAQs state
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: ""
  });
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [editFaq, setEditFaq] = useState({});
  
  // Users state
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUser, setEditUser] = useState({});
  
  // Engineers state
  const [engineers, setEngineers] = useState([]);
  const [newEngineer, setNewEngineer] = useState({
    name: "",
    email: "",
    password: "",
    role: "engineer",
    specialization: "",
    experience: "",
    bio: ""
  });
  const [editingEngineerId, setEditingEngineerId] = useState(null);
  const [editEngineer, setEditEngineer] = useState({});
  const [loading, setLoading] = useState(true);

  // Videos state
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    embedUrl: "",
    category: "residential",
    thumbnail: "",
  });
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editVideo, setEditVideo] = useState({});

  // Projects state
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "residential",
    location: "",
    area: "",
    year: "",
    client: "",
    isFeatured: false,
  });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editProject, setEditProject] = useState({});
  const [selectedProjectFile, setSelectedProjectFile] = useState(null);
  const [projectImagePreview, setProjectImagePreview] = useState(null);

  useEffect(() => {
    if (activeTab === "videos") {
      fetchVideos();
    } else if (activeTab === "projects") {
      fetchProjects();
    } else if (activeTab === "services") {
      fetchServices();
    } else if (activeTab === "faqs") {
      fetchFaqs();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "engineers") {
      fetchEngineers();
    }
  }, [activeTab]);

  // Videos functions
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/videos/all");
      setVideos(response.data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token expired or invalid, log out user
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Engineers functions
  const fetchEngineers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/engineers");
      setEngineers(response.data || []);
    } catch (error) {
      console.error("Error fetching engineers:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token expired or invalid, log out user
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const addEngineer = async (e) => {
    e.preventDefault();
    if (!newEngineer.name.trim() || !newEngineer.email.trim() || !newEngineer.password.trim()) {
      alert("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/users/register", newEngineer, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("تم إضافة المهندس بنجاح!");
      setNewEngineer({
        name: "",
        email: "",
        password: "",
        role: "engineer",
        specialization: "",
        experience: "",
        bio: ""
      });
      fetchEngineers();
    } catch (error) {
      console.error("Error adding engineer:", error);
      alert("حدث خطأ في إضافة المهندس: " + (error.response?.data?.message || error.message));
    }
  };

  const updateEngineer = async (id) => {
    try {
      const token = localStorage.getItem("token");
      // Remove password if it's empty (not being updated)
      const engineerData = {...editEngineer};
      if (!engineerData.password) {
        delete engineerData.password;
      }
      
      await axios.put(`/api/users/${id}`, engineerData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("تم تحديث بيانات المهندس بنجاح!");
      setEditingEngineerId(null);
      fetchEngineers();
    } catch (error) {
      console.error("Error updating engineer:", error);
      alert("حدث خطأ في تحديث بيانات المهندس: " + (error.response?.data?.message || error.message));
    }
  };

  const deleteEngineer = async (id) => {
    const result = await showConfirm(
      'هل أنت متأكد من حذف هذا المهندس؟',
      'نعم، احذفه',
      'إلغاء',
      'هل أنت متأكد؟',
      'warning'
    );

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      await showSuccess('تم حذف المهندس بنجاح');
      fetchEngineers();
    } catch (error) {
      console.error("Error deleting engineer:", error);
      await showError('حدث خطأ في حذف المهندس: ' + (error.response?.data?.message || error.message));
    }
  };
  
  // Users functions
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users");
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token expired or invalid, log out user
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      alert("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/users/register", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("تم إضافة المستخدم بنجاح!");
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "user"
      });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("حدث خطأ في إضافة المستخدم: " + (error.response?.data?.message || error.message));
    }
  };

  const updateUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      // Remove password if it's empty (not being updated)
      const userData = {...editUser};
      if (!userData.password) {
        delete userData.password;
      }
      
      await axios.put(`/api/users/${id}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("تم تحديث المستخدم بنجاح!");
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("حدث خطأ في تحديث المستخدم: " + (error.response?.data?.message || error.message));
    }
  };

  const deleteUser = async (id) => {
    const result = await MySwal.fire({
      title: 'هل أنت متأكد؟',
      text: 'هل أنت متأكد من حذف هذا المستخدم؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذفه',
      cancelButtonText: 'إلغاء'
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await MySwal.fire(
        'تم الحذف!',
        'تم حذف المستخدم بنجاح!',
        'success'
      );
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      await MySwal.fire(
        'خطأ!',
        'حدث خطأ في حذف المستخدم: ' + (error.response?.data?.message || error.message),
        'error'
      );
    }
  };
  
  // FAQs functions
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/faq");
      setFaqs(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setLoading(false);
    }
  };

  const addFaq = async (e) => {
    e.preventDefault();
    
    if (!newFaq.question?.trim() || !newFaq.answer?.trim()) {
      await MySwal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة',
        confirmButtonText: 'حسناً'
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/faq", newFaq, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      // Reset form
      setNewFaq({
        question: "",
        answer: ""
      });
      
      // Show success message
      await showSuccess('تم إضافة السؤال بنجاح');
      
      // Refresh FAQ list
      await fetchFaqs();
      
    } catch (error) {
      console.error("Error adding FAQ:", error);
      
      let errorMessage = 'حدث خطأ في إضافة السؤال';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      await showError(errorMessage);
    }
  };

  const updateFaq = async (id) => {
    if (!editFaq.question?.trim() || !editFaq.answer?.trim()) {
      await showError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`/api/faq/${id}`, editFaq, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      // Reset editing state
      setEditingFaqId(null);
      
      // Show success message
      await showSuccess('تم تحديث السؤال بنجاح');
      
      // Refresh FAQ list
      await fetchFaqs();
      
    } catch (error) {
      console.error("Error updating FAQ:", error);
      
      let errorMessage = 'حدث خطأ في تحديث السؤال';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      await showError(errorMessage);
    }
  };

  const deleteFaq = async (id) => {
    const result = await showConfirm(
      'هل أنت متأكد من حذف هذا السؤال؟',
      'نعم، احذفه',
      'إلغاء',
      'هل أنت متأكد؟',
      'warning'
    );

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/faq/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      await showSuccess('تم حذف السؤال بنجاح');
      fetchFaqs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      await showError('حدث خطأ في حذف السؤال: ' + (error.response?.data?.message || ''));
    }
  };
  
  // Services functions
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/services/all");
      setServices(response.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token expired or invalid, log out user
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const addService = async (e) => {
    e.preventDefault();
    if (!newService.title.trim() || !newService.description.trim() || !newService.icon.trim()) {
      alert("يرجى ملء العنوان والوصف والأيقونة.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/services", newService, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("تم إضافة الخدمة بنجاح!");
      setNewService({
        title: "",
        description: "",
        icon: "",
        color: "#3498db",
        isActive: true,
        order: 0
      });
      fetchServices();
    } catch (error) {
      console.error("Error adding service:", error);
      alert("حدث خطأ في إضافة الخدمة");
    }
  };

  const updateService = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/services/${id}`, editService, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("تم تحديث الخدمة بنجاح!");
      setEditingServiceId(null);
      fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
      alert("حدث خطأ في تحديث الخدمة");
    }
  };

  const deleteService = async (id) => {
    const result = await showConfirm(
      'هل أنت متأكد من حذف هذه الخدمة؟',
      'نعم، احذفها',
      'إلغاء',
      'هل أنت متأكد؟',
      'warning'
    );

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      await showSuccess('تم حذف الخدمة بنجاح');
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      await showError('حدث خطأ في حذف الخدمة: ' + (error.response?.data?.message || ''));
    }
  };

  // Projects functions
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/projects/all");
      setProjects(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  const handleProjectFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProjectFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProjectImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addVideo = async (e) => {
    e.preventDefault();
    if (
      !newVideo.title.trim() ||
      !newVideo.description.trim()
    )
      return;
    
    alert("يرجى استخدام صفحة الفيديوهات لتحميل الفيديوهات");
    return;

    try {
      await axios.post("/api/videos", newVideo);
      alert("تم إضافة الفيديو بنجاح!");
      setNewVideo({
        title: "",
        description: "",
        embedUrl: "",
        category: "residential",
        thumbnail: "",
      });
      fetchVideos();
    } catch (error) {
      console.error("Error adding video:", error);
      alert("حدث خطأ في إضافة الفيديو");
    }
  };

  const updateVideo = async (id) => {
    try {
      await axios.put(`/api/videos/${id}`, editVideo);
      alert("تم تحديث الفيديو بنجاح!");
      setEditingVideoId(null);
      fetchVideos();
    } catch (error) {
      console.error("Error updating video:", error);
      alert("حدث خطأ في تحديث الفيديو");
    }
  };

  const deleteVideo = async (id) => {
    const result = await MySwal.fire({
      title: 'هل أنت متأكد؟',
      text: 'هل أنت متأكد من حذف هذا الفيديو؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذفه',
      cancelButtonText: 'إلغاء'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/videos/${id}`);
      await MySwal.fire(
        'تم الحذف!',
        'تم حذف الفيديو بنجاح.',
        'success'
      );
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      await MySwal.fire(
        'خطأ!',
        'حدث خطأ في حذف الفيديو',
        'error'
      );
    }
  };

  const addProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.description.trim()) {
      alert("يرجى ملء العنوان والوصف.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let finalImageUrl = newProject.imageUrl;

      if (selectedProjectFile) {
        const formData = new FormData();
        formData.append("image", selectedProjectFile);
        const uploadResponse = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        finalImageUrl = uploadResponse.data.imageUrl;
      }

      if (!finalImageUrl) {
        alert("يجب توفير رابط صورة أو رفع ملف صورة.");
        return;
      }

      const projectData = { ...newProject, imageUrl: finalImageUrl };

      await axios.post("/api/projects", projectData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("تم إضافة المشروع بنجاح!");
      setNewProject({
        title: "",
        description: "",
        imageUrl: "",
        category: "residential",
        location: "",
        area: "",
        year: "",
        client: "",
        isFeatured: false,
      });
      setSelectedProjectFile(null);
      setProjectImagePreview(null);
      fetchProjects();
    } catch (error) {
      console.error("Error adding project:", error);
      alert("حدث خطأ في إضافة المشروع");
    }
  };

  const updateProject = async (id) => {
    try {
      await axios.put(`/api/projects/${id}`, editProject);
      alert("تم تحديث المشروع بنجاح!");
      setEditingProjectId(null);
      fetchProjects();
    } catch (error) {
      console.error("Error updating project:", error);
      alert("حدث خطأ في تحديث المشروع");
    }
  };

  const deleteProject = async (id) => {
    const result = await MySwal.fire({
      title: 'هل أنت متأكد؟',
      text: 'هل أنت متأكد من حذف هذا المشروع؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذفه',
      cancelButtonText: 'إلغاء'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/projects/${id}`);
      await MySwal.fire(
        'تم الحذف!',
        'تم حذف المشروع بنجاح.',
        'success'
      );
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      await MySwal.fire(
        'خطأ!',
        'حدث خطأ في حذف المشروع',
        'error'
      );
    }
  };

  return (
    <div className="container-fluid" style={{ paddingTop: "80px" }}>
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">
                <i className="fas fa-cogs me-2"></i>
                لوحة التحكم - إدارة المحتوى
              </h3>
            </div>
            <div className="card-body">
              {/* Navigation Tabs */}
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "videos" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("videos")}
                  >
                    <i className="fas fa-video me-2"></i>
                    إدارة الفيديوهات
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "projects" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("projects")}
                  >
                    <i className="fas fa-images me-2"></i>
                    إدارة المشاريع
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "services" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("services")}
                  >
                    <i className="fas fa-tools me-2"></i>
                    إدارة الخدمات
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "faqs" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("faqs")}
                  >
                    <i className="fas fa-question-circle me-2"></i>
                    إدارة الأسئلة والأجوبة
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "users" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("users")}
                  >
                    <i className="fas fa-users me-2"></i>
                    إدارة المستخدمين
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "engineers" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("engineers")}
                  >
                    <i className="fas fa-hard-hat me-2"></i>
                    إدارة المهندسين
                  </button>
                </li>
              </ul>

              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">جاري التحميل...</span>
                  </div>
                  <p className="mt-2">جاري تحميل البيانات...</p>
                </div>
              ) : (
                <>
                  {/* Videos Tab */}
                  {activeTab === "videos" && (
                    <div>
                      {/* Add Video Form */}
                      <div className="row mb-4">
                        <div className="col-12">
                          <div className="card border-success">
                            <div className="card-header bg-success text-white">
                              <h5 className="mb-0">
                                <i className="fas fa-plus me-2"></i>
                                إضافة فيديو جديد
                              </h5>
                            </div>
                            <div className="card-body">
                              <form onSubmit={addVideo}>
                                <div className="row">
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      عنوان الفيديو:
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newVideo.title}
                                      onChange={(e) =>
                                        setNewVideo({
                                          ...newVideo,
                                          title: e.target.value,
                                        })
                                      }
                                      placeholder="عنوان الفيديو"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">الفئة:</label>
                                    <select
                                      className="form-control"
                                      value={newVideo.category}
                                      onChange={(e) =>
                                        setNewVideo({
                                          ...newVideo,
                                          category: e.target.value,
                                        })
                                      }
                                    >
                                      <option value="residential">سكني</option>
                                      <option value="commercial">تجاري</option>
                                      <option value="renovation">تجديد</option>
                                      <option value="interior">
                                        تصميم داخلي
                                      </option>
                                    </select>
                                  </div>
                                  <div className="col-12 mb-3">
                                    <label className="form-label">الوصف:</label>
                                    <textarea
                                      className="form-control"
                                      rows="3"
                                      value={newVideo.description}
                                      onChange={(e) =>
                                        setNewVideo({
                                          ...newVideo,
                                          description: e.target.value,
                                        })
                                      }
                                      placeholder="وصف الفيديو"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      تحميل الفيديو:
                                    </label>
                                    <input
                                      type="file"
                                      className="form-control"
                                      accept="video/*"
                                      onChange={(e) => {
                                        // هنا يمكن إضافة منطق تحميل الفيديو
                                        alert("يرجى استخدام صفحة الفيديوهات لتحميل الفيديوهات");
                                      }}
                                    />
                                    <small className="form-text text-muted">
                                      يرجى استخدام صفحة الفيديوهات لتحميل الفيديوهات بشكل صحيح
                                    </small>
                                  </div>

                                </div>
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                >
                                  <i className="fas fa-plus me-2"></i>
                                  إضافة الفيديو
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Videos List */}
                      <div className="row">
                        <div className="col-12">
                          <div className="card">
                            <div className="card-header bg-info text-white">
                              <h5 className="mb-0">
                                <i className="fas fa-list me-2"></i>
                                الفيديوهات الموجودة ({videos.length})
                              </h5>
                            </div>
                            <div className="card-body">
                              {videos.length === 0 ? (
                                <div className="text-center text-muted">
                                  <i className="fas fa-video fa-3x mb-3"></i>
                                  <p>لا توجد فيديوهات حالياً</p>
                                </div>
                              ) : (
                                <div className="table-responsive">
                                  <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                      <tr>
                                        <th>#</th>
                                        <th>العنوان</th>
                                        <th>الفئة</th>
                                        <th>الوصف</th>
                                        <th>الحالة</th>
                                        <th>الإجراءات</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {videos.map((video, index) => (
                                        <tr key={video._id}>
                                          <td>{index + 1}</td>
                                          <td>
                                            {editingVideoId === video._id ? (
                                              <input
                                                type="text"
                                                className="form-control"
                                                value={editVideo.title || ""}
                                                onChange={(e) =>
                                                  setEditVideo({
                                                    ...editVideo,
                                                    title: e.target.value,
                                                  })
                                                }
                                              />
                                            ) : (
                                              video.title
                                            )}
                                          </td>
                                          <td>
                                            {editingVideoId === video._id ? (
                                              <select
                                                className="form-control"
                                                value={editVideo.category || ""}
                                                onChange={(e) =>
                                                  setEditVideo({
                                                    ...editVideo,
                                                    category: e.target.value,
                                                  })
                                                }
                                              >
                                                <option value="residential">
                                                  سكني
                                                </option>
                                                <option value="commercial">
                                                  تجاري
                                                </option>
                                                <option value="renovation">
                                                  تجديد
                                                </option>
                                                <option value="interior">
                                                  تصميم داخلي
                                                </option>
                                              </select>
                                            ) : video.category ===
                                              "residential" ? (
                                              "سكني"
                                            ) : video.category ===
                                              "commercial" ? (
                                              "تجاري"
                                            ) : video.category ===
                                              "renovation" ? (
                                              "تجديد"
                                            ) : (
                                              "تصميم داخلي"
                                            )}
                                          </td>
                                          <td>
                                            {editingVideoId === video._id ? (
                                              <textarea
                                                className="form-control"
                                                value={
                                                  editVideo.description || ""
                                                }
                                                onChange={(e) =>
                                                  setEditVideo({
                                                    ...editVideo,
                                                    description: e.target.value,
                                                  })
                                                }
                                                rows="2"
                                              />
                                            ) : (
                                              <div
                                                className="text-wrap"
                                                style={{ maxWidth: "200px" }}
                                              >
                                                {video.description}
                                              </div>
                                            )}
                                          </td>
                                          <td>
                                            <span
                                              className={`badge ${
                                                video.isActive
                                                  ? "bg-success"
                                                  : "bg-danger"
                                              }`}
                                            >
                                              {video.isActive
                                                ? "نشط"
                                                : "غير نشط"}
                                            </span>
                                          </td>
                                          <td>
                                            <div className="btn-group btn-group-sm">
                                              {editingVideoId === video._id ? (
                                                <>
                                                  <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() =>
                                                      updateVideo(video._id)
                                                    }
                                                  >
                                                    <i className="fas fa-save"></i>
                                                  </button>
                                                  <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() =>
                                                      setEditingVideoId(null)
                                                    }
                                                  >
                                                    <i className="fas fa-times"></i>
                                                  </button>
                                                </>
                                              ) : (
                                                <>
                                                  <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => {
                                                      setEditingVideoId(
                                                        video._id
                                                      );
                                                      setEditVideo(video);
                                                    }}
                                                  >
                                                    <i className="fas fa-edit"></i>
                                                  </button>
                                                  <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                      deleteVideo(video._id)
                                                    }
                                                  >
                                                    <i className="fas fa-trash"></i>
                                                  </button>
                                                </>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Projects Tab */}
                  {activeTab === "projects" && (
                    <div>
                      {/* Add Project Form */}
                      <div className="row mb-4">
                        <div className="col-12">
                          <div className="card border-success">
                            <div className="card-header bg-success text-white">
                              <h5 className="mb-0">
                                <i className="fas fa-plus me-2"></i>
                                إضافة مشروع جديد
                              </h5>
                            </div>
                            <div className="card-body">
                              <form onSubmit={addProject}>
                                <div className="row">
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      عنوان المشروع:
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newProject.title}
                                      onChange={(e) =>
                                        setNewProject({
                                          ...newProject,
                                          title: e.target.value,
                                        })
                                      }
                                      placeholder="عنوان المشروع"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">الفئة:</label>
                                    <select
                                      className="form-control"
                                      value={newProject.category}
                                      onChange={(e) =>
                                        setNewProject({
                                          ...newProject,
                                          category: e.target.value,
                                        })
                                      }
                                    >
                                      <option value="residential">سكني</option>
                                      <option value="commercial">تجاري</option>
                                      <option value="interior">
                                        تصميم داخلي
                                      </option>
                                      <option value="renovation">تجديد</option>
                                    </select>
                                  </div>
                                  <div className="col-12 mb-3">
                                    <label className="form-label">الوصف:</label>
                                    <textarea
                                      className="form-control"
                                      rows="3"
                                      value={newProject.description}
                                      onChange={(e) =>
                                        setNewProject({
                                          ...newProject,
                                          description: e.target.value,
                                        })
                                      }
                                      placeholder="وصف المشروع"
                                      required
                                    />
                                  </div>
                                  <div className="col-12 mb-3">
                                    <label className="form-label">
                                      رابط الصورة:
                                    </label>
                                    <div className="row">
                                      <div className="col-md-6">
                                        <input
                                          type="file"
                                          className="form-control"
                                          accept="image/*"
                                          onChange={handleProjectFileChange}
                                        />
                                        <small className="text-muted">أو</small>
                                        <input
                                          type="url"
                                          className="form-control mt-2"
                                          value={newProject.imageUrl}
                                          onChange={(e) =>
                                            setNewProject({
                                              ...newProject,
                                              imageUrl: e.target.value,
                                            })
                                          }
                                          placeholder="رابط صورة المشروع"
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        {projectImagePreview && (
                                          <img
                                            src={projectImagePreview}
                                            alt="معاينة"
                                            style={{
                                              maxWidth: "100%",
                                              maxHeight: "100px",
                                              objectFit: "cover",
                                              borderRadius: "8px",
                                            }}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      الموقع:
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newProject.location}
                                      onChange={(e) =>
                                        setNewProject({
                                          ...newProject,
                                          location: e.target.value,
                                        })
                                      }
                                      placeholder="موقع المشروع"
                                    />
                                  </div>
                                  <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                      المساحة:
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newProject.area}
                                      onChange={(e) =>
                                        setNewProject({
                                          ...newProject,
                                          area: e.target.value,
                                        })
                                      }
                                      placeholder="مساحة المشروع"
                                    />
                                  </div>
                                  <div className="col-md-4 mb-3">
                                    <label className="form-label">السنة:</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={newProject.year}
                                      onChange={(e) =>
                                        setNewProject({
                                          ...newProject,
                                          year: e.target.value,
                                        })
                                      }
                                      placeholder="سنة التنفيذ"
                                    />
                                  </div>
                                  <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                      العميل:
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newProject.client}
                                      onChange={(e) =>
                                        setNewProject({
                                          ...newProject,
                                          client: e.target.value,
                                        })
                                      }
                                      placeholder="اسم العميل"
                                    />
                                  </div>
                                  <div className="col-12 mb-3">
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="isFeatured"
                                        checked={newProject.isFeatured}
                                        onChange={(e) =>
                                          setNewProject({
                                            ...newProject,
                                            isFeatured: e.target.checked,
                                          })
                                        }
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="isFeatured"
                                      >
                                        مشروع مميز
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                >
                                  <i className="fas fa-plus me-2"></i>
                                  إضافة المشروع
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Projects List */}
                      <div className="row">
                        <div className="col-12">
                          <div className="card">
                            <div className="card-header bg-info text-white">
                              <h5 className="mb-0">
                                <i className="fas fa-list me-2"></i>
                                المشاريع الموجودة ({projects.length})
                              </h5>
                            </div>
                            <div className="card-body">
                              {projects.length === 0 ? (
                                <div className="text-center text-muted">
                                  <i className="fas fa-images fa-3x mb-3"></i>
                                  <p>لا توجد مشاريع حالياً</p>
                                </div>
                              ) : (
                                <div className="table-responsive">
                                  <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                      <tr>
                                        <th>#</th>
                                        <th>العنوان</th>
                                        <th>الفئة</th>
                                        <th>الموقع</th>
                                        <th>المساحة</th>
                                        <th>السنة</th>
                                        <th>مميز</th>
                                        <th>الحالة</th>
                                        <th>الإجراءات</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {projects.map((project, index) => (
                                        <tr key={project._id}>
                                          <td>{index + 1}</td>
                                          <td>
                                            {editingProjectId ===
                                            project._id ? (
                                              <input
                                                type="text"
                                                className="form-control"
                                                value={editProject.title || ""}
                                                onChange={(e) =>
                                                  setEditProject({
                                                    ...editProject,
                                                    title: e.target.value,
                                                  })
                                                }
                                              />
                                            ) : (
                                              project.title
                                            )}
                                          </td>
                                          <td>
                                            {editingProjectId ===
                                            project._id ? (
                                              <select
                                                className="form-control"
                                                value={
                                                  editProject.category || ""
                                                }
                                                onChange={(e) =>
                                                  setEditProject({
                                                    ...editProject,
                                                    category: e.target.value,
                                                  })
                                                }
                                              >
                                                <option value="residential">
                                                  سكني
                                                </option>
                                                <option value="commercial">
                                                  تجاري
                                                </option>
                                                <option value="interior">
                                                  تصميم داخلي
                                                </option>
                                                <option value="renovation">
                                                  تجديد
                                                </option>
                                              </select>
                                            ) : project.category ===
                                              "residential" ? (
                                              "سكني"
                                            ) : project.category ===
                                              "commercial" ? (
                                              "تجاري"
                                            ) : project.category ===
                                              "interior" ? (
                                              "تصميم داخلي"
                                            ) : (
                                              "تجديد"
                                            )}
                                          </td>
                                          <td>
                                            {editingProjectId ===
                                            project._id ? (
                                              <input
                                                type="text"
                                                className="form-control"
                                                value={
                                                  editProject.location || ""
                                                }
                                                onChange={(e) =>
                                                  setEditProject({
                                                    ...editProject,
                                                    location: e.target.value,
                                                  })
                                                }
                                              />
                                            ) : (
                                              project.location || "-"
                                            )}
                                          </td>
                                          <td>
                                            {editingProjectId ===
                                            project._id ? (
                                              <input
                                                type="text"
                                                className="form-control"
                                                value={editProject.area || ""}
                                                onChange={(e) =>
                                                  setEditProject({
                                                    ...editProject,
                                                    area: e.target.value,
                                                  })
                                                }
                                              />
                                            ) : (
                                              project.area || "-"
                                            )}
                                          </td>
                                          <td>
                                            {editingProjectId ===
                                            project._id ? (
                                              <input
                                                type="number"
                                                className="form-control"
                                                value={editProject.year || ""}
                                                onChange={(e) =>
                                                  setEditProject({
                                                    ...editProject,
                                                    year: e.target.value,
                                                  })
                                                }
                                              />
                                            ) : (
                                              project.year || "-"
                                            )}
                                          </td>
                                          <td>
                                            <span
                                              className={`badge ${
                                                project.isFeatured
                                                  ? "bg-warning"
                                                  : "bg-secondary"
                                              }`}
                                            >
                                              {project.isFeatured
                                                ? "مميز"
                                                : "عادي"}
                                            </span>
                                          </td>
                                          <td>
                                            <span
                                              className={`badge ${
                                                project.isActive
                                                  ? "bg-success"
                                                  : "bg-danger"
                                              }`}
                                            >
                                              {project.isActive
                                                ? "نشط"
                                                : "غير نشط"}
                                            </span>
                                          </td>
                                          <td>
                                            <div className="btn-group btn-group-sm">
                                              {editingProjectId ===
                                              project._id ? (
                                                <>
                                                  <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() =>
                                                      updateProject(project._id)
                                                    }
                                                  >
                                                    <i className="fas fa-save"></i>
                                                  </button>
                                                  <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() =>
                                                      setEditingProjectId(null)
                                                    }
                                                  >
                                                    <i className="fas fa-times"></i>
                                                  </button>
                                                </>
                                              ) : (
                                                <>
                                                  <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => {
                                                      setEditingProjectId(
                                                        project._id
                                                      );
                                                      setEditProject(project);
                                                    }}
                                                  >
                                                    <i className="fas fa-edit"></i>
                                                  </button>
                                                  <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                      deleteProject(project._id)
                                                    }
                                                  >
                                                    <i className="fas fa-trash"></i>
                                                  </button>
                                                </>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Services Tab */}
                  {activeTab === "services" && (
                    <div>
                      {/* Add Service Form */}
                      <div className="row mb-4">
                        <div className="col-12">
                          <div className="card border-success">
                            <div className="card-header bg-success text-white">
                              <h5 className="mb-0">
                                <i className="fas fa-plus me-2"></i>
                                إضافة خدمة جديدة
                              </h5>
                            </div>
                            <div className="card-body">
                              <form onSubmit={addService}>
                                <div className="row">
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      عنوان الخدمة:
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newService.title}
                                      onChange={(e) =>
                                        setNewService({
                                          ...newService,
                                          title: e.target.value,
                                        })
                                      }
                                      placeholder="عنوان الخدمة"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      الأيقونة (رمز تعبيري أو كود Font Awesome):
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newService.icon}
                                      onChange={(e) =>
                                        setNewService({
                                          ...newService,
                                          icon: e.target.value,
                                        })
                                      }
                                      placeholder="مثال: 🏛️ أو fa-home"
                                      required
                                    />
                                  </div>
                                  <div className="col-12 mb-3">
                                    <label className="form-label">الوصف:</label>
                                    <textarea
                                      className="form-control"
                                      rows="3"
                                      value={newService.description}
                                      onChange={(e) =>
                                        setNewService({
                                          ...newService,
                                          description: e.target.value,
                                        })
                                      }
                                      placeholder="وصف الخدمة"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      اللون:
                                    </label>
                                    <div className="d-flex">
                                      <input
                                        type="color"
                                        className="form-control form-control-color me-2"
                                        value={newService.color}
                                        onChange={(e) =>
                                          setNewService({
                                            ...newService,
                                            color: e.target.value,
                                          })
                                        }
                                        title="اختر لون الخدمة"
                                      />
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={newService.color}
                                        onChange={(e) =>
                                          setNewService({
                                            ...newService,
                                            color: e.target.value,
                                          })
                                        }
                                        placeholder="كود اللون"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3 mb-3">
                                    <label className="form-label">
                                      الترتيب:
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={newService.order}
                                      onChange={(e) =>
                                        setNewService({
                                          ...newService,
                                          order: parseInt(e.target.value) || 0,
                                        })
                                      }
                                      placeholder="ترتيب الظهور"
                                    />
                                  </div>
                                  <div className="col-md-3 mb-3">
                                    <label className="form-label d-block">
                                      الحالة:
                                    </label>
                                    <div className="form-check form-switch mt-2">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="isServiceActive"
                                        checked={newService.isActive}
                                        onChange={(e) =>
                                          setNewService({
                                            ...newService,
                                            isActive: e.target.checked,
                                          })
                                        }
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="isServiceActive"
                                      >
                                        {newService.isActive ? "نشط" : "غير نشط"}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                >
                                  <i className="fas fa-plus me-2"></i>
                                  إضافة الخدمة
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Services List */}
                      <div className="row">
                        <div className="col-12">
                          <div className="card">
                            <div className="card-header bg-info text-white">
                              <h5 className="mb-0">
                                <i className="fas fa-list me-2"></i>
                                الخدمات الموجودة ({services.length})
                              </h5>
                            </div>
                            <div className="card-body">
                              {services.length === 0 ? (
                                <div className="text-center text-muted">
                                  <i className="fas fa-tools fa-3x mb-3"></i>
                                  <p>لا توجد خدمات حالياً</p>
                                </div>
                              ) : (
                                <div className="table-responsive">
                                  <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                      <tr>
                                        <th>#</th>
                                        <th>العنوان</th>
                                        <th>الأيقونة</th>
                                        <th>الوصف</th>
                                        <th>اللون</th>
                                        <th>الترتيب</th>
                                        <th>الحالة</th>
                                        <th>الإجراءات</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {services.map((service, index) => (
                                        <tr key={service._id}>
                                          <td>{index + 1}</td>
                                          <td>
                                            {editingServiceId === service._id ? (
                                              <input
                                                type="text"
                                                className="form-control"
                                                value={editService.title || ""}
                                                onChange={(e) =>
                                                  setEditService({
                                                    ...editService,
                                                    title: e.target.value,
                                                  })
                                                }
                                              />
                                            ) : (
                                              service.title
                                            )}
                                          </td>
                                          <td>
                                            {editingServiceId === service._id ? (
                                              <input
                                                type="text"
                                                className="form-control"
                                                value={editService.icon || ""}
                                                onChange={(e) =>
                                                  setEditService({
                                                    ...editService,
                                                    icon: e.target.value,
                                                  })
                                                }
                                              />
                                            ) : (
                                              <span style={{ fontSize: "1.5rem" }}>
                                                {service.icon}
                                              </span>
                                            )}
                                          </td>
                                          <td>
                                            {editingServiceId === service._id ? (
                                              <textarea
                                                className="form-control"
                                                value={editService.description || ""}
                                                onChange={(e) =>
                                                  setEditService({
                                                    ...editService,
                                                    description: e.target.value,
                                                  })
                                                }
                                                rows="2"
                                              />
                                            ) : (
                                              <div
                                                className="text-wrap"
                                                style={{ maxWidth: "200px" }}
                                              >
                                                {service.description}
                                              </div>
                                            )}
                                          </td>
                                          <td>
                                            {editingServiceId === service._id ? (
                                              <div className="d-flex">
                                                <input
                                                  type="color"
                                                  className="form-control form-control-color me-2"
                                                  value={editService.color || "#3498db"}
                                                  onChange={(e) =>
                                                    setEditService({
                                                      ...editService,
                                                      color: e.target.value,
                                                    })
                                                  }
                                                />
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  value={editService.color || ""}
                                                  onChange={(e) =>
                                                    setEditService({
                                                      ...editService,
                                                      color: e.target.value,
                                                    })
                                                  }
                                                />
                                              </div>
                                            ) : (
                                              <div className="d-flex align-items-center">
                                                <div
                                                  style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    backgroundColor: service.color,
                                                    borderRadius: "4px",
                                                    marginRight: "8px",
                                                    border: "1px solid #ddd",
                                                  }}
                                                ></div>
                                                <small>{service.color}</small>
                                              </div>
                                            )}
                                          </td>
                                          <td>
                                            {editingServiceId === service._id ? (
                                              <input
                                                type="number"
                                                className="form-control"
                                                value={editService.order || 0}
                                                onChange={(e) =>
                                                  setEditService({
                                                    ...editService,
                                                    order: parseInt(e.target.value) || 0,
                                                  })
                                                }
                                              />
                                            ) : (
                                              service.order
                                            )}
                                          </td>
                                          <td>
                                            {editingServiceId === service._id ? (
                                              <div className="form-check form-switch">
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  checked={editService.isActive}
                                                  onChange={(e) =>
                                                    setEditService({
                                                      ...editService,
                                                      isActive: e.target.checked,
                                                    })
                                                  }
                                                />
                                              </div>
                                            ) : (
                                              <span
                                                className={`badge ${service.isActive ? "bg-success" : "bg-danger"}`}
                                              >
                                                {service.isActive ? "نشط" : "غير نشط"}
                                              </span>
                                            )}
                                          </td>
                                          <td>
                                            <div className="btn-group btn-group-sm">
                                              {editingServiceId === service._id ? (
                                                <>
                                                  <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => updateService(service._id)}
                                                  >
                                                    <i className="fas fa-save"></i>
                                                  </button>
                                                  <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => setEditingServiceId(null)}
                                                  >
                                                    <i className="fas fa-times"></i>
                                                  </button>
                                                </>
                                              ) : (
                                                <>
                                                  <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => {
                                                      setEditingServiceId(service._id);
                                                      setEditService(service);
                                                    }}
                                                  >
                                                    <i className="fas fa-edit"></i>
                                                  </button>
                                                  <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => deleteService(service._id)}
                                                  >
                                                    <i className="fas fa-trash"></i>
                                                  </button>
                                                </>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FAQs Tab */}
                  {activeTab === "faqs" && (
                    <div>
                      {/* Add FAQ Form */}
                      <div className="row mb-4">
                        <div className="col-12">
                          <div className="card border-success">
                            <div className="card-header bg-success text-white">
                              <h5 className="mb-0">
                                <i className="fas fa-plus me-2"></i>
                                إضافة سؤال وجواب جديد
                              </h5>
                            </div>
                            <div className="card-body">
                              <form onSubmit={addFaq}>
                                <div className="row">
                                  <div className="col-12 mb-3">
                                    <label className="form-label">
                                      السؤال:
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newFaq.question}
                                      onChange={(e) =>
                                        setNewFaq({
                                          ...newFaq,
                                          question: e.target.value,
                                        })
                                      }
                                      placeholder="أدخل السؤال هنا"
                                      required
                                    />
                                  </div>
                                  <div className="col-12 mb-3">
                                    <label className="form-label">
                                      الإجابة:
                                    </label>
                                    <textarea
                                      className="form-control"
                                      rows="4"
                                      value={newFaq.answer}
                                      onChange={(e) =>
                                        setNewFaq({
                                          ...newFaq,
                                          answer: e.target.value,
                                        })
                                      }
                                      placeholder="أدخل الإجابة هنا"
                                      required
                                    />
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                >
                                  <i className="fas fa-plus me-2"></i>
                                  إضافة السؤال والإجابة
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* FAQs List */}
                      <div className="row">
                        <div className="col-12">
                          <div className="card">
                            <div className="card-header bg-info text-white">
                              <h5 className="mb-0">
                                <i className="fas fa-list me-2"></i>
                                الأسئلة والأجوبة الموجودة ({faqs.length})
                              </h5>
                            </div>
                            <div className="card-body">
                              {faqs.length === 0 ? (
                                <div className="text-center text-muted">
                                  <i className="fas fa-question-circle fa-3x mb-3"></i>
                                  <p>لا توجد أسئلة وأجوبة حالياً</p>
                                </div>
                              ) : (
                                <div className="table-responsive">
                                  <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                      <tr>
                                        <th>#</th>
                                        <th>السؤال</th>
                                        <th>الإجابة</th>
                                        <th>الإجراءات</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {faqs.map((faq, index) => (
                                        <tr key={faq._id}>
                                          <td>{index + 1}</td>
                                          <td>
                                            {editingFaqId === faq._id ? (
                                              <input
                                                type="text"
                                                className="form-control"
                                                value={editFaq.question || ""}
                                                onChange={(e) =>
                                                  setEditFaq({
                                                    ...editFaq,
                                                    question: e.target.value,
                                                  })
                                                }
                                              />
                                            ) : (
                                              <div
                                                className="text-wrap"
                                                style={{ maxWidth: "300px" }}
                                              >
                                                {faq.question}
                                              </div>
                                            )}
                                          </td>
                                          <td>
                                            {editingFaqId === faq._id ? (
                                              <textarea
                                                className="form-control"
                                                value={editFaq.answer || ""}
                                                onChange={(e) =>
                                                  setEditFaq({
                                                    ...editFaq,
                                                    answer: e.target.value,
                                                  })
                                                }
                                                rows="3"
                                              />
                                            ) : (
                                              <div
                                                className="text-wrap"
                                                style={{ maxWidth: "400px" }}
                                              >
                                                {faq.answer}
                                              </div>
                                            )}
                                          </td>
                                          <td>
                                            <div className="btn-group btn-group-sm">
                                              {editingFaqId === faq._id ? (
                                                <>
                                                  <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => updateFaq(faq._id)}
                                                  >
                                                    <i className="fas fa-save"></i>
                                                  </button>
                                                  <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => setEditingFaqId(null)}
                                                  >
                                                    <i className="fas fa-times"></i>
                                                  </button>
                                                </>
                                              ) : (
                                                <>
                                                  <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => {
                                                      setEditingFaqId(faq._id);
                                                      setEditFaq(faq);
                                                    }}
                                                  >
                                                    <i className="fas fa-edit"></i>
                                                  </button>
                                                  <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => deleteFaq(faq._id)}
                                                  >
                                                    <i className="fas fa-trash"></i>
                                                  </button>
                                                </>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Users Tab */}
                  {activeTab === "users" && (
                    <div>
                      {/* Add User Form */}
                      <div className="row mb-4">
                        <div className="col-12">
                          <div className="card border-success">
                            <div className="card-header bg-success text-white">
                              <h5 className="mb-0">
                                <i className="fas fa-user-plus me-2"></i>
                                إضافة مستخدم جديد
                              </h5>
                            </div>
                            <div className="card-body">
                              <form onSubmit={addUser}>
                                <div className="row">
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      الاسم:
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newUser.name}
                                      onChange={(e) =>
                                        setNewUser({
                                          ...newUser,
                                          name: e.target.value,
                                        })
                                      }
                                      placeholder="أدخل اسم المستخدم"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      البريد الإلكتروني:
                                    </label>
                                    <input
                                      type="email"
                                      className="form-control"
                                      value={newUser.email}
                                      onChange={(e) =>
                                        setNewUser({
                                          ...newUser,
                                          email: e.target.value,
                                        })
                                      }
                                      placeholder="أدخل البريد الإلكتروني"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      كلمة المرور:
                                    </label>
                                    <input
                                      type="password"
                                      className="form-control"
                                      value={newUser.password}
                                      onChange={(e) =>
                                        setNewUser({
                                          ...newUser,
                                          password: e.target.value,
                                        })
                                      }
                                      placeholder="أدخل كلمة المرور"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      نوع المستخدم:
                                    </label>
                                    <select
                                      className="form-select"
                                      value={newUser.role}
                                      onChange={(e) =>
                                        setNewUser({
                                          ...newUser,
                                          role: e.target.value,
                                        })
                                      }
                                    >
                                      <option value="user">مستخدم عادي</option>
                                      <option value="admin">مدير النظام</option>
                                    </select>
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                >
                                  <i className="fas fa-plus me-2"></i>
                                  إضافة المستخدم
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Users List */}
                      <div className="row">
                        <div className="col-12">
                          <div className="card">
                            <div className="card-header bg-info text-white">
                              <h5 className="mb-0">
                                <i className="fas fa-list me-2"></i>
                                المستخدمين الموجودين ({users.length})
                              </h5>
                            </div>
                            <div className="card-body">
                              {users.length === 0 ? (
                                <div className="text-center text-muted">
                                  <i className="fas fa-users fa-3x mb-3"></i>
                                  <p>لا يوجد مستخدمين حالياً</p>
                                </div>
                              ) : (
                                <div className="table-responsive">
                                  <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                      <tr>
                                        <th>#</th>
                                        <th>الاسم</th>
                                        <th>البريد الإلكتروني</th>
                                        <th>نوع المستخدم</th>
                                        <th>تاريخ الإنشاء</th>
                                        <th>الإجراءات</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {users.map((user, index) => (
                                        <tr key={user._id}>
                                          <td>{index + 1}</td>
                                          <td>
                                            {editingUserId === user._id ? (
                                              <input
                                                type="text"
                                                className="form-control"
                                                value={editUser.name || ""}
                                                onChange={(e) =>
                                                  setEditUser({
                                                    ...editUser,
                                                    name: e.target.value,
                                                  })
                                                }
                                              />
                                            ) : (
                                              user.name
                                            )}
                                          </td>
                                          <td>
                                            {editingUserId === user._id ? (
                                              <input
                                                type="email"
                                                className="form-control"
                                                value={editUser.email || ""}
                                                onChange={(e) =>
                                                  setEditUser({
                                                    ...editUser,
                                                    email: e.target.value,
                                                  })
                                                }
                                              />
                                            ) : (
                                              user.email
                                            )}
                                          </td>
                                          <td>
                                            {editingUserId === user._id ? (
                                              <select
                                                className="form-select"
                                                value={editUser.role || "user"}
                                                onChange={(e) =>
                                                  setEditUser({
                                                    ...editUser,
                                                    role: e.target.value,
                                                  })
                                                }
                                              >
                                                <option value="user">مستخدم عادي</option>
                                                <option value="admin">مدير النظام</option>
                                              </select>
                                            ) : (
                                              <span className={`badge ${user.role === "admin" ? "bg-danger" : "bg-info"}`}>
                                                {user.role === "admin" ? "مدير النظام" : "مستخدم عادي"}
                                              </span>
                                            )}
                                          </td>
                                          <td>
                                            {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                                          </td>
                                          <td>
                                            <div className="btn-group btn-group-sm">
                                              {editingUserId === user._id ? (
                                                <>
                                                  <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => updateUser(user._id)}
                                                  >
                                                    <i className="fas fa-save"></i>
                                                  </button>
                                                  <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => setEditingUserId(null)}
                                                  >
                                                    <i className="fas fa-times"></i>
                                                  </button>
                                                </>
                                              ) : (
                                                <>
                                                  <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => {
                                                      setEditingUserId(user._id);
                                                      setEditUser({
                                                        name: user.name,
                                                        email: user.email,
                                                        role: user.role,
                                                        password: ""
                                                      });
                                                    }}
                                                  >
                                                    <i className="fas fa-edit"></i>
                                                  </button>
                                                  {/* Don't allow deleting your own account */}
                                                  {localStorage.getItem("userId") !== user._id && (
                                                    <button
                                                      className="btn btn-danger btn-sm"
                                                      onClick={() => deleteUser(user._id)}
                                                    >
                                                      <i className="fas fa-trash"></i>
                                                    </button>
                                                  )}
                                                </>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Engineers Tab */}
                  {activeTab === "engineers" && (
                    <div>
                      {/* Add Engineer Form */}
                      <div className="row mb-4">
                        <div className="col-12">
                          <div className="card border-success">
                            <div className="card-header bg-success text-white">
                              <h5 className="mb-0">
                                <i className="fas fa-user-plus me-2"></i>
                                إضافة مهندس جديد
                              </h5>
                            </div>
                            <div className="card-body">
                              <form onSubmit={addEngineer}>
                                <div className="row">
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      الاسم:
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newEngineer.name}
                                      onChange={(e) =>
                                        setNewEngineer({
                                          ...newEngineer,
                                          name: e.target.value,
                                        })
                                      }
                                      placeholder="أدخل اسم المهندس"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      البريد الإلكتروني:
                                    </label>
                                    <input
                                      type="email"
                                      className="form-control"
                                      value={newEngineer.email}
                                      onChange={(e) =>
                                        setNewEngineer({
                                          ...newEngineer,
                                          email: e.target.value,
                                        })
                                      }
                                      placeholder="أدخل البريد الإلكتروني"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      كلمة المرور:
                                    </label>
                                    <input
                                      type="password"
                                      className="form-control"
                                      value={newEngineer.password}
                                      onChange={(e) =>
                                        setNewEngineer({
                                          ...newEngineer,
                                          password: e.target.value,
                                        })
                                      }
                                      placeholder="أدخل كلمة المرور"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      التخصص:
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newEngineer.specialization}
                                      onChange={(e) =>
                                        setNewEngineer({
                                          ...newEngineer,
                                          specialization: e.target.value,
                                        })
                                      }
                                      placeholder="مثال: هندسة معمارية، هندسة مدنية"
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      سنوات الخبرة:
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newEngineer.experience}
                                      onChange={(e) =>
                                        setNewEngineer({
                                          ...newEngineer,
                                          experience: e.target.value,
                                        })
                                      }
                                      placeholder="مثال: 5 سنوات"
                                    />
                                  </div>
                                  <div className="col-12 mb-3">
                                    <label className="form-label">
                                      نبذة عن المهندس:
                                    </label>
                                    <textarea
                                      className="form-control"
                                      rows="3"
                                      value={newEngineer.bio}
                                      onChange={(e) =>
                                        setNewEngineer({
                                          ...newEngineer,
                                          bio: e.target.value,
                                        })
                                      }
                                      placeholder="أدخل نبذة مختصرة عن المهندس وخبراته"
                                    />
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                >
                                  <i className="fas fa-plus me-2"></i>
                                  إضافة المهندس
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Engineers List */}
                      <div className="row">
                        <div className="col-12">
                          <div className="card">
                            <div className="card-header bg-info text-white">
                              <h5 className="mb-0">
                                <i className="fas fa-list me-2"></i>
                                المهندسين الموجودين ({engineers.length})
                              </h5>
                            </div>
                            <div className="card-body">
                              {engineers.length === 0 ? (
                                <div className="text-center text-muted">
                                  <i className="fas fa-hard-hat fa-3x mb-3"></i>
                                  <p>لا يوجد مهندسين حالياً</p>
                                </div>
                              ) : (
                                <div className="table-responsive">
                                  <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                      <tr>
                                        <th>#</th>
                                        <th>الاسم</th>
                                        <th>البريد الإلكتروني</th>
                                        <th>التخصص</th>
                                        <th>الخبرة</th>
                                        <th>الإجراءات</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {engineers.map((engineer, index) => (
                                        <tr key={engineer._id}>
                                          <td>{index + 1}</td>
                                          <td>
                                            {editingEngineerId === engineer._id ? (
                                              <input
                                                type="text"
                                                className="form-control"
                                                value={editEngineer.name || ""}
                                                onChange={(e) =>
                                                  setEditEngineer({
                                                    ...editEngineer,
                                                    name: e.target.value,
                                                  })
                                                }
                                              />
                                            ) : (
                                              engineer.name
                                            )}
                                          </td>
                                          <td>
                                            {editingEngineerId === engineer._id ? (
                                              <input
                                                type="email"
                                                className="form-control"
                                                value={editEngineer.email || ""}
                                                onChange={(e) =>
                                                  setEditEngineer({
                                                    ...editEngineer,
                                                    email: e.target.value,
                                                  })
                                                }
                                              />
                                            ) : (
                                              engineer.email
                                            )}
                                          </td>
                                          <td>
                                            {editingEngineerId === engineer._id ? (
                                              <input
                                                type="text"
                                                className="form-control"
                                                value={editEngineer.specialization || ""}
                                                onChange={(e) =>
                                                  setEditEngineer({
                                                    ...editEngineer,
                                                    specialization: e.target.value,
                                                  })
                                                }
                                              />
                                            ) : (
                                              engineer.specialization || "غير محدد"
                                            )}
                                          </td>
                                          <td>
                                            {editingEngineerId === engineer._id ? (
                                              <input
                                                type="text"
                                                className="form-control"
                                                value={editEngineer.experience || ""}
                                                onChange={(e) =>
                                                  setEditEngineer({
                                                    ...editEngineer,
                                                    experience: e.target.value,
                                                  })
                                                }
                                              />
                                            ) : (
                                              engineer.experience || "غير محدد"
                                            )}
                                          </td>
                                          <td>
                                            <div className="btn-group btn-group-sm">
                                              {editingEngineerId === engineer._id ? (
                                                <>
                                                  <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => updateEngineer(engineer._id)}
                                                  >
                                                    <i className="fas fa-save"></i>
                                                  </button>
                                                  <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => setEditingEngineerId(null)}
                                                  >
                                                    <i className="fas fa-times"></i>
                                                  </button>
                                                </>
                                              ) : (
                                                <>
                                                  <button
                                                    className="btn btn-info btn-sm"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#engineerModal${engineer._id}`}
                                                  >
                                                    <i className="fas fa-eye"></i>
                                                  </button>
                                                  <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => {
                                                      setEditingEngineerId(engineer._id);
                                                      setEditEngineer({
                                                        name: engineer.name,
                                                        email: engineer.email,
                                                        specialization: engineer.specialization || "",
                                                        experience: engineer.experience || "",
                                                        bio: engineer.bio || "",
                                                        password: ""
                                                      });
                                                    }}
                                                  >
                                                    <i className="fas fa-edit"></i>
                                                  </button>
                                                  <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => deleteEngineer(engineer._id)}
                                                  >
                                                    <i className="fas fa-trash"></i>
                                                  </button>
                                                </>
                                              )}
                                            </div>
                                            
                                            {/* Engineer Details Modal */}
                                            <div className="modal fade" id={`engineerModal${engineer._id}`} tabIndex="-1" aria-hidden="true">
                                              <div className="modal-dialog modal-lg">
                                                <div className="modal-content">
                                                  <div className="modal-header bg-info text-white">
                                                    <h5 className="modal-title">
                                                      <i className="fas fa-user-tie me-2"></i>
                                                      تفاصيل المهندس
                                                    </h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                  </div>
                                                  <div className="modal-body">
                                                    <div className="row">
                                                      <div className="col-md-6 mb-3">
                                                        <h6 className="fw-bold">الاسم:</h6>
                                                        <p>{engineer.name}</p>
                                                      </div>
                                                      <div className="col-md-6 mb-3">
                                                        <h6 className="fw-bold">البريد الإلكتروني:</h6>
                                                        <p>{engineer.email}</p>
                                                      </div>
                                                      <div className="col-md-6 mb-3">
                                                        <h6 className="fw-bold">التخصص:</h6>
                                                        <p>{engineer.specialization || "غير محدد"}</p>
                                                      </div>
                                                      <div className="col-md-6 mb-3">
                                                        <h6 className="fw-bold">سنوات الخبرة:</h6>
                                                        <p>{engineer.experience || "غير محدد"}</p>
                                                      </div>
                                                      <div className="col-12 mb-3">
                                                        <h6 className="fw-bold">نبذة عن المهندس:</h6>
                                                        <p>{engineer.bio || "لا توجد معلومات إضافية"}</p>
                                                      </div>
                                                      <div className="col-md-6 mb-3">
                                                        <h6 className="fw-bold">تاريخ الانضمام:</h6>
                                                        <p>{new Date(engineer.createdAt).toLocaleDateString("ar-EG")}</p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
