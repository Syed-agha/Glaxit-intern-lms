const db = require('../db/db');

async function sendNotification(intern_id, type, message) {
  try {
    await db.query(
      'INSERT INTO notifications (intern_id, type, message) VALUES (?, ?, ?)',
      [intern_id, type, message]
    );
  } catch (err) {
    console.error('Notification Error:', err);
  }
}

module.exports = sendNotification;
