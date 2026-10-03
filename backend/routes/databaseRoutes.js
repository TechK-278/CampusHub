/**
 * CampusHub — Database Health & Status Routes
 * Practical 8: MySQL Connection Status
 * Practical 9: RBAC Enforcement (Admin Only)
 */

const express = require("express");
const router = express.Router();
const { checkHealth } = require("../config/db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

// Require authentication & admin role for database health/admin inspection
router.use(authenticateToken);
router.use(authorizeRoles("admin"));

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

// Alias for /api/database
router.get("/", async (req, res) => {
  const status = await checkHealth();
  res.json({
    success: true,
    database: status
  });
});

module.exports = router;

