const express = require('express');
const router = express.Router();
const { verifyUser, verifyAdmin } = require('../auth-service/middleware/auth');
const { createPoll, getActivePolls, deletePoll, updatePoll, getPollResults } = require('../poll-service/controllers/poll');

// Admin routes
router.post('/', verifyUser, verifyAdmin, createPoll);  // ✅ Ensure createPoll is exported
router.delete('/:id', verifyUser, verifyAdmin, deletePoll);  // ✅ Ensure deletePoll is exported
router.put('/:id', verifyUser, verifyAdmin, updatePoll);  // ✅ Ensure updatePoll is exported

// User routes
router.get('/active', verifyUser, getActivePolls);  // ✅ Ensure getActivePolls is exported
router.get('/results/:id', verifyUser, getPollResults);  // ✅ Ensure getPollResults is exported

module.exports = router;
