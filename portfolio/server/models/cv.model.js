const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search
cvSchema.index({ originalname: 'text' });

// Add pagination plugin
cvSchema.plugin(require('mongoose-paginate-v2'));

module.exports = mongoose.model('CV', cvSchema);
