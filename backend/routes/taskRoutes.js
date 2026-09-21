/**
 * CampusHub — Task Routes
 * Phase 2: REST API Endpoints for Task Management
 */

const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// REST Endpoints
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
