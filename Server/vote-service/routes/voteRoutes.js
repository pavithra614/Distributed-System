const express = require('express');
const router = express.Router();
const { vote, getVotesForOption } = require('../controllers/vote'); // Correct import

// Create a vote for an option
router.post('/vote', vote); // Use the imported `vote` function directly

// Get votes for a specific option in a poll
router.get('/votes/:optionId', getVotesForOption); // Use the imported `getVotesForOption` function directly

module.exports = router;