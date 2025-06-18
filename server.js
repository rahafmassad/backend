import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./Routes/Auth.js";
import userRoutes from "./Routes/Users.js";
import db from './db.js';
import contentRoutes from "./Routes/Content.js";
import chatRoutes from "./Routes/Chat.js";
import searchRoutes from "./Routes/Search.js";
import likeRoutes from "./Routes/Likes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // 

app.use(express.json({ limit: '50mb' })); //for profile picture
app.use(express.urlencoded({ extended: true, limit: '50mb' })); //for profile picture
app.use(cors());
app.use(morgan("dev"));

// localhost:5000
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/likes", likeRoutes);

app.get("/", (req, res) => {
  res.send("Store API (PostgreSQL) is running");
});

try {
  await db.connect();
  console.log("Connected to PostgreSQL");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error("Failed to connect to DB:", err.stack);
  process.exit(1);
}