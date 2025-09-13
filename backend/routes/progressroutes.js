const express = require("express");
const db = require("../db/db");
const { requireRole } = require("../middleware/auth"); 

const router = express.Router();

/**
 * Update progress (after task review)
 */
router.post("/update", async (req, res) => {
  const { intern_id, timeliness, quality, completedTasks, totalTasks } = req.body;

  const completionRate = (completedTasks / totalTasks) * 100;
  let level = "Beginner";
  const avgScore = (timeliness + quality + completionRate / 10) / 3;

  if (avgScore > 90) level = "Pro";
  else if (avgScore > 75) level = "Advanced";
  else if (avgScore > 50) level = "Intermediate";

  try {
    const [existing] = await db.query(
      "SELECT * FROM progress WHERE intern_id = ?",
      [intern_id]
    );

    if (existing.length > 0) {
      await db.query(
        `
        UPDATE progress 
        SET timeliness_score = ?, quality_score = ?, completion_rate = ?, level = ?
        WHERE intern_id = ?
      `,
        [timeliness, quality, completionRate, level, intern_id]
      );
    } else {
      await db.query(
        `
        INSERT INTO progress (intern_id, timeliness_score, quality_score, completion_rate, level)
        VALUES (?, ?, ?, ?, ?)
      `,
        [intern_id, timeliness, quality, completionRate, level]
      );
    }

    res.json({ success: true, level, completionRate });
  } catch (err) {
    console.error("Error updating progress:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get stored progress from DB
 */
router.get("/:intern_id", async (req, res) => {
  const { intern_id } = req.params;
  try {
    const [row] = await db.query(
      "SELECT * FROM progress WHERE intern_id = ?",
      [intern_id]
    );
    if (!row.length) return res.status(404).json({ error: "No progress found" });
    res.json(row[0]);
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Compute progress dynamically from tasks
 * Admin can view any intern’s progress,
 * interns can only view their own.
 */
router.get("/tasks/:internId", requireRole("intern"), async (req, res) => {
  const { internId } = req.params;

  try {
    if (req.user.role === "intern" && req.user.id !== parseInt(internId)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const [rows] = await db.query(
      `
        SELECT 
            SUM(CASE WHEN submitted_on <= deadline THEN 1 ELSE 0 END) / COUNT(*) * 100 AS timeliness,
            AVG(quality_score) AS quality,
            SUM(CASE WHEN status IN ('Submitted','Reviewed') THEN 1 ELSE 0 END) / COUNT(*) * 100 AS completion_rate
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
    console.error("Error computing dynamic progress:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
