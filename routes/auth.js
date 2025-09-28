const express = require('express');
const { body } = require('express-validator');
const { login, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();


const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

router.post('/login', loginValidation, login);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
