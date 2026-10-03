/**
 * CampusHub — Seed Users Script (Practical 9: RBAC)
 * Upserts 3 fictional accounts (Student, Faculty, Admin) with bcrypt hashed passwords.
 */

const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const DEMO_USERS = [
  {
    username: "aarav.mehta",
    email: "aarav.mehta@campushub.test",
    rawPassword: "Student@123",
    role: "student",
    full_name: "Aarav Mehta"
  },
  {
    username: "prof.nair",
    email: "prof.nair@campushub.test",
    rawPassword: "Faculty@123",
    role: "faculty",
    full_name: "Prof. Harish Nair"
  },
  {
    username: "admin.campus",
    email: "admin.campus@campushub.test",
    rawPassword: "Admin@123",
    role: "admin",
    full_name: "Campus Administrator"
  }
];

async function seedUsers() {
  console.log("==================================================");
  console.log(" CampusHub — Seeding Demo Users (Practical 9 RBAC)");
  console.log("==================================================");

  const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "system",
    database: process.env.DB_NAME || "campushub"
  };

  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    console.log(`[1] Connected to MySQL database "${dbConfig.database}"`);

    // Ensure users table exists
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('student', 'faculty', 'admin') NOT NULL DEFAULT 'student',
        full_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await conn.query(createTableSql);
    console.log("[2] Verified `users` table existence.");

    const BCRYPT_SALT_ROUNDS = 10;

    for (const u of DEMO_USERS) {
      const passwordHash = await bcrypt.hash(u.rawPassword, BCRYPT_SALT_ROUNDS);

      const upsertSql = `
        INSERT INTO users (username, email, password_hash, role, full_name)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          email = VALUES(email),
          password_hash = VALUES(password_hash),
          role = VALUES(role),
          full_name = VALUES(full_name);
      `;

      await conn.query(upsertSql, [
        u.username,
        u.email,
        passwordHash,
        u.role,
        u.full_name
      ]);

      console.log(`[✓] Upserted user: ${u.username} (${u.role}) - ${u.full_name}`);
    }

    const [rows] = await conn.query("SELECT id, username, email, role, full_name, created_at FROM users");
    console.log("\n--- Active Users in MySQL ---");
    console.table(rows);

    console.log("==================================================");
    console.log(" Demo users seeded successfully (bcrypt cost: 10).");
    console.log("==================================================");
  } catch (err) {
    console.error("Error seeding users:", err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers, DEMO_USERS };
