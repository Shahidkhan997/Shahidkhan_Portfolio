const CV = require('../models/cv.model');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const createError = require('http-errors');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Upload CV
const uploadCv = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createError(400, 'No file uploaded');
    }

    // Delete existing CV if it exists
    await CV.deleteMany({});

    const { originalname, mimetype, size, filename } = req.file;
    const fileExtension = path.extname(originalname);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Move the file to the uploads directory
    await fs.promises.rename(req.file.path, filePath);

    // Create CV record in database
    const cv = new CV({
      filename: uniqueFilename,
      originalname,
      mimetype,
      size,
      url: `/uploads/${uniqueFilename}`
    });

    await cv.save();

    res.status(201).json({
      success: true,
      message: 'CV uploaded successfully',
      data: {
        id: cv._id,
        name: originalname,
        url: `/api/cv/${cv._id}/download`
      }
    });
  } catch (error) {
    // Clean up the uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// Get CV URL
const getCvUrl = async (req, res, next) => {
  try {
    const cv = await CV.findOne().sort({ createdAt: -1 });
    
    if (!cv) {
      throw createError(404, 'CV not found');
    }

    res.json({
      success: true,
      data: {
        url: `/api/cv/${cv._id}/download`,
        name: cv.originalname
      }
    });
  } catch (error) {
    next(error);
  }
};

// Download CV
const downloadCv = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);
    
    if (!cv) {
      throw createError(404, 'CV not found');
    }

    const filePath = path.join(uploadDir, cv.filename);
    
    if (!fs.existsSync(filePath)) {
      throw createError(404, 'File not found');
    }

    res.download(filePath, cv.originalname);
  } catch (error) {
    next(error);
  }
};

// Delete CV
const deleteCv = async (req, res, next) => {
  try {
    const cv = await CV.findByIdAndDelete(req.params.id);
    
    if (!cv) {
      throw createError(404, 'CV not found');
    }

    const filePath = path.join(uploadDir, cv.filename);
    
    // Delete the file from the filesystem
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      success: true,
      message: 'CV deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadCv,
  getCvUrl,
  downloadCv,
  deleteCv
};
