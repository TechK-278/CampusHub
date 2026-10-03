/**
 * CampusHub — Student Routes
 * Practical 8: Node.js + MySQL Routes
 * Practical 9: RBAC Enforcement (Faculty & Admin access, Admin only for DELETE and DROP demo)
 */

const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

// All student management endpoints require authentication
router.use(authenticateToken);

// Requirement 5: SELECT UNIQUE — Distinct departments (Faculty & Admin)
router.get("/departments", authorizeRoles("faculty", "admin"), studentController.getDistinctDepartments);

// Requirement 9: MySQL Stored User-Defined Function (Faculty & Admin)
router.get("/calculate-grade", authorizeRoles("faculty", "admin"), studentController.calculateGradeWithUDF);

// Requirement 8: Controlled DROP TABLE demo (Admin only, disabled in production)
router.post("/demo-drop-table", authorizeRoles("admin"), (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({
      success: false,
      error: "DROP TABLE demonstration is strictly disabled in production mode."
    });
  }
  next();
}, studentController.demoDropTable);

// Requirement 4: SELECT all students (Faculty & Admin)
router.get("/", authorizeRoles("faculty", "admin"), studentController.getAllStudents);

// Requirement 4: SELECT student by ID (Faculty & Admin)
router.get("/:id", authorizeRoles("faculty", "admin"), studentController.getStudentById);

// Requirement 3: INSERT student (Faculty & Admin)
router.post("/", authorizeRoles("faculty", "admin"), studentController.createStudent);

// Requirement 6: UPDATE student (Faculty & Admin)
router.put("/:id", authorizeRoles("faculty", "admin"), studentController.updateStudent);

// Requirement 7: DELETE student (Admin Only)
router.delete("/:id", authorizeRoles("admin"), studentController.deleteStudent);

module.exports = router;

