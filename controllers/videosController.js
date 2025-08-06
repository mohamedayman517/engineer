const Video = require("../models/Video");

class VideosController {
  // جلب جميع الفيديوهات النشطة
  static async getAllActiveVideos(req, res) {
    try {
      console.log("📹 Fetching active videos");
      
      const videos = await Video.find({ isActive: true }).sort({
        createdAt: -1,
      });
      
      console.log(`✅ Found ${videos.length} active videos`);
      
      res.json({
        success: true,
        count: videos.length,
        data: videos
      });

    } catch (error) {
      console.error("❌ Error fetching active videos:", error);
      
      res.status(500).json({ 
        success: false,
        error: "خطأ في جلب الفيديوهات",
        message_ar: "خطأ في جلب الفيديوهات"
      });
    }
  }

  // جلب جميع الفيديوهات للإدارة
  static async getAllVideos(req, res) {
    try {
      console.log("📹 Fetching all videos for admin");
      
      const videos = await Video.find().sort({ createdAt: -1 });
      
      console.log(`✅ Found ${videos.length} total videos`);
      
      res.json({
        success: true,
        count: videos.length,
        data: videos
      });

    } catch (error) {
      console.error("❌ Error fetching all videos:", error);
      res.status(500).json({ 
        success: false,
        error: "خطأ في جلب الفيديوهات",
        message_ar: "خطأ في جلب الفيديوهات"
      });
    }
  }

  // جلب فيديو واحد بالـ ID
  static async getVideoById(req, res) {
    try {
      const { id } = req.params;
      
      console.log(`🔍 Fetching video with ID: ${id}`);
      
      const video = await Video.findById(id);
      
      if (!video) {
        return res.status(404).json({
          success: false,
          error: "الفيديو غير موجود",
          message_ar: "الفيديو غير موجود"
        });
      }
      
      console.log(`✅ Found video: ${video.title}`);
      
      res.json({
        success: true,
        data: video
      });

    } catch (error) {
      console.error("❌ Error fetching video by ID:", error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: "معرف الفيديو غير صالح",
          message_ar: "معرف الفيديو غير صالح"
        });
      }
      
      res.status(500).json({
        success: false,
        error: "خطأ في جلب الفيديو",
        message_ar: "خطأ في جلب الفيديو"
      });
    }
  }

  // إنشاء فيديو جديد
  static async createVideo(req, res) {
    try {
      console.log("📝 Creating new video:", req.body);
      
      const { title, description, videoUrl, thumbnailUrl, category, duration } = req.body;

      if (!title || !videoUrl) {
        return res.status(400).json({
          success: false,
          error: "العنوان ورابط الفيديو مطلوبان",
          message_ar: "العنوان ورابط الفيديو مطلوبان"
        });
      }

      const newVideo = new Video({
        title: title.trim(),
        description: description?.trim(),
        videoUrl,
        thumbnailUrl,
        category: category || "عام",
        duration,
        isActive: true
      });

      const savedVideo = await newVideo.save();
      
      console.log(`✅ Video created successfully: ${savedVideo.title}`);

      res.status(201).json({
        success: true,
        message: "تم إنشاء الفيديو بنجاح",
        message_ar: "تم إنشاء الفيديو بنجاح",
        data: savedVideo
      });

    } catch (error) {
      console.error("❌ Error creating video:", error);
      
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
        error: "خطأ في إنشاء الفيديو",
        message_ar: "خطأ في إنشاء الفيديو"
      });
    }
  }

  // تحديث فيديو
  static async updateVideo(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log(`📝 Updating video ${id}:`, updateData);

      const updatedVideo = await Video.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!updatedVideo) {
        return res.status(404).json({
          success: false,
          error: "الفيديو غير موجود",
          message_ar: "الفيديو غير موجود"
        });
      }
      
      console.log(`✅ Video updated successfully: ${updatedVideo.title}`);

      res.json({
        success: true,
        message: "تم تحديث الفيديو بنجاح",
        message_ar: "تم تحديث الفيديو بنجاح",
        data: updatedVideo
      });

    } catch (error) {
      console.error("❌ Error updating video:", error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: "معرف الفيديو غير صالح",
          message_ar: "معرف الفيديو غير صالح"
        });
      }

      res.status(500).json({
        success: false,
        error: "خطأ في تحديث الفيديو",
        message_ar: "خطأ في تحديث الفيديو"
      });
    }
  }

  // حذف فيديو
  static async deleteVideo(req, res) {
    try {
      const { id } = req.params;
      
      console.log(`🗑️ Deleting video: ${id}`);

      const deletedVideo = await Video.findByIdAndDelete(id);

      if (!deletedVideo) {
        return res.status(404).json({
          success: false,
          error: "الفيديو غير موجود",
          message_ar: "الفيديو غير موجود"
        });
      }
      
      console.log(`✅ Video deleted successfully: ${deletedVideo.title}`);

      res.json({
        success: true,
        message: "تم حذف الفيديو بنجاح",
        message_ar: "تم حذف الفيديو بنجاح"
      });

    } catch (error) {
      console.error("❌ Error deleting video:", error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: "معرف الفيديو غير صالح",
          message_ar: "معرف الفيديو غير صالح"
        });
      }

      res.status(500).json({
        success: false,
        error: "خطأ في حذف الفيديو",
        message_ar: "خطأ في حذف الفيديو"
      });
    }
  }

  // تبديل حالة الفيديو
  static async toggleVideoStatus(req, res) {
    try {
      const { id } = req.params;
      
      console.log(`🔄 Toggling video status: ${id}`);

      const video = await Video.findById(id);

      if (!video) {
        return res.status(404).json({
          success: false,
          error: "الفيديو غير موجود",
          message_ar: "الفيديو غير موجود"
        });
      }

      video.isActive = !video.isActive;
      await video.save();
      
      console.log(`✅ Video status toggled: ${video.title} - Active: ${video.isActive}`);

      res.json({
        success: true,
        message: `تم ${video.isActive ? 'تفعيل' : 'إلغاء تفعيل'} الفيديو بنجاح`,
        message_ar: `تم ${video.isActive ? 'تفعيل' : 'إلغاء تفعيل'} الفيديو بنجاح`,
        data: video
      });

    } catch (error) {
      console.error("❌ Error toggling video status:", error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: "معرف الفيديو غير صالح",
          message_ar: "معرف الفيديو غير صالح"
        });
      }

      res.status(500).json({
        success: false,
        error: "خطأ في تغيير حالة الفيديو",
        message_ar: "خطأ في تغيير حالة الفيديو"
      });
    }
  }
}

module.exports = VideosController;
