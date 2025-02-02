const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ username, password, isAdmin = false }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      `INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)`,
      [username, hashedPassword, isAdmin]
    );
    return result.insertId;
  }

  static async findByUsername(username) {
    const [user] = await db.execute(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    return user[0];
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;