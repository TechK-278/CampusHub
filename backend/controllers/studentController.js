/**
 * CampusHub — Student Controller
 * Practical 8: Node.js + MySQL CRUD & Stored Functions
 */

const { query } = require("../config/db");

/**
 * Requirement 4: SELECT — Get all students with optional search/filter
 * GET /api/students
 */
exports.getAllStudents = async (req, res) => {
  try {
    const { department, search } = req.query;
    let sql = "SELECT * FROM students WHERE 1=1";
    const params = [];

    if (department && department !== "all") {
      sql += " AND department = ?";
      params.push(department);
    }

    if (search && search.trim()) {
      const searchPattern = `%${search.trim()}%`;
      sql += " AND (first_name LIKE ? OR last_name LIKE ? OR roll_number LIKE ? OR email LIKE ?)";
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    sql += " ORDER BY id DESC";

    const students = await query(sql, params);
    res.json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({
      success: false,
      error: "Database error while fetching student records.",
      details: error.message
    });
  }
};

/**
 * Requirement 4: SELECT — Get single student by ID
 * GET /api/students/:id
 */
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const students = await query("SELECT * FROM students WHERE id = ?", [id]);

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Student with ID ${id} not found.`
      });
    }

    res.json({
      success: true,
      student: students[0]
    });
  } catch (error) {
    console.error("Error fetching student:", error.message);
    res.status(500).json({
      success: false,
      error: "Database error while fetching student record.",
      details: error.message
    });
  }
};

/**
 * Requirement 5: SELECT UNIQUE — Get distinct departments
 * GET /api/students/departments
 */
exports.getDistinctDepartments = async (req, res) => {
  try {
    const rows = await query("SELECT DISTINCT department FROM students ORDER BY department ASC");
    const departments = rows.map((r) => r.department).filter(Boolean);

    res.json({
      success: true,
      count: departments.length,
      departments
    });
  } catch (error) {
    console.error("Error fetching departments:", error.message);
    res.status(500).json({
      success: false,
      error: "Database error while fetching distinct departments.",
      details: error.message
    });
  }
};

/**
 * Requirement 3: INSERT — Create new student
 * POST /api/students
 */
exports.createStudent = async (req, res) => {
  try {
    const { roll_number, first_name, last_name, email, mobile, department, semester, division } = req.body;

    // Backend Validation
    if (!roll_number || !first_name || !last_name || !email || !mobile || !department) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: roll_number, first_name, last_name, email, mobile, department are mandatory."
      });
    }

    if (!/^[a-zA-Z0-9_-]{4,20}$/.test(roll_number.trim())) {
      return res.status(400).json({
        success: false,
        error: "Invalid roll_number format. Must be 4-20 alphanumeric characters."
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format."
      });
    }

    if (!/^[0-9+\s-]{8,15}$/.test(mobile.trim())) {
      return res.status(400).json({
        success: false,
        error: "Invalid mobile number format."
      });
    }

    const semInt = parseInt(semester || "1", 10);
    if (isNaN(semInt) || semInt < 1 || semInt > 8) {
      return res.status(400).json({
        success: false,
        error: "Semester must be an integer between 1 and 8."
      });
    }

    const insertSql = `
      INSERT INTO students (roll_number, first_name, last_name, email, mobile, department, semester, division)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(insertSql, [
      roll_number.trim().toUpperCase(),
      first_name.trim(),
      last_name.trim(),
      email.trim().toLowerCase(),
      mobile.trim(),
      department.trim(),
      semInt,
      (division || "A").trim().toUpperCase()
    ]);

    const newStudent = await query("SELECT * FROM students WHERE id = ?", [result.insertId]);

    res.status(201).json({
      success: true,
      message: "Student record inserted successfully into MySQL database.",
      student: newStudent[0]
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        error: "Duplicate entry: A student with this Roll Number or Email ID already exists in MySQL."
      });
    }
    console.error("Error creating student:", error.message);
    res.status(500).json({
      success: false,
      error: "Database error while creating student record.",
      details: error.message
    });
  }
};

/**
 * Requirement 6: UPDATE — Update existing student record
 * PUT /api/students/:id
 */
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { roll_number, first_name, last_name, email, mobile, department, semester, division } = req.body;

    const existing = await query("SELECT * FROM students WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Student with ID ${id} does not exist.`
      });
    }

    if (!roll_number || !first_name || !last_name || !email || !mobile || !department) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields for update."
      });
    }

    const semInt = parseInt(semester || "1", 10);

    const updateSql = `
      UPDATE students
      SET roll_number = ?, first_name = ?, last_name = ?, email = ?, mobile = ?, department = ?, semester = ?, division = ?
      WHERE id = ?
    `;

    await query(updateSql, [
      roll_number.trim().toUpperCase(),
      first_name.trim(),
      last_name.trim(),
      email.trim().toLowerCase(),
      mobile.trim(),
      department.trim(),
      semInt,
      (division || "A").trim().toUpperCase(),
      id
    ]);

    const updated = await query("SELECT * FROM students WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Student record updated successfully in MySQL database.",
      student: updated[0]
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        error: "Duplicate entry: Roll number or email already in use by another student."
      });
    }
    console.error("Error updating student:", error.message);
    res.status(500).json({
      success: false,
      error: "Database error while updating student record.",
      details: error.message
    });
  }
};

/**
 * Requirement 7: DELETE — Delete student record
 * DELETE /api/students/:id
 */
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query("SELECT * FROM students WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Student with ID ${id} not found.`
      });
    }

    await query("DELETE FROM students WHERE id = ?", [id]);

    res.json({
      success: true,
      message: `Student '${existing[0].first_name} ${existing[0].last_name}' (${existing[0].roll_number}) deleted successfully from MySQL.`,
      deletedId: parseInt(id, 10)
    });
  } catch (error) {
    console.error("Error deleting student:", error.message);
    res.status(500).json({
      success: false,
      error: "Database error while deleting student record.",
      details: error.message
    });
  }
};

/**
 * Requirement 9: USER-DEFINED FUNCTION — Execute calculate_grade(score)
 * GET /api/students/calculate-grade?score=...
 */
exports.calculateGradeWithUDF = async (req, res) => {
  try {
    const score = parseInt(req.query.score ?? "85", 10);

    if (isNaN(score) || score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        error: "Score must be a number between 0 and 100."
      });
    }

    const [result] = await query("SELECT calculate_grade(?) AS grade", [score]);

    res.json({
      success: true,
      score,
      grade: result.grade,
      udf: "calculate_grade(score)",
      sql: `SELECT calculate_grade(${score}) AS grade;`
    });
  } catch (error) {
    console.error("Error invoking UDF:", error.message);
    res.status(500).json({
      success: false,
      error: "Database error while executing MySQL User-Defined Function.",
      details: error.message
    });
  }
};

/**
 * Requirement 8: DROP TABLE DEMO — Controlled educational demonstration
 * POST /api/students/demo-drop-table
 */
exports.demoDropTable = async (req, res) => {
  try {
    const { confirmDrop } = req.body;

    if (!confirmDrop) {
      return res.status(400).json({
        success: false,
        error: "Action aborted: confirmDrop authorization flag must be true to execute DROP TABLE demo."
      });
    }

    // Create temporary demonstration table
    await query(`
      CREATE TABLE IF NOT EXISTS campushub_temp_demo (
        id INT PRIMARY KEY AUTO_INCREMENT,
        demo_note VARCHAR(100)
      )
    `);

    // Execute DROP TABLE
    await query("DROP TABLE IF EXISTS campushub_temp_demo");

    res.json({
      success: true,
      message: "Demonstration executed: 'DROP TABLE IF EXISTS campushub_temp_demo' completed safely without affecting production data.",
      sql: "DROP TABLE IF EXISTS campushub_temp_demo;"
    });
  } catch (error) {
    console.error("Error during drop table demo:", error.message);
    res.status(500).json({
      success: false,
      error: "Database error during DROP TABLE demonstration.",
      details: error.message
    });
  }
};
