import express from "express";
import db from "../db.js";
import adminAuth from "../Middleware/AdminAuth.js";

const router = express.Router();

//create content for user
router.post("/", async (req, res) => {
  const { user_id, title, description, type, image } = req.body;

  try {
    const result = await db.query(
  "INSERT INTO content (user_id, title, description, type, image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
  [user_id, title, description, type, image]
);
    res.status(201).json({ content: result.rows[0] });
  } catch (err) {
    console.error("❌ Content creation error:", err.message);
    res.status(500).json({ error: "Failed to create content" });
  }
});

//get content created by user
router.get("/created/:user_id", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM content WHERE user_id = $1 ORDER BY time DESC",
      [req.params.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch created content" });
  }
});

//save content for users
router.post("/save/:content_id", async (req, res) => {
  const { user_id } = req.body;

  try {
    await db.query(
      "INSERT INTO saved_content (user_id, content_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [user_id, req.params.content_id]
    );
    res.status(200).json({ message: "Content saved" });
  } catch (err) {
    console.error("❌ Content creation error:", err.message);
    res.status(500).json({ error: "Failed to save content" });
  }
});

//get saved content for user
router.get("/saved/:user_id", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.* FROM saved_content sc 
       JOIN content c ON sc.content_id = c.content_id 
       WHERE sc.user_id = $1
       ORDER BY c.time DESC`,
      [req.params.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch saved content" });
  }
});

//update content for users
router.put("/:content_id", async (req, res) => {
  const { title, description, type, user_id, image } = req.body;

  try {
    const result = await db.query(
      `UPDATE content 
       SET title = $1, description = $2, type = $3, image = $4
       WHERE content_id = $5 AND user_id = $6 
       RETURNING *`,
      [title, description, type, req.params.content_id, user_id, image]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Unauthorized or content not found" });
    }

    res.json({ message: "Content updated", content: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to update content" });
  }
});

//delete content for admin
router.delete("/:content_id", adminAuth, async (req, res) => {
  try {

    console.log("🔍 Attempting to delete content ID:", req.params.content_id);

    const result = await db.query(
      "DELETE FROM content WHERE content_id = $1 RETURNING *",
      [req.params.content_id]
    );

    console.log("🗑️ Deletion result:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.json({ message: "Content deleted", deleted: result.rows[0] });
  } catch (err) {
    console.error("❌ Content deletion error:", err.message);
    res.status(500).json({ error: "Failed to delete content" });
  }
});

//read all content for admin
router.get("/all", adminAuth, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM content ORDER BY time DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Failed to fetch all content:", err.message);
    res.status(500).json({ error: "Failed to fetch all content" });
  }
});


export default router;