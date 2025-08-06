const Project = require("../models/Project");

class ProjectsController {
  // جلب جميع المشاريع النشطة
  static async getAllActiveProjects(req, res) {
    try {
      console.log("📋 Fetching active projects - Request details:", {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        query: req.query
      });
      
      const projects = await Project.find({ isActive: true }).sort({
        createdAt: -1,
      });
      
      console.log(`✅ Found ${projects.length} active projects`);
      
      res.json({
        success: true,
        count: projects.length,
        data: projects
      });

    } catch (error) {
      console.error("❌ Error fetching active projects:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        ...(error.code && { code: error.code }),
        ...(error.errors && { errors: error.errors })
      });
      
      res.status(500).json({ 
        success: false,
        error: "خطأ في جلب المشاريع",
        message_ar: "خطأ في جلب المشاريع",
        ...(process.env.NODE_ENV === 'development' && {
          details: error.message
        })
      });
    }
  }

  // جلب جميع المشاريع للإدارة
  static async getAllProjects(req, res) {
    try {
      console.log("📋 Fetching all projects for admin");
      
      const projects = await Project.find().sort({ createdAt: -1 });
      
      console.log(`✅ Found ${projects.length} total projects`);
      
      res.json({
        success: true,
        count: projects.length,
        data: projects
      });

    } catch (error) {
      console.error("❌ Error fetching all projects:", error);
      res.status(500).json({ 
        success: false,
        error: "خطأ في جلب المشاريع",
        message_ar: "خطأ في جلب المشاريع"
      });
    }
  }

  // جلب مشروع واحد بالـ ID
  static async getProjectById(req, res) {
    try {
      const { id } = req.params;
      
      console.log(`🔍 Fetching project with ID: ${id}`);
      
      const project = await Project.findById(id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          error: "المشروع غير موجود",
          message_ar: "المشروع غير موجود"
        });
      }
      
      console.log(`✅ Found project: ${project.title}`);
      
      res.json({
        success: true,
        data: project
      });

    } catch (error) {
      console.error("❌ Error fetching project by ID:", error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: "معرف المشروع غير صالح",
          message_ar: "معرف المشروع غير صالح"
        });
      }
      
      res.status(500).json({
        success: false,
        error: "خطأ في جلب المشروع",
        message_ar: "خطأ في جلب المشروع"
      });
    }
  }

  // إنشاء مشروع جديد
  static async createProject(req, res) {
    try {
      console.log("📝 Creating new project:", req.body);
      
      const {
        title,
        description,
        imageUrl,
        images,
        category,
        location,
        area,
        year,
        client,
        isFeatured
      } = req.body;

      // التحقق من البيانات المطلوبة
      if (!title || !description || !imageUrl || !category) {
        return res.status(400).json({
          success: false,
          error: "العنوان والوصف والصورة والفئة مطلوبة",
          message_ar: "العنوان والوصف والصورة والفئة مطلوبة"
        });
      }

      const newProject = new Project({
        title: title.trim(),
        description: description.trim(),
        imageUrl,
        images: images || [],
        category,
        location: location?.trim(),
        area: area?.trim(),
        year,
        client: client?.trim(),
        isFeatured: isFeatured || false,
        isActive: true
      });

      const savedProject = await newProject.save();
      
      console.log(`✅ Project created successfully: ${savedProject.title}`);

      res.status(201).json({
        success: true,
        message: "تم إنشاء المشروع بنجاح",
        message_ar: "تم إنشاء المشروع بنجاح",
        data: savedProject
      });

    } catch (error) {
      console.error("❌ Error creating project:", error);
      
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: errors.join(", "),
          message_ar: errors.join(", ")
        });
      }

      res.status(500).json({
        success: false,
        error: "خطأ في إنشاء المشروع",
        message_ar: "خطأ في إنشاء المشروع"
      });
    }
  }

  // تحديث مشروع
  static async updateProject(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log(`📝 Updating project ${id}:`, updateData);

      const updatedProject = await Project.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!updatedProject) {
        return res.status(404).json({
          success: false,
          error: "المشروع غير موجود",
          message_ar: "المشروع غير موجود"
        });
      }
      
      console.log(`✅ Project updated successfully: ${updatedProject.title}`);

      res.json({
        success: true,
        message: "تم تحديث المشروع بنجاح",
        message_ar: "تم تحديث المشروع بنجاح",
        data: updatedProject
      });

    } catch (error) {
      console.error("❌ Error updating project:", error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: "معرف المشروع غير صالح",
          message_ar: "معرف المشروع غير صالح"
        });
      }
      
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: errors.join(", "),
          message_ar: errors.join(", ")
        });
      }

      res.status(500).json({
        success: false,
        error: "خطأ في تحديث المشروع",
        message_ar: "خطأ في تحديث المشروع"
      });
    }
  }

  // حذف مشروع
  static async deleteProject(req, res) {
    try {
      const { id } = req.params;
      
      console.log(`🗑️ Deleting project: ${id}`);

      const deletedProject = await Project.findByIdAndDelete(id);

      if (!deletedProject) {
        return res.status(404).json({
          success: false,
          error: "المشروع غير موجود",
          message_ar: "المشروع غير موجود"
        });
      }
      
      console.log(`✅ Project deleted successfully: ${deletedProject.title}`);

      res.json({
        success: true,
        message: "تم حذف المشروع بنجاح",
        message_ar: "تم حذف المشروع بنجاح"
      });

    } catch (error) {
      console.error("❌ Error deleting project:", error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: "معرف المشروع غير صالح",
          message_ar: "معرف المشروع غير صالح"
        });
      }

      res.status(500).json({
        success: false,
        error: "خطأ في حذف المشروع",
        message_ar: "خطأ في حذف المشروع"
      });
    }
  }

  // تبديل حالة المشروع (نشط/غير نشط)
  static async toggleProjectStatus(req, res) {
    try {
      const { id } = req.params;
      
      console.log(`🔄 Toggling project status: ${id}`);

      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: "المشروع غير موجود",
          message_ar: "المشروع غير موجود"
        });
      }

      project.isActive = !project.isActive;
      await project.save();
      
      console.log(`✅ Project status toggled: ${project.title} - Active: ${project.isActive}`);

      res.json({
        success: true,
        message: `تم ${project.isActive ? 'تفعيل' : 'إلغاء تفعيل'} المشروع بنجاح`,
        message_ar: `تم ${project.isActive ? 'تفعيل' : 'إلغاء تفعيل'} المشروع بنجاح`,
        data: project
      });

    } catch (error) {
      console.error("❌ Error toggling project status:", error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: "معرف المشروع غير صالح",
          message_ar: "معرف المشروع غير صالح"
        });
      }

      res.status(500).json({
        success: false,
        error: "خطأ في تغيير حالة المشروع",
        message_ar: "خطأ في تغيير حالة المشروع"
      });
    }
  }
}

module.exports = ProjectsController;
