const express = require('express');
const db = require('../db/db');
const router = express.Router();

// Get all notifications for intern
router.get('/:intern_id', async (req, res) => {
  const { intern_id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM notifications WHERE intern_id = ? ORDER BY created_at DESC',
      [intern_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as seen
router.patch('/:id/seen', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE notifications SET seen = 1 WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
