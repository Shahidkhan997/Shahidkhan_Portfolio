const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { submitContactForm } = require('../controllers/contact.controller');

// Validation rules
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot be more than 100 characters'),
  body('email').isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('subject').trim().notEmpty().withMessage('Subject is required')
    .isLength({ max: 200 }).withMessage('Subject cannot be more than 200 characters'),
  body('message').trim().notEmpty().withMessage('Message is required')
    .isLength({ max: 2000 }).withMessage('Message cannot be more than 2000 characters')
];

// Submit contact form
router.post('/', contactValidation, submitContactForm);

module.exports = router;
