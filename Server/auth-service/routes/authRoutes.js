const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Route to register a new user
router.post('/register', authController.register);

// Route to log in and generate a JWT token
router.post('/login', authController.login);

module.exports = router;
