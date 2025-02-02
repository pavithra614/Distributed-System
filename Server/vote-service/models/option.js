const db = require('../../config/db');

class Poll {
  // Method to create a poll
  static async create({ question, adminId, startTime, endTime }) {
    try {
      const [result] = await db.execute(
        `INSERT INTO polls (question, admin_id, start_time, end_time) 
         VALUES (?, ?, ?, ?)`,
        [question, adminId, startTime, endTime]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creating poll:", error);
      throw new Error('Failed to create poll');
    }
  }

  // Method to get all active polls (polls that are currently live)
  static async getActivePolls() {
    try {
      const [polls] = await db.execute(
        `SELECT * FROM polls 
         WHERE start_time <= NOW() AND end_time >= NOW()`
      );
      return polls;
    } catch (error) {
      console.error("Error fetching active polls:", error);
      throw new Error('Failed to fetch active polls');
    }
  }

  // Method to get a specific poll by ID
  static async getPollById(pollId) {
    try {
      const [poll] = await db.execute(
        `SELECT * FROM polls WHERE id = ?`,
        [pollId]
      );
      return poll[0];  // Returns the first poll in the result (should only be one)
    } catch (error) {
      console.error("Error fetching poll by ID:", error);
      throw new Error('Failed to fetch poll');
    }
  }

  // Method to check if a poll is currently active
  static async isPollActive(pollId) {
    try {
      const poll = await this.getPollById(pollId);
      if (!poll) return false;
      const now = new Date();
      return now >= new Date(poll.start_time) && now <= new Date(poll.end_time);
    } catch (error) {
      console.error("Error checking if poll is active:", error);
      return false;
    }
  }
}

module.exports = Poll;
