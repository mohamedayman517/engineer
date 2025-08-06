const Service = require("../models/Service");

class ServicesController {
  // جلب جميع الخدمات النشطة
  static async getAllActiveServices(req, res) {
    try {
      console.log("🛠️ Fetching active services");
      
      const services = await Service.find({ isActive: true }).sort({
        createdAt: -1,
      });
      
      console.log(`✅ Found ${services.length} active services`);
      
      res.json({
        success: true,
        count: services.length,
        data: services
      });

    } catch (error) {
      console.error("❌ Error fetching active services:", error);
      
      res.status(500).json({ 
        success: false,
        error: "خطأ في جلب الخدمات",
        message_ar: "خطأ في جلب الخدمات"
      });
    }
  }

  // جلب جميع الخدمات للإدارة
  static async getAllServices(req, res) {
    try {
      console.log("🛠️ Fetching all services for admin");
      
      const services = await Service.find().sort({ createdAt: -1 });
      
      console.log(`✅ Found ${services.length} total services`);
      
      res.json({
        success: true,
        count: services.length,
        data: services
      });

    } catch (error) {
      console.error("❌ Error fetching all services:", error);
      res.status(500).json({ 
        success: false,
        error: "خطأ في جلب الخدمات",
        message_ar: "خطأ في جلب الخدمات"
      });
    }
  }

  // جلب خدمة واحدة بالـ ID
  static async getServiceById(req, res) {
    try {
      const { id } = req.params;
      
      console.log(`🔍 Fetching service with ID: ${id}`);
      
      const service = await Service.findById(id);
      
      if (!service) {
        return res.status(404).json({
          success: false,
          error: "الخدمة غير موجودة",
          message_ar: "الخدمة غير موجودة"
        });
      }
      
      console.log(`✅ Found service: ${service.title}`);
      
      res.json({
        success: true,
        data: service
      });

    } catch (error) {
      console.error("❌ Error fetching service by ID:", error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: "معرف الخدمة غير صالح",
          message_ar: "معرف الخدمة غير صالح"
        });
      }
      
      res.status(500).json({
        success: false,
        error: "خطأ في جلب الخدمة",
        message_ar: "خطأ في جلب الخدمة"
      });
    }
  }

  // إنشاء خدمة جديدة
  static async createService(req, res) {
    try {
      console.log("📝 Creating new service:", req.body);
      
      const { title, description, icon, features, price } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          error: "العنوان والوصف مطلوبان",
          message_ar: "العنوان والوصف مطلوبان"
        });
      }

      const newService = new Service({
        title: title.trim(),
        description: description.trim(),
        icon: icon || "fas fa-cogs",
        features: features || [],
        price: price || "حسب الطلب",
        isActive: true
      });

      const savedService = await newService.save();
      
      console.log(`✅ Service created successfully: ${savedService.title}`);

      res.status(201).json({
        success: true,
        message: "تم إنشاء الخدمة بنجاح",
        message_ar: "تم إنشاء الخدمة بنجاح",
        data: savedService
      });

    } catch (error) {
      console.error("❌ Error creating service:", error);
      
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
        error: "خطأ في إنشاء الخدمة",
        message_ar: "خطأ في إنشاء الخدمة"
      });
    }
  }

  // تحديث خدمة
  static async updateService(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log(`📝 Updating service ${id}:`, updateData);

      const updatedService = await Service.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!updatedService) {
        return res.status(404).json({
          success: false,
          error: "الخدمة غير موجودة",
          message_ar: "الخدمة غير موجودة"
        });
      }
      
      console.log(`✅ Service updated successfully: ${updatedService.title}`);

      res.json({
        success: true,
        message: "تم تحديث الخدمة بنجاح",
        message_ar: "تم تحديث الخدمة بنجاح",
        data: updatedService
      });

    } catch (error) {
      console.error("❌ Error updating service:", error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: "معرف الخدمة غير صالح",
          message_ar: "معرف الخدمة غير صالح"
        });
      }

      res.status(500).json({
        success: false,
        error: "خطأ في تحديث الخدمة",
        message_ar: "خطأ في تحديث الخدمة"
      });
    }
  }

  // حذف خدمة
  static async deleteService(req, res) {
    try {
      const { id } = req.params;
      
      console.log(`🗑️ Deleting service: ${id}`);

      const deletedService = await Service.findByIdAndDelete(id);

      if (!deletedService) {
        return res.status(404).json({
          success: false,
          error: "الخدمة غير موجودة",
          message_ar: "الخدمة غير موجودة"
        });
      }
      
      console.log(`✅ Service deleted successfully: ${deletedService.title}`);

      res.json({
        success: true,
        message: "تم حذف الخدمة بنجاح",
        message_ar: "تم حذف الخدمة بنجاح"
      });

    } catch (error) {
      console.error("❌ Error deleting service:", error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: "معرف الخدمة غير صالح",
          message_ar: "معرف الخدمة غير صالح"
        });
      }

      res.status(500).json({
        success: false,
        error: "خطأ في حذف الخدمة",
        message_ar: "خطأ في حذف الخدمة"
      });
    }
  }

  // تبديل حالة الخدمة
  static async toggleServiceStatus(req, res) {
    try {
      const { id } = req.params;
      
      console.log(`🔄 Toggling service status: ${id}`);

      const service = await Service.findById(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          error: "الخدمة غير موجودة",
          message_ar: "الخدمة غير موجودة"
        });
      }

      service.isActive = !service.isActive;
      await service.save();
      
      console.log(`✅ Service status toggled: ${service.title} - Active: ${service.isActive}`);

      res.json({
        success: true,
        message: `تم ${service.isActive ? 'تفعيل' : 'إلغاء تفعيل'} الخدمة بنجاح`,
        message_ar: `تم ${service.isActive ? 'تفعيل' : 'إلغاء تفعيل'} الخدمة بنجاح`,
        data: service
      });

    } catch (error) {
      console.error("❌ Error toggling service status:", error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: "معرف الخدمة غير صالح",
          message_ar: "معرف الخدمة غير صالح"
        });
      }

      res.status(500).json({
        success: false,
        error: "خطأ في تغيير حالة الخدمة",
        message_ar: "خطأ في تغيير حالة الخدمة"
      });
    }
  }
}

module.exports = ServicesController;
