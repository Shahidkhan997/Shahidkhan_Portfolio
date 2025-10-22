const Contact = require('../models/contact.model');

// Get all contact messages with pagination and filtering
const getAllMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const messages = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const total = await Contact.countDocuments(filter);

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get message by ID
const getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Contact.findById(id);

    if (!message) {
      return next(createError(404, 'Message not found'));
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// Update message status
const updateMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return next(createError(400, 'Invalid status'));
    }

    const message = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return next(createError(404, 'Message not found'));
    }

    res.json({
      success: true,
      data: message,
      message: 'Status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete message
const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Contact.findByIdAndDelete(id);

    if (!message) {
      return next(createError(404, 'Message not found'));
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get message statistics
const getMessageStats = async (req, res, next) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalMessages = await Contact.countDocuments();

    res.json({
      success: true,
      data: {
        total: totalMessages,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  getMessageStats
};
