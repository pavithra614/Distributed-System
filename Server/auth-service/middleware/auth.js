const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log("Received Token:", token); // Debugging log

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging log
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error); // Debugging log
    res.status(400).json({ error: 'Invalid token.' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};

module.exports = { verifyUser, verifyAdmin };
