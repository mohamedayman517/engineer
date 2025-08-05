const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { authenticateToken, requireEngineerOrAdmin, requireAdmin } = require('../middleware/auth');

// الحصول على جميع الخدمات النشطة (للمستخدمين)
// GET /api/services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الخدمات' });
  }
});

// الحصول على جميع الخدمات (للمسؤولين)
// GET /api/services/all
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الخدمات' });
  }
});

// الحصول على خدمة محددة
// GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'الخدمة غير موجودة' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الخدمة' });
  }
});

// إضافة خدمة جديدة
// POST /api/services
router.post('/', authenticateToken, requireEngineerOrAdmin, async (req, res) => {
  try {
    const { title, description, icon, color, isActive, order } = req.body;

    // التحقق من البيانات المطلوبة
    if (!title || !description || !icon) {
      return res.status(400).json({ message: 'يرجى توفير العنوان والوصف والأيقونة' });
    }

    const newService = new Service({
      title,
      description,
      icon,
      color: color || '#3498db',
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء إضافة الخدمة' });
  }
});

// تحديث خدمة
// PUT /api/services/:id
router.put('/:id', authenticateToken, requireEngineerOrAdmin, async (req, res) => {
  try {
    const { title, description, icon, color, isActive, order } = req.body;

    // التحقق من وجود الخدمة
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'الخدمة غير موجودة' });
    }

    // تحديث البيانات
    if (title) service.title = title;
    if (description) service.description = description;
    if (icon) service.icon = icon;
    if (color) service.color = color;
    if (isActive !== undefined) service.isActive = isActive;
    if (order !== undefined) service.order = order;

    service.updatedAt = Date.now();

    await service.save();
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث الخدمة' });
  }
});

// حذف خدمة
// DELETE /api/services/:id
router.delete('/:id', authenticateToken, requireEngineerOrAdmin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'الخدمة غير موجودة' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف الخدمة بنجاح' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء حذف الخدمة' });
  }
});

module.exports = router;