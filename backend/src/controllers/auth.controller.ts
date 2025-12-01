import { Request, Response } from "express";
import { pool } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id, username, email",
      [username, email, hashed]
    );

    res.status(201).json({
      message: "User created successfully",
      user: newUser.rows[0],
    });

  } catch (error: any) {
  console.error("AUTH ERROR 👉", error.message);
  res.status(500).json({
    error: error.message,
    stack: error.stack
  });
}

};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login success",
      token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email,
      },
    });

  } catch (error) {
    res.status(500).json({ error });
  }
};
