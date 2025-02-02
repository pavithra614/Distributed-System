const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const pollRoutes = require('./routes/poll');
const voteRoutes = require('./routes/vote');
const { verifyUser, verifyAdmin } = require('./auth-service/middleware/auth');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/polls', voteRoutes); // This ensures vote routes are under `/api/polls`




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));