const express = require('express');
const bodyParser = require('body-parser');
const pollRoutes = require('./routes/pollRoutes');
const app = express();

// Middleware to parse JSON body
app.use(bodyParser.json());

// Use the poll routes
app.use('/polls', pollRoutes);

// Set up other routes and middleware (e.g., error handling)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Poll Service running on port ${PORT}`);
});
