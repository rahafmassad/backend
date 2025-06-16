import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const role = "user";

    const result = await db.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
      [email, password, role]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    if (user.role === "admin") {
      return res.json({
        message: "Welcome, Admin!",
        redirectTo: "/admin-dashboard",
        user
      });
    }

    res.json({
      message: "Login successful",
      redirectTo: "/user-dashboard",
      user
    });

  } catch (err) {
    console.error("Signin error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;