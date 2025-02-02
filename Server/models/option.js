const db = require('../config/db');

class Option {
  static async create({ optionText, pollId }) {
    const [result] = await db.execute(
      `INSERT INTO options (option_text, poll_id) VALUES (?, ?)`,
      [optionText, pollId]
    );
    return result.insertId;
  }
}

module.exports = Option;