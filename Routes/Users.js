import express from "express";
import db from "../db.js";
import adminAuth from "../Middleware/AdminAuth.js";

const router = express.Router();

router.get("/all", adminAuth, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.json({ users: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { email, role } = req.body;

  try {
    const result = await db.query(
      "UPDATE users SET email = $1, role = $2 WHERE id = $3 RETURNING *",
      [email, role, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted", deletedUser: result.rows[0] });
  } catch (err) {
    console.error("❌ User deletion error:", err.message);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

//savedcontent
router.get("/content/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const userResult = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) return res.status(404).json({ message: "User not found" });

    const userId = userResult.rows[0].id;
    const contentResult = await db.query("SELECT * FROM content WHERE user_id = $1", [userId]);

    res.json(contentResult.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


export default router;