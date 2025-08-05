const express = require("express");
const router = express.Router();
const Video = require("../models/Video");
const { authenticateToken, requireAdmin, requireEngineerOrAdmin } = require("../middleware/auth");

// GET /api/videos - جلب جميع الفيديوهات
router.get("/", async (req, res) => {
  try {
    console.log("Videos endpoint hit");
    const videos = await Video.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "خطأ في جلب الفيديوهات" });
  }
});

// GET /api/videos/all - جلب جميع الفيديوهات للإدارة
router.get("/all", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error("Error fetching all videos:", error);
    res.status(500).json({ error: "خطأ في جلب الفيديوهات" });
  }
});

// POST /api/videos - إضافة فيديو جديد
router.post("/", authenticateToken, requireEngineerOrAdmin, async (req, res) => {
  try {
    const { title, description, embedUrl, videoUrl, category, thumbnail } = req.body;

    if (!title || !description || !category || !videoUrl) {
      return res.status(400).json({ error: "جميع الحقول مطلوبة، يجب توفير رابط فيديو" });
    }

    const newVideo = new Video({
      title: title.trim(),
      description: description.trim(),
      embedUrl: embedUrl?.trim(),
      videoUrl: videoUrl?.trim(),
      category,
      thumbnail: thumbnail?.trim(),
    });

    await newVideo.save();
    console.log("New video added:", newVideo);

    res.status(201).json({
      message: "تم إضافة الفيديو بنجاح",
      video: newVideo,
    });
  } catch (error) {
    console.error("Error adding video:", error);
    res.status(500).json({ error: "حدث خطأ في إضافة الفيديو" });
  }
});

// PUT /api/videos/:id - تحديث فيديو
router.put("/:id", authenticateToken, requireEngineerOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, embedUrl, videoUrl, category, thumbnail, isActive } =
      req.body;

    if (!title || !description || !category || !videoUrl) {
      return res.status(400).json({ error: "جميع الحقول مطلوبة، يجب توفير رابط فيديو" });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        embedUrl: embedUrl?.trim(),
        videoUrl: videoUrl?.trim(),
        category,
        thumbnail: thumbnail?.trim(),
        isActive: isActive !== undefined ? isActive : true,
      },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ error: "الفيديو غير موجود" });
    }

    console.log("Video updated:", updatedVideo);
    res.json({
      message: "تم تحديث الفيديو بنجاح",
      video: updatedVideo,
    });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ error: "حدث خطأ في تحديث الفيديو" });
  }
});

// DELETE /api/videos/:id - حذف فيديو
router.delete("/:id", authenticateToken, requireEngineerOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ error: "الفيديو غير موجود" });
    }

    console.log("Video deleted:", deletedVideo);
    res.json({
      message: "تم حذف الفيديو بنجاح",
      video: deletedVideo,
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ error: "حدث خطأ في حذف الفيديو" });
  }
});

// GET /api/videos/category/:category - جلب فيديوهات حسب الفئة
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const videos = await Video.find({
      category,
      isActive: true,
    }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos by category:", error);
    res.status(500).json({ error: "خطأ في جلب الفيديوهات" });
  }
});

module.exports = router;
