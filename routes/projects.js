const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { authenticateToken, requireAdmin, requireEngineerOrAdmin } = require("../middleware/auth");

// GET /api/projects - جلب جميع المشاريع النشطة
router.get("/", async (req, res) => {
  try {
    console.log("Projects endpoint hit - Request details:", {
      headers: req.headers,
      query: req.query,
      params: req.params,
      user: req.user
    });
    
    const projects = await Project.find({ isActive: true }).sort({
      createdAt: -1,
    });
    
    console.log(`Found ${projects.length} active projects`);
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...(error.code && { code: error.code }),
      ...(error.errors && { errors: error.errors })
    });
    
    res.status(500).json({ 
      error: "خطأ في جلب المشاريع",
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message
      })
    });
  }
});



// GET /api/projects/all - جلب جميع المشاريع للإدارة
router.get("/all", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching all projects:", error);
    res.status(500).json({ error: "خطأ في جلب المشاريع" });
  }
});

// GET /api/projects/featured - جلب المشاريع المميزة
router.get("/featured", async (req, res) => {
  try {
    const projects = await Project.find({
      isActive: true,
      isFeatured: true,
    }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    res.status(500).json({ error: "خطأ في جلب المشاريع المميزة" });
  }
});

// POST /api/projects - إضافة مشروع جديد
router.post("/", authenticateToken, requireEngineerOrAdmin, async (req, res) => {
  try {
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
      isFeatured,
    } = req.body;

    console.log("بيانات المشروع الجديد المستلمة:", {
      title,
      description,
      imageUrl,
      images,
      category,
      location,
      area,
      year,
      client,
      isFeatured,
    });
    console.log("الصور الإضافية المستلمة للمشروع الجديد:", images);

    if (!title || !description || !imageUrl || !category) {
      return res
        .status(400)
        .json({ error: "العنوان والوصف والصورة والفئة مطلوبة" });
    }

    // تأكد من أن images هو مصفوفة
    let validImages = [];
    if (images) {
      if (Array.isArray(images)) {
        // تصفية الصور للتأكد من أنها روابط صالحة
        validImages = images.filter(url => {
          return url && typeof url === 'string' && url.startsWith('http');
        });
      } else if (typeof images === 'string' && images.startsWith('http')) {
        // إذا كان images عبارة عن رابط واحد، قم بتحويله إلى مصفوفة
        validImages = [images];
      }
    }
    
    console.log("الصور الإضافية بعد التصفية للمشروع الجديد:", validImages);

    const newProject = new Project({
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      images: validImages,
      category,
      location: location?.trim(),
      area: area?.trim(),
      year: year ? parseInt(year) : undefined,
      client: client?.trim(),
      isFeatured: isFeatured || false,
    });

    console.log("المشروع الجديد قبل الحفظ:", newProject);
    await newProject.save();
    console.log("تم حفظ المشروع الجديد في قاعدة البيانات:", newProject);

    res.status(201).json({
      message: "تم إضافة المشروع بنجاح",
      project: newProject,
    });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ error: "حدث خطأ في إضافة المشروع" });
  }
});

// PUT /api/projects/:id - تحديث مشروع
router.put("/:id", authenticateToken, requireEngineerOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
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
      isActive,
      isFeatured,
    } = req.body;

    if (!title || !description || !imageUrl || !category) {
      return res
        .status(400)
        .json({ error: "العنوان والوصف والصورة والفئة مطلوبة" });
    }

    console.log("بيانات المشروع المستلمة للتحديث:", {
      id,
      title,
      description,
      imageUrl,
      images,
      category,
      location,
      area,
      year,
      client,
      isActive,
      isFeatured,
    });
    console.log("الصور الإضافية المستلمة للتحديث:", images);

    // تأكد من أن images هو مصفوفة
    let validImages = [];
    if (images) {
      if (Array.isArray(images)) {
        // تصفية الصور للتأكد من أنها روابط صالحة
        validImages = images.filter(url => {
          return url && typeof url === 'string' && url.startsWith('http');
        });
      } else if (typeof images === 'string' && images.startsWith('http')) {
        // إذا كان images عبارة عن رابط واحد، قم بتحويله إلى مصفوفة
        validImages = [images];
      }
    }
    
    console.log("الصور الإضافية بعد التصفية لتحديث المشروع:", validImages);

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        images: validImages,
        category,
        location: location?.trim(),
        area: area?.trim(),
        year: year ? parseInt(year) : undefined,
        client: client?.trim(),
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
      },
      { new: true }
    );
    
    console.log("المشروع بعد التحديث في قاعدة البيانات:", updatedProject);

    if (!updatedProject) {
      return res.status(404).json({ error: "المشروع غير موجود" });
    }

    console.log("Project updated:", updatedProject);
    res.json({
      message: "تم تحديث المشروع بنجاح",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "حدث خطأ في تحديث المشروع" });
  }
});

// DELETE /api/projects/:id - حذف مشروع
router.delete("/:id", authenticateToken, requireEngineerOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ error: "المشروع غير موجود" });
    }

    console.log("Project deleted:", deletedProject);
    res.json({
      message: "تم حذف المشروع بنجاح",
      project: deletedProject,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "حدث خطأ في حذف المشروع" });
  }
});

// GET /api/projects/category/:category - جلب مشاريع حسب الفئة
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const projects = await Project.find({
      category,
      isActive: true,
    }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects by category:", error);
    res.status(500).json({ error: "خطأ في جلب المشاريع" });
  }
});

// GET /api/projects/:id - جلب تفاصيل مشروع محدد
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching project with ID: ${id}`);
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ error: "المشروع غير موجود" });
    }
    
    res.json(project);
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ error: "خطأ في جلب تفاصيل المشروع" });
  }
});

module.exports = router;
