import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { follower_id, followed_id } = req.body;

  try {
    await db.query(
      "INSERT INTO follow (follower_id, followed_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [follower_id, followed_id]
    );
    res.json({ message: "Followed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to follow user" });
  }
});

router.delete("/", async (req, res) => {
  const { follower_id, followed_id } = req.body;

  try {
    await db.query(
      "DELETE FROM follow WHERE follower_id = $1 AND followed_id = $2",
      [follower_id, followed_id]
    );
    res.json({ message: "Unfollowed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to unfollow user" });
  }
});

router.get("/following/:user_id", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.username, u.email FROM follow f
       JOIN users u ON u.id = f.followed_id
       WHERE f.follower_id = $1`,
      [req.params.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch following list" });
  }
});

export default router;
