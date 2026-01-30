const express = require('express');
const {
    registerPatient,
    registerProvider,
    login,
    getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register/patient', registerPatient);
router.post('/register/provider', registerProvider);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
