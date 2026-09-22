/**
 * CampusHub — Student Routes
 * Practical 8: Node.js + MySQL Routes
 */

const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Requirement 5: SELECT UNIQUE — Distinct departments
router.get("/departments", studentController.getDistinctDepartments);

// Requirement 9: MySQL Stored User-Defined Function
router.get("/calculate-grade", studentController.calculateGradeWithUDF);

// Requirement 8: Controlled DROP TABLE demo
router.post("/demo-drop-table", studentController.demoDropTable);

// Requirement 4: SELECT all students
router.get("/", studentController.getAllStudents);

// Requirement 4: SELECT student by ID
router.get("/:id", studentController.getStudentById);

// Requirement 3: INSERT student
router.post("/", studentController.createStudent);

// Requirement 6: UPDATE student
router.put("/:id", studentController.updateStudent);

// Requirement 7: DELETE student
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
