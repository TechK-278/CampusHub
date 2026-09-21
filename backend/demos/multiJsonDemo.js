/**
 * CampusHub — Practical 2 (Requirement III)
 * Multi-dimensional JSON Arrays & Element Access Demonstration
 *
 * Objective: Create and display multi-dimensional JSON arrays representing
 * academic departments, courses, student batches, and practical grades,
 * demonstrating precise indexed access to nested multidimensional elements.
 */

console.log("==================================================");
console.log("CampusHub — Practical 2: Multi-dimensional JSON Arrays");
console.log("Requirement III: Complex nested array structure & access");
console.log("==================================================");

// 1. Defining a Multi-dimensional JSON Data Structure
// Hierarchy: Departments -> Semesters -> Courses -> Student Batches -> Practical Evaluations
const academicStructure = {
  institution: "CampusHub Academic Network",
  academicYear: "2025-2026",
  departments: [
    {
      deptId: "D-CSE",
      name: "Computer Science and Engineering",
      headOfDepartment: "Dr. Alok Verma",
      semesters: [
        {
          semNumber: 5,
          totalStudents: 120,
          courses: [
            {
              courseCode: "CS501",
              title: "Full Stack Web Development",
              credits: 4,
              practicals: [
                {
                  pracNumber: 1,
                  topic: "Server-Side JavaScript & Node.js Environment",
                  maxMarks: 50,
                  studentSubmissions: [
                    { rollNo: "CS2026001", studentName: "Aarav Mehta", score: 48, status: "Evaluated" },
                    { rollNo: "CS2026002", studentName: "Riya Shah", score: 46, status: "Evaluated" },
                    { rollNo: "CS2026003", studentName: "Kabir Patel", score: 49, status: "Evaluated" }
                  ]
                },
                {
                  pracNumber: 2,
                  topic: "JSON Operations & Web Task Management",
                  maxMarks: 50,
                  studentSubmissions: [
                    { rollNo: "CS2026001", studentName: "Aarav Mehta", score: 50, status: "Verified" },
                    { rollNo: "CS2026002", studentName: "Riya Shah", score: 47, status: "Evaluated" }
                  ]
                }
              ]
            },
            {
              courseCode: "CS502",
              title: "Database Management Systems",
              credits: 4,
              practicals: [
                {
                  pracNumber: 1,
                  topic: "Relational Schema Design & E-R Modeling",
                  maxMarks: 30,
                  studentSubmissions: [
                    { rollNo: "CS2026001", studentName: "Aarav Mehta", score: 28, status: "Evaluated" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      deptId: "D-IT",
      name: "Information Technology",
      headOfDepartment: "Dr. Sunita Rao",
      semesters: [
        {
          semNumber: 5,
          totalStudents: 60,
          courses: [
            {
              courseCode: "IT501",
              title: "Web Services & REST Architectures",
              credits: 4,
              practicals: []
            }
          ]
        }
      ]
    }
  ]
};

// 2. Displaying Full JSON Tree Representation
console.log("\n[1] Serialized Multi-dimensional JSON Structure:");
console.log(JSON.stringify(academicStructure, null, 2));

// 3. Demonstrating Precise Multi-Dimensional Array Indexed Access
console.log("\n==================================================");
console.log("[2] Demonstrating Multi-dimensional Element Access:");
console.log("==================================================");

// Access 1: Department Level (departments[0])
const dept0 = academicStructure.departments[0];
console.log(`• Department [0] Name: "${dept0.name}" (HOD: ${dept0.headOfDepartment})`);

// Access 2: Semester Level (departments[0].semesters[0])
const sem5 = academicStructure.departments[0].semesters[0];
console.log(`• Semester [0][0] Number: Semester ${sem5.semNumber} (Enrolled Students: ${sem5.totalStudents})`);

// Access 3: Course Level (departments[0].semesters[0].courses[0])
const courseCS501 = academicStructure.departments[0].semesters[0].courses[0];
console.log(`• Course [0][0][0] Code & Title: [${courseCS501.courseCode}] ${courseCS501.title}`);

// Access 4: Practical Level (departments[0].semesters[0].courses[0].practicals[1])
const practical2 = academicStructure.departments[0].semesters[0].courses[0].practicals[1];
console.log(`• Practical [0][0][0][1] Topic: Practical ${practical2.pracNumber} — "${practical2.topic}"`);

// Access 5: Deepest Student Evaluation Level (departments[0].semesters[0].courses[0].practicals[1].studentSubmissions[0])
const submission = academicStructure.departments[0].semesters[0].courses[0].practicals[1].studentSubmissions[0];
console.log(`• Student Submission [0][0][0][1][0]:`);
console.log(`    - Student Name : ${submission.studentName}`);
console.log(`    - Roll Number  : ${submission.rollNo}`);
console.log(`    - Marks Scored : ${submission.score} / ${practical2.maxMarks}`);
console.log(`    - Status       : ${submission.status}`);

// 4. Practical Traversal Utility Example (Iterating 2D Matrix of Marks)
console.log("\n[3] 2D Matrix Summary: CSE Sem 5 -> CS501 -> Practical Scores:");
console.log("--------------------------------------------------");
console.log("Prac # | Topic Name                               | Roll No   | Student Name | Score");
console.log("--------------------------------------------------");

academicStructure.departments[0].semesters[0].courses[0].practicals.forEach((p) => {
  p.studentSubmissions.forEach((sub) => {
    const pNum = String(p.pracNumber).padEnd(6);
    const pTopic = p.topic.slice(0, 40).padEnd(40);
    const roll = sub.rollNo.padEnd(9);
    const name = sub.studentName.padEnd(12);
    const score = `${sub.score}/${p.maxMarks}`;
    console.log(`${pNum} | ${pTopic} | ${roll} | ${name} | ${score}`);
  });
});

console.log("--------------------------------------------------");
console.log("Multi-dimensional JSON demonstration executed successfully.");
console.log("==================================================");
