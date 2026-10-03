/**
 * CampusHub — Authentication Routes
 * Practical 9: RBAC & JWT Sign-in/Sign-out Endpoints
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

// Public: Sign in
router.post("/login", authController.login);

// Authenticated: Get current active user profile
router.get("/me", authenticateToken, authController.getMe);

// Authenticated: Sign out
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
