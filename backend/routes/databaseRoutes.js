/**
 * CampusHub — Database Health & Status Routes
 * Practical 8: MySQL Connection Status
 */

const express = require("express");
const router = express.Router();
const { checkHealth } = require("../config/db");

// Health check endpoint (SELECT 1)
router.get("/health", async (req, res) => {
  const status = await checkHealth();
  if (status.connected) {
    res.json({
      status: "connected",
      database: status.database,
      version: status.version,
      totalStudents: status.totalStudents,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: "disconnected",
      database: status.database,
      error: status.error,
      code: status.code,
      message: "MySQL database is unreachable. Verify MySQL service is active on port 3306."
    });
  }
});

module.exports = router;
