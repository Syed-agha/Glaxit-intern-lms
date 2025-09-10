const express = require("express");
const db = require("../db/db"); // use the same as your other routes
const { requireRole } = require("../middleware/auth"); // make sure this file exists

const router = express.Router();

// Admin can view any intern's progress, interns can view only their own
router.get("/:internId", requireRole("intern"), async (req, res) => {
  const { internId } = req.params;

  try {
    // Ensure interns only access their own data unless admin
    if (req.user.role === "intern" && req.user.id !== parseInt(internId)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const [rows] = await db.query(
      `
        SELECT 
            SUM(CASE WHEN submitted_on <= deadline THEN 1 ELSE 0 END) / COUNT(*) * 100 AS timeliness,
            AVG(quality_score) AS quality,
            SUM(CASE WHEN status = 'Submitted' OR status = 'Reviewed' THEN 1 ELSE 0 END) / COUNT(*) * 100 AS completion_rate
        FROM tasks
        WHERE intern_id = ?
      `,
      [internId]
    );

    res.json({
      timeliness: Math.round(rows[0].timeliness || 0),
      quality: Math.round(rows[0].quality || 0),
      completionRate: Math.round(rows[0].completion_rate || 0),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
