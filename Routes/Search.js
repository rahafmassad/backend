import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ error: "Missing search query" });

  try {
    const contentResult = await db.query(
      `SELECT * FROM content WHERE title ILIKE $1 OR description ILIKE $1`,
      [`%${q}%`]
    );

    const userResult = await db.query(
      `SELECT id, username, email FROM users WHERE username ILIKE $1 OR email ILIKE $1`,
      [`%${q}%`]
    );

    res.json({
      content: contentResult.rows,
      users: userResult.rows
    });
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Failed to perform search" });
  }
});

export default router;
