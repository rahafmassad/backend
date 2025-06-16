// Routes/Likes.js
import express from "express";
import db from "../db.js";

const router = express.Router();

// Toggle like/unlike
router.post("/", async (req, res) => {
  const { user_id, content_id } = req.body;
  try {
    const existing = await db.query(
      `SELECT * FROM likes WHERE user_id = $1 AND content_id = $2`,
      [user_id, content_id]
    );

    if (existing.rows.length > 0) {
      await db.query(
        `DELETE FROM likes WHERE user_id = $1 AND content_id = $2`,
        [user_id, content_id]
      );
      return res.json({ liked: false, message: "Unliked content" });
    }

    await db.query(
      `INSERT INTO likes (user_id, content_id) VALUES ($1, $2)`,
      [user_id, content_id]
    );
    res.status(201).json({ liked: true, message: "Liked content" });
  } catch (err) {
    console.error("❌ Like error:", err.message);
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

// Get total likes for content
router.get("/:content_id", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT COUNT(*) FROM likes WHERE content_id = $1`,
      [req.params.content_id]
    );
    res.json({ totalLikes: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error("❌ Fetch likes error:", err.message);
    res.status(500).json({ error: "Failed to fetch likes" });
  }
});

// Check if user liked content
router.get("/:content_id/:user_id", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM likes WHERE content_id = $1 AND user_id = $2`,
      [req.params.content_id, req.params.user_id]
    );
    res.json({ liked: result.rows.length > 0 });
  } catch (err) {
    console.error("❌ Check like error:", err.message);
    res.status(500).json({ error: "Failed to check like" });
  }
});

export default router;
