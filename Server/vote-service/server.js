const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const voteRoutes = require('./routes/voteRoutes');

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON requests

// Routes
app.use('/api/votes', voteRoutes);

// Health Check route (optional)
app.get('/health', (req, res) => {
  res.status(200).send('Vote Service is running');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start the server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Vote Service running on port ${PORT}`);
});

module.exports = app;
