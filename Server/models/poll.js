const db = require('../config/db');

class Poll {
  static async create({ question, adminId, startTime, endTime }) {
    const [result] = await db.execute(
      `INSERT INTO polls (question, admin_id, start_time, end_time) 
       VALUES (?, ?, ?, ?)`,
      [question, adminId, startTime, endTime]
    );
    return result.insertId;
  }

  static async getActivePolls() {
    const [polls] = await db.execute(
      `SELECT * FROM polls 
       WHERE start_time <= NOW() AND end_time >= NOW()`
    );
    return polls;
  }

  static async getPollById(pollId) {
    const [poll] = await db.execute(
      `SELECT * FROM polls WHERE id = ?`,
      [pollId]
    );
    return poll[0];
  }

  static async isPollActive(pollId) {
    const poll = await this.getPollById(pollId);
    if (!poll) return false;
    const now = new Date();
    return now >= new Date(poll.start_time) && now <= new Date(poll.end_time);
  }
}

module.exports = Poll;