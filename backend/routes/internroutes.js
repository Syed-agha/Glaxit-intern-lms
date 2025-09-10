const express = require('express');
const db = require('../db/db');
const router = express.Router();

// Add intern
router.post('/add', async (req, res) => {
  const { name, email, department, start_date, end_date } = req.body;
  try {
    await db.query(
      'INSERT INTO interns (name, email, department, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
      [name, email, department, start_date, end_date]
    );
    res.json({ success: true, message: 'Intern added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all interns
router.get('/', async (req, res) => {
  try {
    const [interns] = await db.query('SELECT * FROM interns');
    res.json(interns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update status (activate/deactivate)
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    await db.query('UPDATE interns SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get intern by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM interns WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search/Filter
router.get('/search', async (req, res) => {
  const { q, status } = req.query;
  let sql = 'SELECT * FROM interns WHERE 1';
  const values = [];

  if (q) {
    sql += ' AND (name LIKE ? OR email LIKE ? OR department LIKE ?)';
    values.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (status) {
    sql += ' AND status = ?';
    values.push(status);
  }

  try {
    const [rows] = await db.query(sql, values);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
