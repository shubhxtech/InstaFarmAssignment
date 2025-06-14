const express = require('express');
const router = express.Router();

const { signup, login, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateSignup, validateLogin } = require('../middleware/validation');


router.post('/signup', validateSignup, signup);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

module.exports = router;