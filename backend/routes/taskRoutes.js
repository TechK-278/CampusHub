/**
 * CampusHub — Task Routes
 * Phase 2: REST API Endpoints for Task Management
 * Practical 9: RBAC Enforcement (Authenticated Users)
 */

const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { authenticateToken } = require("../middleware/auth");

// All task operations require valid authentication
router.use(authenticateToken);

// REST Endpoints
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;

