/**
 * CampusHub — Authentication & RBAC Test Suite (Practical 9)
 * Uses Node's built-in node:test and node:assert (Zero extra dependencies)
 */

const { test, describe, before, after } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const jwt = require("jsonwebtoken");
const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const app = require("../app");
const { JWT_SECRET } = require("../middleware/auth");
const { seedUsers } = require("../database/seedUsers");
const { query } = require("../config/db");

let server;
let baseUrl;
let studentToken;
let facultyToken;
let adminToken;
let studentUser;
let facultyUser;
let adminUser;

before(async () => {
  // Ensure database is seeded with known test accounts
  await seedUsers();

  // Start temporary test server
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  const { pool } = require("../config/db");
  if (pool && typeof pool.end === "function") {
    await pool.end();
  }
});


describe("Practical 9 — Authentication & RBAC Verification", () => {
  // Test 1: Student Login -> 200
  test("1. Student login returns 200 and safe user profile with token", async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "aarav.mehta", password: "Student@123" })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token, "Token must be present");
    assert.strictEqual(data.user.role, "student");
    assert.strictEqual(data.user.username, "aarav.mehta");
    assert.strictEqual(data.user.password_hash, undefined, "password_hash must never be returned");
    studentToken = data.token;
    studentUser = data.user;
  });

  // Test 2: Faculty Login -> 200
  test("2. Faculty login returns 200 and role=faculty", async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "prof.nair", password: "Faculty@123" })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, "faculty");
    facultyToken = data.token;
    facultyUser = data.user;
  });

  // Test 3: Admin Login -> 200
  test("3. Admin login returns 200 and role=admin", async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin.campus", password: "Admin@123" })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, "admin");
    adminToken = data.token;
    adminUser = data.user;
  });

  // Test 4: Wrong password vs unknown user -> 401 with identical error message
  test("4. Wrong password and unknown user return identical 401 error responses", async () => {
    const resWrongPass = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "aarav.mehta", password: "WrongPassword999" })
    });
    const dataWrongPass = await resWrongPass.json();
    assert.strictEqual(resWrongPass.status, 401);

    const resUnknownUser = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "nonexistent.user", password: "SomePassword123" })
    });
    const dataUnknownUser = await resUnknownUser.json();
    assert.strictEqual(resUnknownUser.status, 401);

    assert.strictEqual(dataWrongPass.error, dataUnknownUser.error, "Error message must be identical to prevent user enumeration");
  });

  // Test 5: Missing token -> 401
  test("5. Requests with missing Authorization header return 401", async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`);
    assert.strictEqual(res.status, 401);
  });

  // Test 6: Malformed, tampered and expired tokens -> 401
  test("6. Malformed, tampered, and expired tokens return 401", async () => {
    // Malformed token
    const resMalformed = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: "Bearer this-is-not-a-jwt" }
    });
    assert.strictEqual(resMalformed.status, 401);

    // Tampered token
    const tampered = studentToken.slice(0, -5) + "abcde";
    const resTampered = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${tampered}` }
    });
    assert.strictEqual(resTampered.status, 401);

    // Expired token (expiresIn: -1s)
    const expiredToken = jwt.sign(
      { sub: 1, username: "aarav.mehta", role: "student" },
      JWT_SECRET,
      { algorithm: "HS256", expiresIn: "-1s" }
    );
    const resExpired = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${expiredToken}` }
    });
    assert.strictEqual(resExpired.status, 401);
  });

  // Test 7: /api/protected/admin -> student 403, faculty 403, admin 200
  test("7. /api/protected/admin denies students (403), denies faculty (403), allows admin (200)", async () => {
    const resStudent = await fetch(`${baseUrl}/api/protected/admin`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert.strictEqual(resStudent.status, 403);

    const resFaculty = await fetch(`${baseUrl}/api/protected/admin`, {
      headers: { Authorization: `Bearer ${facultyToken}` }
    });
    assert.strictEqual(resFaculty.status, 403);

    const resAdmin = await fetch(`${baseUrl}/api/protected/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(resAdmin.status, 200);
  });

  // Test 8: /api/protected/academic -> student 403, faculty 200, admin 200
  test("8. /api/protected/academic denies students (403), allows faculty (200) & admin (200)", async () => {
    const resStudent = await fetch(`${baseUrl}/api/protected/academic`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert.strictEqual(resStudent.status, 403);

    const resFaculty = await fetch(`${baseUrl}/api/protected/academic`, {
      headers: { Authorization: `Bearer ${facultyToken}` }
    });
    assert.strictEqual(resFaculty.status, 200);

    const resAdmin = await fetch(`${baseUrl}/api/protected/academic`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(resAdmin.status, 200);
  });

  // Test 9: /api/protected/profile -> 200 for all authenticated roles
  test("9. /api/protected/profile returns 200 for any authenticated user", async () => {
    const resStudent = await fetch(`${baseUrl}/api/protected/profile`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert.strictEqual(resStudent.status, 200);

    const resFaculty = await fetch(`${baseUrl}/api/protected/profile`, {
      headers: { Authorization: `Bearer ${facultyToken}` }
    });
    assert.strictEqual(resFaculty.status, 200);

    const resAdmin = await fetch(`${baseUrl}/api/protected/profile`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(resAdmin.status, 200);
  });

  // Test 10: /api/auth/me works with valid token, logout returns 200
  test("10. /api/auth/me returns active user; /api/auth/logout returns 200", async () => {
    const resMe = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert.strictEqual(resMe.status, 200);
    const dataMe = await resMe.json();
    assert.strictEqual(dataMe.user.username, "aarav.mehta");

    const resLogout = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert.strictEqual(resLogout.status, 200);
  });

  // Test 11: password_hash never appears in any responses
  test("11. password_hash is never exposed in auth, user listing, or protected responses", async () => {
    const resUsers = await fetch(`${baseUrl}/api/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(resUsers.status, 200);
    const dataUsers = await resUsers.json();
    for (const u of dataUsers.users) {
      assert.strictEqual(u.password_hash, undefined, `User ${u.username} must not expose password_hash`);
    }
  });

  // Test 12: Students API RBAC & throwaway student cleanup
  test("12. Students API: student 403, faculty can GET/POST/PUT but 403 on DELETE, admin can DELETE", async () => {
    // Student GET /api/students -> 403
    const resStudentGet = await fetch(`${baseUrl}/api/students`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert.strictEqual(resStudentGet.status, 403);

    // Faculty GET /api/students -> 200
    const resFacultyGet = await fetch(`${baseUrl}/api/students`, {
      headers: { Authorization: `Bearer ${facultyToken}` }
    });
    assert.strictEqual(resFacultyGet.status, 200);

    // Faculty POST /api/students -> 201 (create throwaway student)
    const testRoll = "CS2026TEST99";
    const resFacultyPost = await fetch(`${baseUrl}/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${facultyToken}`
      },
      body: JSON.stringify({
        roll_number: testRoll,
        first_name: "Test",
        last_name: "Student",
        email: "test.student99@university.edu",
        mobile: "9876543299",
        department: "Computer Science & Engineering",
        semester: 5,
        division: "A"
      })
    });
    assert.strictEqual(resFacultyPost.status, 201);
    const postData = await resFacultyPost.json();
    const createdId = postData.student.id;

    // Faculty PUT /api/students/:id -> 200
    const resFacultyPut = await fetch(`${baseUrl}/api/students/${createdId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${facultyToken}`
      },
      body: JSON.stringify({
        roll_number: testRoll,
        first_name: "TestUpdated",
        last_name: "Student",
        email: "test.student99@university.edu",
        mobile: "9876543299",
        department: "Computer Science & Engineering",
        semester: 6,
        division: "B"
      })
    });
    assert.strictEqual(resFacultyPut.status, 200);

    // Faculty DELETE /api/students/:id -> 403 Forbidden
    const resFacultyDelete = await fetch(`${baseUrl}/api/students/${createdId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${facultyToken}` }
    });
    assert.strictEqual(resFacultyDelete.status, 403);

    // Admin DELETE /api/students/:id -> 200 OK (Clean up throwaway student)
    const resAdminDelete = await fetch(`${baseUrl}/api/students/${createdId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(resAdminDelete.status, 200);
  });

  // Test 13: Tasks API requires auth and JSON storage remains intact
  test("13. Tasks API requires authentication (401 unauth, 200 with student token)", async () => {
    const resUnauth = await fetch(`${baseUrl}/api/tasks`);
    assert.strictEqual(resUnauth.status, 401);

    const resAuth = await fetch(`${baseUrl}/api/tasks`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert.strictEqual(resAuth.status, 200);
  });

  // Test 14: demo-drop-table endpoint is admin only
  test("14. demo-drop-table returns 403 for non-admins", async () => {
    const resStudent = await fetch(`${baseUrl}/api/students/demo-drop-table`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({ confirmDrop: true })
    });
    assert.strictEqual(resStudent.status, 403);

    const resFaculty = await fetch(`${baseUrl}/api/students/demo-drop-table`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${facultyToken}`
      },
      body: JSON.stringify({ confirmDrop: true })
    });
    assert.strictEqual(resFaculty.status, 403);
  });

  // Test 15: Users API — admin only, duplicate 409, cannot delete self, last admin protected
  test("15. Users API: admin-only, duplicate 409, cannot delete self, last admin protected", async () => {
    // Non-admin -> 403
    const resFaculty = await fetch(`${baseUrl}/api/users`, {
      headers: { Authorization: `Bearer ${facultyToken}` }
    });
    assert.strictEqual(resFaculty.status, 403);

    // Create duplicate username -> 409
    const resDup = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        username: "aarav.mehta", // duplicate
        email: "unique.email@test.com",
        password: "Password@123",
        role: "student",
        full_name: "Duplicate User"
      })
    });
    assert.strictEqual(resDup.status, 409);

    // Admin cannot delete self
    const resDeleteSelf = await fetch(`${baseUrl}/api/users/${adminUser.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(resDeleteSelf.status, 400);

    // Cannot demote or delete last admin
    const resDemoteSelf = await fetch(`${baseUrl}/api/users/${adminUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ role: "student" })
    });
    assert.strictEqual(resDemoteSelf.status, 400);
  });

  // Test 16: Login throttle returns 429 after 5 failed attempts
  test("16. Login throttle returns 429 after 5 failed attempts within window", async () => {
    const throttleTarget = `throttle.test.user.${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: throttleTarget, password: "BadPassword" })
      });
      assert.strictEqual(res.status, 401);
    }

    // 6th attempt must be throttled with HTTP 429
    const resThrottled = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: throttleTarget, password: "BadPassword" })
    });
    assert.strictEqual(resThrottled.status, 429);
    const dataThrottled = await resThrottled.json();
    assert.ok(dataThrottled.error.includes("temporarily locked") || dataThrottled.error.includes("Too many failed"));
  });

  // Test 17: JWT secret check verification
  test("17. JWT_SECRET verification is enforced", () => {
    assert.ok(JWT_SECRET, "JWT_SECRET must be defined");
    assert.ok(JWT_SECRET.length >= 32, "JWT_SECRET must be at least 32 characters long");
  });
});
