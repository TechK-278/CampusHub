/**
 * CampusHub — Practical 8: Database Initializer & Migration Script
 * Runs schema creation, stored functions, and initial seed data.
 */

const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

async function initDatabase() {
  console.log("==================================================");
  console.log(" CampusHub — Initializing MySQL Database (Practical 8)");
  console.log("==================================================");

  const rootConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "system"
  };

  try {
    // 1. Connect without database to create campushub if not exists
    console.log("[1] Connecting to MySQL server at " + rootConfig.host + ":" + rootConfig.port + "...");
    const rootConn = await mysql.createConnection(rootConfig);
    
    console.log("[2] Executing: CREATE DATABASE IF NOT EXISTS campushub...");
    await rootConn.query("CREATE DATABASE IF NOT EXISTS campushub");
    await rootConn.end();

    // 2. Connect directly to campushub database
    const dbConn = await mysql.createConnection({
      ...rootConfig,
      database: process.env.DB_NAME || "campushub",
      multipleStatements: true
    });

    // 3. Create Students Table
    console.log("[3] Executing: CREATE TABLE IF NOT EXISTS students...");
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS students (
        id INT PRIMARY KEY AUTO_INCREMENT,
        roll_number VARCHAR(20) NOT NULL UNIQUE,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        mobile VARCHAR(15) NOT NULL,
        department VARCHAR(100) NOT NULL,
        semester INT NOT NULL,
        division VARCHAR(10) NOT NULL DEFAULT 'A',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await dbConn.query(createTableSql);

    // 4. Create User-Defined Function: calculate_grade
    console.log("[4] Creating User-Defined Function: calculate_grade(score)...");
    await dbConn.query("DROP FUNCTION IF EXISTS calculate_grade;");
    const createFunctionSql = `
      CREATE FUNCTION calculate_grade(score INT)
      RETURNS VARCHAR(15)
      DETERMINISTIC
      BEGIN
        DECLARE grade_letter VARCHAR(15);
        IF score >= 85 THEN
          SET grade_letter = 'AA (10)';
        ELSEIF score >= 75 THEN
          SET grade_letter = 'AB (9)';
        ELSEIF score >= 65 THEN
          SET grade_letter = 'BB (8)';
        ELSEIF score >= 55 THEN
          SET grade_letter = 'BC (7)';
        ELSEIF score >= 45 THEN
          SET grade_letter = 'CC (6)';
        ELSEIF score >= 35 THEN
          SET grade_letter = 'CD (5)';
        ELSE
          SET grade_letter = 'FF (Fail)';
        END IF;
        RETURN grade_letter;
      END
    `;
    await dbConn.query(createFunctionSql);

    // 5. Seed Fictional Academic Records
    console.log("[5] Seeding initial fictional academic records into students table...");
    const seedSql = `
      INSERT INTO students (roll_number, first_name, last_name, email, mobile, department, semester, division)
      VALUES
      ('CS2026001', 'Aarav', 'Mehta', 'aarav.mehta@university.edu', '9876543210', 'Computer Science & Engineering', 5, 'A'),
      ('CS2026002', 'Diya', 'Shah', 'diya.shah@university.edu', '9823456781', 'Computer Science & Engineering', 5, 'A'),
      ('IT2026015', 'Rohan', 'Patel', 'rohan.patel@university.edu', '9712345678', 'Information Technology', 5, 'B'),
      ('EC2026030', 'Ananya', 'Sharma', 'ananya.sharma@university.edu', '9834567890', 'Electronics & Communication', 5, 'A'),
      ('ME2026042', 'Kabir', 'Joshi', 'kabir.joshi@university.edu', '9890123456', 'Mechanical Engineering', 5, 'B')
      ON DUPLICATE KEY UPDATE first_name=VALUES(first_name);
    `;
    await dbConn.query(seedSql);

    // 6. Verify Table Data & Function
    const [students] = await dbConn.query("SELECT id, roll_number, first_name, last_name, department FROM students");
    console.log(`[6] Verification: ${students.length} student records found in MySQL.`);

    const [testGrade] = await dbConn.query("SELECT calculate_grade(92) AS test_grade");
    console.log(`[7] Verification: MySQL UDF calculate_grade(92) = "${testGrade[0].test_grade}"`);

    await dbConn.end();
    console.log("==================================================");
    console.log(" MySQL Database Initialization Completed Successfully.");
    console.log("==================================================");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
