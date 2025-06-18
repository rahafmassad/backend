import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/partners/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await db.query(
      `SELECT DISTINCT u.id, u.email
       FROM users u
       WHERE u.id IN (
         SELECT receiver_id FROM chat WHERE sender_id = $1
         UNION
         SELECT sender_id FROM chat WHERE receiver_id = $1
       ) AND u.id != $1`,
      [user_id]
    );
    res.json({ partners: result.rows });
  } catch (err) {
    console.error("Fetch chat partners error:", err.message);
    res.status(500).json({ error: "Failed to fetch chat partners" });
  }
});

router.post("/", async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO chat (sender_id, receiver_id, message)
       VALUES ($1, $2, $3) RETURNING *`,
      [sender_id, receiver_id, message]
    );
    res.status(201).json({ chat: result.rows[0] });
  } catch (err) {
    console.error("Chat send error:", err.message);
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.get("/:user1_id/:user2_id", async (req, res) => {
  const { user1_id, user2_id } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM chat
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY time ASC`,
      [user1_id, user2_id]
    );
    res.json({ messages: result.rows });
  } catch (err) {
      console.error("Fetch chat partners error:", err.message);
      res.status(500).json({ error: "Failed to fetch chat partners" });
  }
});

export default router;
