const db = require('../../config/db');
const Poll = require('../../models/Poll');
const Option = require('../../vote-service/models/option');

// Create a poll
exports.createPoll = async (req, res) => {
  try {
    const { question, options, startTime, endTime } = req.body;
    const adminId = req.user.id;

    // Validate time range
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    // Validate options array
    if (!options || options.length < 2) {
      return res.status(400).json({ error: 'Poll must have at least two options' });
    }

    // Create poll
    const pollId = await Poll.create({ question, adminId, startTime, endTime });

    // Add options
    await Promise.all(options.map(optionText => 
      Option.create({ optionText, pollId })
    ));

    res.status(201).json({ message: 'Poll created successfully', pollId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
};

// Delete a poll
exports.deletePoll = async (req, res) => {
  try {
    const pollId = req.params.id;

    // Step 1: Delete votes associated with the poll's options
    await db.execute(
      `DELETE votes FROM votes 
       INNER JOIN options ON votes.option_id = options.id 
       WHERE options.poll_id = ?`,
      [pollId]
    );

    // Step 2: Delete options associated with the poll
    await db.execute('DELETE FROM options WHERE poll_id = ?', [pollId]);

    // Step 3: Delete the poll
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

    // Validate time range
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    // Update poll
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

    // Fetch results for the poll
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
      `SELECT polls.*, options.id AS option_id, options.option_text 
       FROM polls 
       LEFT JOIN options ON polls.id = options.poll_id 
       WHERE polls.start_time <= NOW() AND polls.end_time >= NOW()`
    );

    // Group options by poll
    const groupedPolls = polls.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          question: row.question,
          start_time: row.start_time,
          end_time: row.end_time,
          options: []
        };
      }
      if (row.option_id) {
        acc[row.id].options.push({ id: row.option_id, option_text: row.option_text });
      }
      return acc;
    }, {});

    res.json(Object.values(groupedPolls)); // Ensure the response is an array
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch active polls' });
  }
};
