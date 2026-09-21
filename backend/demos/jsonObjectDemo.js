/**
 * CampusHub — JSON Object Demonstration
 * Practical 1: Reading, Manipulating, and Traversing JSON Data
 */

const fs = require("fs");
const path = require("path");

console.log("==================================================");
console.log("CampusHub — JSON Object Demonstration");
console.log("Practical 1: Handling Structured JSON Data in Node.js");
console.log("==================================================");

// 1. Path resolution to sample JSON file
const dataFilePath = path.join(__dirname, "..", "data", "demo.json");

try {
  // 2. Read JSON file synchronously
  const rawData = fs.readFileSync(dataFilePath, "utf8");
  
  // 3. Parse JSON string into a JavaScript Object
  const campusData = JSON.parse(rawData);

  console.log("\n[1] Application Header:");
  console.log(`    Application : ${campusData.application}`);
  console.log(`    Subtitle    : ${campusData.portalSubtitle}`);
  console.log(`    Session     : ${campusData.academicSession}`);
  console.log(`    Version     : ${campusData.version}`);

  console.log("\n[2] Student Details:");
  const student = campusData.student;
  console.log(`    Roll Number : ${student.rollNo}`);
  console.log(`    Name        : ${student.name}`);
  console.log(`    Program     : ${student.program} ${student.department}`);
  console.log(`    Semester    : ${student.semester} (Division ${student.division}, Batch ${student.batch})`);
  console.log(`    Attendance  : ${student.attendancePercentage}%`);
  console.log(`    Current CGPA: ${student.currentCGPA}`);
  console.log(`    Mentor      : ${student.mentor}`);

  console.log("\n[3] Enrolled Courses Catalog:");
  campusData.enrolledCourses.forEach((course, index) => {
    console.log(`    ${index + 1}. [${course.code}] ${course.title} (${course.credits} Credits) - Faculty: ${course.faculty}`);
  });

  console.log("\n[4] Pending Assignments Summary:");
  const pendingAssignments = campusData.assignments.filter(a => a.status !== "Completed");
  console.log(`    Total Pending: ${pendingAssignments.length}`);
  pendingAssignments.forEach((assignment, index) => {
    console.log(`    ${index + 1}. [${assignment.courseCode}] ${assignment.title} (Due: ${assignment.dueDate}, Status: ${assignment.status})`);
  });

  // 4. In-Memory JSON Object Creation and Serialization Demo
  console.log("\n[5] Creating & Serializing New JSON Object:");
  const newActivityLog = {
    eventType: "DEMO_VERIFICATION",
    executedBy: "PracticalEvaluator",
    timestamp: new Date().toISOString(),
    status: "SUCCESS",
    details: {
      studentRoll: student.rollNo,
      verifiedCourses: campusData.enrolledCourses.length
    }
  };

  const serializedJson = JSON.stringify(newActivityLog, null, 2);
  console.log(serializedJson);

  console.log("\n==================================================");
  console.log("JSON Demonstration Executed Successfully.");
  console.log("==================================================");

} catch (err) {
  console.error("Error reading or parsing demo.json:", err.message);
  process.exit(1);
}
