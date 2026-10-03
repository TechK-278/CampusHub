/**
 * CampusHub — Protected Verification Routes
 * Practical 9: RBAC Demonstration Endpoints (401 vs 403 Verification)
 */

const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

// Profile endpoint — Accessible to all authenticated users (student, faculty, admin)
router.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile access verified.",
    resource: "profile",
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      full_name: req.user.full_name
    }
  });
});

// Academic endpoint — Accessible to Faculty & Admin only
router.get("/academic", authenticateToken, authorizeRoles("faculty", "admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Academic administration records access granted.",
    resource: "academic",
    authorizedRole: req.user.role
  });
});

// Admin endpoint — Accessible to Admin only
router.get("/admin", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Administrative system console access granted.",
    resource: "admin",
    authorizedRole: req.user.role
  });
});

module.exports = router;
