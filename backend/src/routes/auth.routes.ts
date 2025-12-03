import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { pool } from "../config/db";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT id, username, email, level, points FROM users WHERE id=$1",
      [userId]
    );

    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    // Optional: fetch recent games
    const gamesRes = await pool.query(
      "SELECT name, score, created_at FROM games WHERE user_id=$1 ORDER BY created_at DESC LIMIT 5",
      [userId]
    );

    user.recentGames = gamesRes.rows;

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
