import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.pgSsl ? { rejectUnauthorized: false } : false
});

export async function checkDatabaseConnection() {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT NOW() AS current_time");
    return result.rows[0];
  } finally {
    client.release();
  }
}

