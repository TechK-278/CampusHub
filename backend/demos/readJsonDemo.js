/**
 * CampusHub — Practical 2 (Requirement II)
 * External JSON File Reading Demonstration
 *
 * Objective: Read and display structured content from an external JSON file
 * using Node.js filesystem operations.
 */

const fs = require("fs");
const path = require("path");

console.log("==================================================");
console.log("CampusHub — Practical 2: External JSON File Reader");
console.log("Requirement II: Reading & parsing external demo.json");
console.log("==================================================");

// Resolve path to the external JSON file
const filePath = path.join(__dirname, "..", "data", "demo.json");

console.log(`[1] Locating external file: ${path.basename(filePath)}`);
console.log(`    Absolute Path: ${filePath}`);

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found at ${filePath}`);
  process.exit(1);
}

try {
  // Read file contents asynchronously via fs.readFile
  console.log("\n[2] Reading file content synchronously via fs.readFileSync...");
  const rawData = fs.readFileSync(filePath, "utf8");
  console.log(`    File Size: ${Buffer.byteLength(rawData, "utf8")} bytes`);

  // Parse JSON data
  console.log("\n[3] Parsing raw JSON string to JavaScript Object...");
  const parsedData = JSON.parse(rawData);

  // Display structured values
  console.log("\n[4] Displaying Parsed Academic Records:");
  console.log("--------------------------------------------------");
  console.log(`Application : ${parsedData.application} (${parsedData.portalSubtitle})`);
  console.log(`Session     : ${parsedData.academicSession} | Version: ${parsedData.version}`);
  console.log(`Student     : ${parsedData.student.name} (${parsedData.student.rollNo})`);
  console.log(`Department  : ${parsedData.student.department}`);
  console.log(`Semester    : ${parsedData.student.semester} - Division ${parsedData.student.division}`);
  console.log(`Attendance  : ${parsedData.student.attendancePercentage}%`);
  console.log(`Current CGPA: ${parsedData.student.currentCGPA}`);
  
  console.log("\n[5] Enrolled Courses List from JSON:");
  parsedData.enrolledCourses.forEach((c, idx) => {
    console.log(`    ${idx + 1}. [${c.code}] ${c.title} (${c.credits} Credits, Faculty: ${c.faculty})`);
  });

  console.log("\n[6] Active Circulars / Notices from JSON:");
  parsedData.notices.forEach((n, idx) => {
    console.log(`    ${idx + 1}. [${n.category}] ${n.title} (Issued: ${n.date})`);
  });

  console.log("--------------------------------------------------");
  console.log("External JSON file successfully read, parsed, and displayed.");
  console.log("==================================================");

} catch (err) {
  console.error("Failed to read or parse external JSON file:", err.message);
  process.exit(1);
}
