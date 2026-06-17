import { checkDatabaseConnection } from "../config/db.js";

export async function getHealth(_req, res, next) {
  try {
    const db = await checkDatabaseConnection();

    res.json({
      status: "ok",
      service: "backend",
      database: "connected",
      timestamp: new Date().toISOString(),
      dbTime: db.current_time
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      service: "backend",
      database: "disconnected",
      timestamp: new Date().toISOString(),
      message: "Database connection failed.",
      error: error.message
    });
  }
}
