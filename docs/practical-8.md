# CampusHub — Practical 8: Node.js + MySQL Integration

## 1. Objective
To implement, verify, and demonstrate all key requirements of **Practical 8: Node.js + MySQL** within **CampusHub (College Management Portal)**:
1. **Create Database & Table:** Database `campushub` and table `students`.
2. **Insert Operation:** Node.js + MySQL parameterized record insertion via `POST /api/students`.
3. **Select Operation:** Query and filter all student records via `GET /api/students`.
4. **Select Unique (DISTINCT):** Retrieve unique academic departments via `SELECT DISTINCT department FROM students`.
5. **Update Operation:** Parameterized record modification via `PUT /api/students/:id`.
6. **Delete Operation:** Parameterized record removal via `DELETE /api/students/:id`.
7. **Drop Table Demonstration:** Controlled, safe execution of `DROP TABLE IF EXISTS` on an isolated temporary demo table.
8. **User-Defined Function (Stored Function):** Database-native MySQL function `calculate_grade(score)` executed from Node.js via `SELECT calculate_grade(?) AS grade`.

---

## 2. Architecture & Technology Stack
- **Database Engine:** MySQL 8.0.x
- **Driver / Connector:** `mysql2/promise` (Connection pooling with async/await)
- **Environment Management:** `dotenv` loading `.env` (gitignored, template in `.env.example`)
- **Direct SQL Execution:** Direct parameterized queries with `?` placeholders (no ORMs).
- **Backend Routing:** Express.js 4 REST endpoints mounted at `/api/students` and `/api/database`.
- **Frontend Interface:** React 18 + Tailwind CSS + shadcn/ui + Lucide ([`frontend/src/pages/StudentsPage.jsx`](../frontend/src/pages/StudentsPage.jsx)).

---

## 3. Database Schema & SQL Scripts

### I. Database & Table Creation (`backend/database/schema.sql`)
```sql
CREATE DATABASE IF NOT EXISTS campushub;
USE campushub;

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
```

### II. MySQL User-Defined Stored Function (`backend/database/functions.sql`)
```sql
USE campushub;

DROP FUNCTION IF EXISTS calculate_grade;

DELIMITER $$
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
END$$
DELIMITER ;
```

---

## 4. REST API Reference

| Method | Endpoint | SQL / Operation | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/database/health` | `SELECT 1, DATABASE(), VERSION()` | Connection pool status check |
| `GET` | `/api/students` | `SELECT * FROM students WHERE ... ORDER BY id DESC` | Select all students with search & filter |
| `GET` | `/api/students/:id` | `SELECT * FROM students WHERE id = ?` | Select single student by ID |
| `GET` | `/api/students/departments` | `SELECT DISTINCT department FROM students` | Select unique departments (**Requirement 5**) |
| `POST` | `/api/students` | `INSERT INTO students (...) VALUES (...)` | Insert new student record (**Requirement 3**) |
| `PUT` | `/api/students/:id` | `UPDATE students SET ... WHERE id = ?` | Update student record (**Requirement 6**) |
| `DELETE`| `/api/students/:id` | `DELETE FROM students WHERE id = ?` | Delete student record (**Requirement 7**) |
| `GET` | `/api/students/calculate-grade?score=88` | `SELECT calculate_grade(?) AS grade` | Execute MySQL User-Defined Function (**Requirement 9**) |
| `POST` | `/api/students/demo-drop-table` | `DROP TABLE IF EXISTS campushub_temp_demo` | Controlled DROP TABLE demonstration (**Requirement 8**) |

---

## 5. Security & Error Handling
1. **Parameterized Queries:** All queries use `execute(sql, [params])` to prevent SQL Injection attacks.
2. **Duplicate Entry Protection:** Handles MySQL error code `ER_DUP_ENTRY` for duplicate `roll_number` or `email`.
3. **Environment Isolation:** Database credentials reside strictly in `.env` (gitignored).
4. **Destructive Action Confirmation:** Student deletion and DROP TABLE require explicit confirmation dialogs.

---

## 6. How to Run & Demonstrate

### 1. Prerequisites & Database Initialization
```bash
# 1. Ensure MySQL Server is running locally on port 3306

# 2. Copy environment template
cp .env.example .env
# Configure DB_PASSWORD in .env if different from default

# 3. Initialize schema, stored function, and seed data
node backend/database/initDb.js
```

### 2. Start Application
```bash
# Start backend API (port 5000)
npm run start:backend

# Start frontend dev server (port 5173)
npm run dev:frontend
```

### 3. Viva Demonstration Steps:
1. Open `http://localhost:5173/` in a browser.
2. Click **Students** in the sidebar navigation (marked with badge **MySQL**).
3. **Observe Database Health Indicator:** Confirm green status dot indicating active connection to `campushub` on MySQL 8.0.x.
4. **Demonstrate SELECT & DISTINCT (Requirements 4 & 5):**
   - Filter by Department using the dropdown populated dynamically via `SELECT DISTINCT department`.
   - Search by student name or roll number.
5. **Demonstrate INSERT (Requirement 3):**
   - Click **Add Student (INSERT)**.
   - Enter Roll Number `CS2026006`, First Name `Priya`, Last Name `Desai`, Email `priya.desai@university.edu`, Mobile `9876543210`.
   - Click **Insert into MySQL** ➔ verify record appears in table.
6. **Demonstrate UPDATE (Requirement 6):**
   - Click the **Edit** icon on any student row.
   - Change Division to `B` and save changes.
7. **Demonstrate DELETE (Requirement 7):**
   - Click the **Delete** icon and confirm deletion in the modal dialog.
8. **Demonstrate User-Defined Function (Requirement 9):**
   - Click tab **2. User-Defined Function (calculate_grade)**.
   - Adjust numeric score slider (e.g. `88`) and click **Run: SELECT calculate_grade(88)** ➔ observe grade `AA (10)` returned directly from MySQL.
9. **Demonstrate DROP TABLE (Requirement 8):**
   - Click tab **3. DROP TABLE Demonstration**.
   - Check the educational confirmation box and execute the safe demo drop.

---

## 7. Verification & Testing Results

- **Backend Integration Tests:** Verified via `node backend/database/initDb.js` (Database created, table created, UDF verified, 5 seed records loaded).
- **Frontend Production Build:** `npm --prefix frontend run build` completed with **0 errors**.
- **Regression Verification:**
  - Practical 1: Node.js scripts, JSON object demo, `/api/health` — **PASSED**
  - Practical 2: JSON task CRUD operations (`backend/data/tasks.json`) — **PASSED**
  - Practical 3: Responsive layouts, fluid typography, drawer navigation — **PASSED**
  - Practical 4: Geolocation widget, Local Storage persistence, and Drag & Drop task ordering — **PASSED**
  - Practical 5: Isolated Bootstrap 5 registration form (CDN & Offline modes) — **PASSED**
  - Practical 6: Tailwind CSS utility tokens, responsive grid, and state variants — **PASSED**
  - Practical 7: Isolated Vue 3 custom directives (`v-uppercase-click`, `v-human-date`) — **PASSED**
