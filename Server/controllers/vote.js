const db = require('../config/db');
const Poll = require('../models/Poll');

exports.vote = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;
    const userId = req.user.id;

    // Check if poll is active
    const isActive = await Poll.isPollActive(pollId);
    if (!isActive) {
      return res.status(400).json({ error: 'Voting is closed for this poll' });
    }

    // Check if user has already voted
    const [existingVote] = await db.execute(
      `SELECT * FROM votes WHERE user_id = ? AND poll_id = ?`,
      [userId, pollId]
    );
    if (existingVote.length > 0) {
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