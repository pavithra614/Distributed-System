const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create new user with hashed password
    await User.create({ username, password, isAdmin });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find user by username
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(404).json({ error: 'Username not found' });
      }
  
      // Validate password
      const validPassword = await User.comparePassword(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Incorrect password' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, isAdmin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred during login' });
    }
  };
