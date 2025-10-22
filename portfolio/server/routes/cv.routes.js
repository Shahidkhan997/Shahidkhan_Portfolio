const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cvController = require('../controllers/cv.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Use the original filename with a timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const extname = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }
};

// Initialize multer with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Routes
router.get('/', cvController.getCvUrl); // Get CV URL
router.get('/:id/download', cvController.downloadCv); // Download CV

// Protected routes (require authentication)
router.post('/upload', authMiddleware, upload.single('cv'), cvController.uploadCv);
router.delete('/:id', authMiddleware, cvController.deleteCv);

module.exports = router;
