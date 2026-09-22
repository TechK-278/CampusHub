/**
 * CampusHub — MySQL Database Connection Pool
 * Practical 8: Node.js + MySQL Integration
 */

const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "system",
  database: process.env.DB_NAME || "campushub",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Create reusable connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Reusable parameterized query execution
 * @param {string} sql - Parameterized SQL string with '?' placeholders
 * @param {Array} params - Array of parameter values
 */
async function query(sql, params = []) {
  const [results] = await pool.execute(sql, params);
  return results;
}

/**
 * Health check querying database connectivity
 */
async function checkHealth() {
  try {
    const [rows] = await pool.query("SELECT 1 AS status, DATABASE() as db_name, VERSION() as version");
    const [countRow] = await pool.query("SELECT COUNT(*) AS total_students FROM students");
    return {
      connected: true,
      database: rows[0].db_name || dbConfig.database,
      version: rows[0].version,
      totalStudents: countRow[0].total_students
    };
  } catch (error) {
    return {
      connected: false,
      database: dbConfig.database,
      error: error.message,
      code: error.code
    };
  }
}

module.exports = {
  pool,
  query,
  checkHealth,
  dbConfig
};
