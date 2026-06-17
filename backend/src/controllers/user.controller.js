import { pool } from "../config/db.js";

export async function getUsers(_req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function createStudentLogin(req, res, next) {
  const { fullName, email } = req.body;

  if (!fullName?.trim() || !email?.trim()) {
    return res.status(400).json({
      message: "Full name and email are required."
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = fullName.trim();

    const result = await pool.query(
      `
        INSERT INTO users (full_name, email, role)
        VALUES ($1, $2, 'student')
        ON CONFLICT (email)
        DO UPDATE SET full_name = EXCLUDED.full_name
        RETURNING id, full_name, email, role, created_at
      `,
      [normalizedName, normalizedEmail]
    );

    res.status(201).json({
      message: "Student login saved successfully.",
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

export async function createAdminLogin(req, res, next) {
  const { fullName, email } = req.body;

  if (!fullName?.trim() || !email?.trim()) {
    return res.status(400).json({
      message: "Full name and email are required."
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = fullName.trim();

    const result = await pool.query(
      `
        INSERT INTO users (full_name, email, role)
        VALUES ($1, $2, 'admin')
        ON CONFLICT (email)
        DO UPDATE SET full_name = EXCLUDED.full_name, role = 'admin'
        RETURNING id, full_name, email, role, created_at
      `,
      [normalizedName, normalizedEmail]
    );

    res.status(201).json({
      message: "Admin login saved successfully.",
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}
