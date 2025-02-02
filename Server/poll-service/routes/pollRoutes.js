const express = require('express');
const router = express.Router();
const pollController = require('../controllers/poll');
const authMiddleware = require('../middleware/auth'); // Assuming auth middleware is set up

// Create a new poll (requires authentication)
router.post('/create', authMiddleware, pollController.createPoll);

// Delete a poll by ID (requires authentication)
router.delete('/:id', authMiddleware, pollController.deletePoll);

// Update a poll by ID (requires authentication)
router.put('/:id', authMiddleware, pollController.updatePoll);

// Get live results of a poll by ID
router.get('/:id/results', pollController.getPollResults);

// Get all active polls
router.get('/active', pollController.getActivePolls);

module.exports = router;
