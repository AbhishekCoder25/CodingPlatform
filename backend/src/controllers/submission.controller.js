import { pool } from "../config/db.js";

function evaluateSubmission({ sourceCode, language, difficulty }) {
  const normalized = sourceCode.toLowerCase();
  const forCount = (normalized.match(/\bfor\b/g) || []).length;
  const whileCount = (normalized.match(/\bwhile\b/g) || []).length;
  const hasReturn = normalized.includes("return");
  const hasFunctionLike =
    normalized.includes("function") ||
    normalized.includes("def ") ||
    normalized.includes("public static") ||
    normalized.includes("int main") ||
    normalized.includes("=>");

  if ((difficulty === "hard" || difficulty === "medium") && forCount + whileCount >= 3) {
    return "time_limit";
  }

  if (sourceCode.trim().length >= 80 && hasReturn && hasFunctionLike) {
    return "accepted";
  }

  if (language === "python" && normalized.includes("print") && sourceCode.trim().length >= 60) {
    return "accepted";
  }

  return "wrong_answer";
}

export async function createSubmission(req, res, next) {
  const { studentId, problemId, language, sourceCode } = req.body;

  if (!studentId || !problemId || !language?.trim() || !sourceCode?.trim()) {
    return res.status(400).json({
      message: "Student, problem, language, and source code are required."
    });
  }

  try {
    const problemResult = await pool.query(
      `
        SELECT id, difficulty
        FROM problems
        WHERE id = $1
      `,
      [problemId]
    );

    if (problemResult.rows.length === 0) {
      return res.status(404).json({
        message: "Coding question not found."
      });
    }

    const studentResult = await pool.query(
      `
        SELECT id
        FROM users
        WHERE id = $1 AND role = 'student'
      `,
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        message: "Student not found."
      });
    }

    const normalizedLanguage = language.trim().toLowerCase();
    const status = evaluateSubmission({
      sourceCode,
      language: normalizedLanguage,
      difficulty: problemResult.rows[0].difficulty
    });

    const result = await pool.query(
      `
        INSERT INTO submissions (student_id, problem_id, language, source_code, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, student_id, problem_id, language, source_code, status, submitted_at
      `,
      [studentId, problemId, normalizedLanguage, sourceCode.trim(), status]
    );

    res.status(201).json({
      message: "Solution submitted successfully.",
      submission: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentSubmissions(req, res, next) {
  const { studentId } = req.params;
  const { problemId } = req.query;

  try {
    const values = [studentId];
    let problemFilter = "";

    if (problemId) {
      values.push(problemId);
      problemFilter = "AND s.problem_id = $2";
    }

    const result = await pool.query(
      `
        SELECT
          s.id,
          s.problem_id,
          p.title AS problem_title,
          p.difficulty,
          s.language,
          s.source_code,
          s.status,
          s.submitted_at
        FROM submissions s
        JOIN problems p ON p.id = s.problem_id
        WHERE s.student_id = $1
        ${problemFilter}
        ORDER BY s.submitted_at DESC
      `,
      values
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function getStudentProgress(req, res, next) {
  const { studentId } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT
          p.difficulty,
          COUNT(s.id)::int AS total_submissions,
          COUNT(*) FILTER (WHERE s.status = 'accepted')::int AS accepted_submissions,
          COUNT(*) FILTER (WHERE s.status = 'wrong_answer')::int AS wrong_answer_submissions,
          COUNT(*) FILTER (WHERE s.status = 'time_limit')::int AS time_limit_submissions
        FROM problems p
        LEFT JOIN submissions s
          ON s.problem_id = p.id
         AND s.student_id = $1
        GROUP BY p.difficulty
      `,
      [studentId]
    );

    const progressMap = {
      easy: {
        difficulty: "easy",
        total_submissions: 0,
        accepted_submissions: 0,
        wrong_answer_submissions: 0,
        time_limit_submissions: 0
      },
      medium: {
        difficulty: "medium",
        total_submissions: 0,
        accepted_submissions: 0,
        wrong_answer_submissions: 0,
        time_limit_submissions: 0
      },
      hard: {
        difficulty: "hard",
        total_submissions: 0,
        accepted_submissions: 0,
        wrong_answer_submissions: 0,
        time_limit_submissions: 0
      }
    };

    for (const row of result.rows) {
      if (progressMap[row.difficulty]) {
        progressMap[row.difficulty] = row;
      }
    }

    res.json(Object.values(progressMap));
  } catch (error) {
    next(error);
  }
}
