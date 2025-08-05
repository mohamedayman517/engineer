const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const cloudinaryService = require('../services/cloudinaryService');

const router = express.Router();

// Create uploads directory if it doesn't exist (للتخزين المؤقت)
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter based on route
const fileFilter = (req, file, cb) => {
  // للمسار /video نقبل ملفات الفيديو فقط
  if (req.path === '/video') {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  } 
  // للمسارات الأخرى نقبل الصور فقط
  else {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  }
});

// Upload image endpoint
router.post('/', (req, res, next) => { // إزالة authenticateToken مؤقتًا للاختبار
  console.log('Upload endpoint hit');
  console.log('Request headers:', req.headers);
  console.log('Request body type:', typeof req.body);
  next();
}, upload.single('image'), async (req, res) => {
  try {
    console.log('After multer middleware');
    console.log('req.file:', req.file);
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File received:', req.file.path);
    
    // تحميل الملف إلى Cloudinary
    console.log('Uploading to Cloudinary...');
    const result = await cloudinaryService.uploadFile(req.file.path, 'projects');
    console.log('Cloudinary result:', result);
    
    // Return the Cloudinary URL and details
    res.json({ 
      message: 'File uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error stack:', error.stack);
    // حذف الملف المؤقت في حالة الفشل
    if (req.file && req.file.path) {
      try { 
        console.log('Cleaning up temp file:', req.file.path);
        fs.unlinkSync(req.file.path); 
      } catch (e) { 
        console.error('Error deleting temp file:', e);
      }
    }
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

// Upload video endpoint
router.post('/video', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // تحميل الفيديو إلى Cloudinary
    const result = await cloudinaryService.uploadFile(req.file.path, 'videos');
    
    // Return the Cloudinary URL and details
    res.json({ 
      message: 'Video uploaded successfully',
      videoUrl: result.secure_url,
      publicId: result.public_id,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Video upload error:', error);
    // حذف الملف المؤقت في حالة الفشل
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
    }
    res.status(500).json({ message: 'Error uploading video' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 100MB.' });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ message: 'Only image files are allowed!' });
  }

  if (error.message === 'Only video files are allowed!') {
    return res.status(400).json({ message: 'Only video files are allowed!' });
  }
  
  res.status(500).json({ message: 'Error uploading file' });
});

module.exports = router;
