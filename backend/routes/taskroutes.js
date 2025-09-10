const express = require('express');
const multer = require('multer');
const db = require('../db/db');
const router = express.Router();
const sendNotification = require('../utilities/sendnotification');

// Set up multer for intern file uploads
const storage = multer.diskStorage({
  destination: 'uploads/tasks/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Create a task (admin)
router.post('/create', async (req, res) => {
  const { title, description, deadline } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO tasks (title, description, deadline) VALUES (?, ?, ?)',
      [title, description, deadline]
    );
    res.json({ success: true, taskId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign task to intern(s)
router.post('/assign', async (req, res) => {
  const { task_id, intern_ids } = req.body;
  try {
    for (let intern_id of intern_ids) { 
      await db.query(
        'INSERT INTO intern_tasks (task_id, intern_id) VALUES (?, ?)',
        [task_id, intern_id]
      );
      await sendNotification(intern_id,'task','new task assigned(Task ID: ${task_id})');
    }
    res.json({ success: true, message: 'Task assigned to interns' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tasks for admin
router.get('/admin', async (req, res) => {
  try {
    const [tasks] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tasks for a specific intern
router.get('/intern/:intern_id', async (req, res) => {
  const { intern_id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT t.*, it.status, it.submission_path, it.submitted_at
      FROM tasks t
      JOIN intern_tasks it ON t.id = it.task_id
      WHERE it.intern_id = ?
    `, [intern_id]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Intern submits task file
router.post('/submit/:task_id', upload.single('file'), async (req, res) => {
  const { task_id } = req.params;
  const { intern_id } = req.body;

  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    await db.query(`
      UPDATE intern_tasks 
      SET submission_path = ?, status = 'submitted', submitted_at = NOW() 
      WHERE task_id = ? AND intern_id = ?
    `, [req.file.path, task_id, intern_id]);

    res.json({ success: true, message: 'Task submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin reviews task
router.patch('/review/:task_id', async (req, res) => {
  const { task_id } = req.params;
  const { intern_id, status, feedback } = req.body;

  try {
    await db.query(`
      UPDATE intern_tasks 
      SET status = ?, feedback = ? 
      WHERE task_id = ? AND intern_id = ?
    `, [status, feedback, task_id, intern_id]);
    await sendNotification(intern_id,'feedback','Your task was reviewed. Feesback: ${feedback}');
    res.json({ success: true, message: 'Task reviewed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
