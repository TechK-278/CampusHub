/**
 * CampusHub — User Administration Routes (Admin Only)
 * Practical 9: RBAC User Management
 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

// All user management routes require Authentication + Admin role
router.use(authenticateToken);
router.use(authorizeRoles("admin"));

// List users
router.get("/", userController.getUsers);

// Create user
router.post("/", userController.createUser);

// Update user role / name
router.put("/:id", userController.updateUser);

// Delete user
router.delete("/:id", userController.deleteUser);

module.exports = router;
