const db = require('../config/db');
const Poll = require('../models/poll');
const Option = require('../../vote-service/models/option');

// Create a poll
exports.createPoll = async (req, res) => {
  const { question, options, startTime, endTime } = req.body;
  const adminId = req.user.id;

  // Validate inputs
  if (!question || question.trim() === '') {
    return res.status(400).json({ error: 'Question is required' });
  }
  if (new Date(startTime) >= new Date(endTime)) {
    return res.status(400).json({ error: 'End time must be after start time' });
  }
  if (!options || options.length < 2) {
    return res.status(400).json({ error: 'Poll must have at least two options' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Create poll
    const [pollResult] = await connection.execute(
      'INSERT INTO polls (question, admin_id, start_time, end_time) VALUES (?, ?, ?, ?)',
      [question, adminId, startTime, endTime]
    );
    const pollId = pollResult.insertId;

    // Add options
    await Promise.all(options.map(optionText =>
      connection.execute(
        'INSERT INTO options (option_text, poll_id) VALUES (?, ?)',
        [optionText, pollId]
      )
    ));

    await connection.commit();
    res.status(201).json({ message: 'Poll created successfully', pollId });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error(error);
    res.status(500).json({ error: 'Failed to create poll' });
  } finally {
    if (connection) connection.release();
  }
};

// Delete a poll
exports.deletePoll = async (req, res) => {
  try {
    const pollId = req.params.id;

    await db.execute(
      `DELETE votes FROM votes 
       INNER JOIN options ON votes.option_id = options.id 
       WHERE options.poll_id = ?`,
      [pollId]
    );

    await db.execute('DELETE FROM options WHERE poll_id = ?', [pollId]);
    await db.execute('DELETE FROM polls WHERE id = ?', [pollId]);

    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete poll' });
  }
};

// Update a poll
exports.updatePoll = async (req, res) => {
  try {
    const pollId = req.params.id;
    const { question, startTime, endTime } = req.body;

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    await db.execute(
      'UPDATE polls SET question = ?, start_time = ?, end_time = ? WHERE id = ?',
      [question, startTime, endTime, pollId]
    );

    res.json({ message: 'Poll updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update poll' });
  }
};

// Get live results for a poll
exports.getPollResults = async (req, res) => {
  try {
    const pollId = req.params.id;

    const [poll] = await db.execute('SELECT * FROM polls WHERE id = ?', [pollId]);
    if (!poll.length) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const [results] = await db.execute(
      `SELECT options.option_text, COUNT(votes.id) AS vote_count 
       FROM options 
       LEFT JOIN votes ON options.id = votes.option_id 
       WHERE options.poll_id = ? 
       GROUP BY options.id`,
      [pollId]
    );

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch poll results' });
  }
};

// Get active polls
exports.getActivePolls = async (req, res) => {
  try {
    const [polls] = await db.execute(
      `SELECT polls.*, GROUP_CONCAT(options.option_text) AS options 
       FROM polls 
       LEFT JOIN options ON polls.id = options.poll_id 
       WHERE polls.start_time <= NOW() AND polls.end_time >= NOW()
       GROUP BY polls.id`
    );

    const formattedPolls = polls.map(poll => ({
      ...poll,
      options: poll.options ? poll.options.split(',') : []
    }));

    res.json(formattedPolls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch active polls' });
  }
};