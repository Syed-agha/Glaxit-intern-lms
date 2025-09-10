const express = require('express');
const db = require('../db/db');
const sendNotification = require('../utilities/sendnotification');
const router = express.Router();

// Award badge
router.post('/award', async (req, res) => {
  const { intern_id, badge_type } = req.body;
  try {
    await db.query('INSERT INTO badges (intern_id, badge_type) VALUES (?, ?)', [intern_id, badge_type]);
    await sendNotification(intern_id,'badge',`🎖️ You have earned a new badge: ${badge_type}`);
    res.json({ success: true, message: 'Badge awarded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get badges for intern
router.get('/:intern_id', async (req, res) => {
  const { intern_id } = req.params;
  try {
    const [badges] = await db.query('SELECT * FROM badges WHERE intern_id = ?', [intern_id]);
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Optional: Leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT interns.name, COUNT(b.id) as badge_count
      FROM badges b
      JOIN interns ON b.intern_id = interns.id
      GROUP BY b.intern_id
      ORDER BY badge_count DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
