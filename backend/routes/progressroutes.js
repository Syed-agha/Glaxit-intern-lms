const express = require('express');
const db = require('../db/db');
const router = express.Router();

// Update progress (after task review)
router.post('/update', async (req, res) => {
  const { intern_id, timeliness, quality, completedTasks, totalTasks } = req.body;

  const completionRate = (completedTasks / totalTasks) * 100;
  let level = 'Beginner';
  const avgScore = (timeliness + quality + completionRate / 10) / 3;

  if (avgScore > 90) level = 'Pro';
  else if (avgScore > 75) level = 'Advanced';
  else if (avgScore > 50) level = 'Intermediate';

  try {
    const [existing] = await db.query('SELECT * FROM progress WHERE intern_id = ?', [intern_id]);
    if (existing.length > 0) {
      await db.query(`
        UPDATE progress 
        SET timeliness_score = ?, quality_score = ?, completion_rate = ?, level = ?
        WHERE intern_id = ?
      `, [timeliness, quality, completionRate, level, intern_id]);
    } else {
      await db.query(`
        INSERT INTO progress (intern_id, timeliness_score, quality_score, completion_rate, level)
        VALUES (?, ?, ?, ?, ?)
      `, [intern_id, timeliness, quality, completionRate, level]);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get progress for intern
router.get('/:intern_id', async (req, res) => {
  const { intern_id } = req.params;
  try {
    const [row] = await db.query('SELECT * FROM progress WHERE intern_id = ?', [intern_id]);
    res.json(row[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;