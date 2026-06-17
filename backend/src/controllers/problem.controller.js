import { pool } from "../config/db.js";

export async function getProblems(_req, res, next) {
  try {
    const result = await pool.query(
      `
        SELECT id, title, difficulty, statement, created_at
        FROM problems
        ORDER BY
          CASE difficulty
            WHEN 'easy' THEN 1
            WHEN 'medium' THEN 2
            WHEN 'hard' THEN 3
            ELSE 4
          END,
          created_at DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function getProblemById(req, res, next) {
  const { problemId } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT id, title, difficulty, statement, created_at
        FROM problems
        WHERE id = $1
      `,
      [problemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Coding question not found."
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function createProblem(req, res, next) {
  const { title, difficulty, statement } = req.body;

  if (!title?.trim() || !difficulty?.trim() || !statement?.trim()) {
    return res.status(400).json({
      message: "Title, difficulty, and statement are required."
    });
  }

  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return res.status(400).json({
      message: "Difficulty must be easy, medium, or hard."
    });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO problems (title, difficulty, statement)
        VALUES ($1, $2, $3)
        RETURNING id, title, difficulty, statement, created_at
      `,
      [title.trim(), difficulty.trim().toLowerCase(), statement.trim()]
    );

    res.status(201).json({
      message: "Coding question added successfully.",
      problem: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProblem(req, res, next) {
  const { problemId } = req.params;
  const { title, difficulty, statement } = req.body;

  if (!title?.trim() || !difficulty?.trim() || !statement?.trim()) {
    return res.status(400).json({
      message: "Title, difficulty, and statement are required."
    });
  }

  if (!["easy", "medium", "hard"].includes(difficulty.trim().toLowerCase())) {
    return res.status(400).json({
      message: "Difficulty must be easy, medium, or hard."
    });
  }

  try {
    const result = await pool.query(
      `
        UPDATE problems
        SET title = $1, difficulty = $2, statement = $3
        WHERE id = $4
        RETURNING id, title, difficulty, statement, created_at
      `,
      [title.trim(), difficulty.trim().toLowerCase(), statement.trim(), problemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Coding question not found."
      });
    }

    res.json({
      message: "Coding question updated successfully.",
      problem: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProblem(req, res, next) {
  const { problemId } = req.params;

  try {
    const result = await pool.query(
      `
        DELETE FROM problems
        WHERE id = $1
        RETURNING id
      `,
      [problemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Coding question not found."
      });
    }

    res.json({
      message: "Coding question deleted successfully."
    });
  } catch (error) {
    next(error);
  }
}
