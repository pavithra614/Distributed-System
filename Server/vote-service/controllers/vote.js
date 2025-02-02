const db = require('../config/db');

const path = require('path');

const Poll = require(path.resolve(__dirname, '../../poll-service/models/poll'));


const vote = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;
    const userId = req.user.id;

    // Check if poll is active
    const isActive = await Poll.isPollActive(pollId);
    if (!isActive) {
      return res.status(400).json({ error: 'Voting is closed for this poll' });
    }

    // Check if user has already voted
    const [existingVotes] = await db.execute(
      `SELECT * FROM votes WHERE user_id = ? AND poll_id = ?`,
      [userId, pollId]
    );
    if (existingVotes.length > 0) {
      return res.status(400).json({ error: 'You have already voted in this poll' });
    }

    // Save vote
    await db.execute(
      `INSERT INTO votes (user_id, option_id, poll_id) VALUES (?, ?, ?)`,
      [userId, optionId, pollId]
    );

    res.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVotesForOption = async (req, res) => {
  try {
    const { optionId } = req.params;

    // Fetch votes for the specified option
    const [votes] = await db.execute(
      `SELECT * FROM votes WHERE option_id = ?`,
      [optionId]
    );

    res.json({ votes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { vote, getVotesForOption }; // Export both functions