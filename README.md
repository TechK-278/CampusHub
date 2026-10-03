# CampusHub — College Management Portal

> **CampusHub** is an academic management portal designed for students, faculty, and administrators. Built with a clean full-stack architecture adhering to strict enterprise and university usability standards.

---

## Current Status: Phase 9 (Role-Based Authentication & Access Control)

Phase 9 introduces full-stack Role-Based Authentication & Access Control (RBAC):
1. **User Storage:** MySQL `users` table with username/email uniqueness and role enumeration (`student`, `faculty`, `admin`).
2. **Password Security:** Salted one-way hashing using `bcryptjs` (cost: 10) — zero plaintext storage.
3. **Stateless JWT:** Bearer authentication with HS256 tokens and configurable expiration (`2h`).
4. **Authoritative Middleware:** `authenticateToken` validates tokens and live database roles; `authorizeRoles` enforces strict 401 vs 403 HTTP semantics.
5. **Rate Limiting:** In-memory login throttle mitigating brute-force attacks (5 failed attempts per 15 minutes -> 429).
6. **Frontend RBAC:** React `AuthContext`, Bearer `apiClient`, `LoginPage`, `ProtectedTab` guards, role-filtered navigation, `UserManagementPage` (admin only), and `MyAccessPage`.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 6, JavaScript, Tailwind CSS 3.4, Lucide React, shadcn/ui design patterns
- **Authentication & Security:** JSON Web Tokens (JWT), `bcryptjs`, Bearer Authorization
- **Vue.js Module (Isolated):** Vue 3.5 (Mounted into React container for Practical 7 custom directives)
- **Bootstrap Module (Isolated):** Bootstrap 5.3 (CDN + Local npm package for Practical 5 isolation)
- **Browser APIs:** Geolocation (`navigator.geolocation`), Local Storage (`localStorage`), Native HTML5 Drag and Drop (`draggable`, `dragstart`, `dragover`, `drop`, `dragend`)
- **Backend:** Node.js (v24.x), Express.js 4, CORS, dotenv, `jsonwebtoken`, `bcryptjs`
- **Relational Database (Phases 8-9):** MySQL 8.x (`campushub.students` & `campushub.users`) via `mysql2/promise` connection pool
- **Storage Layer (Phases 1-7):** File-based JSON (`backend/data/tasks.json` & `backend/data/demo.json`)
- **Data Interchange:** JSON (JavaScript Object Notation)


---

## 📁 Project Structure

```
CampusHub/
├── frontend/                     # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Card, Button, Badge, Avatar, Separator, Input, Dialog
│   │   │   ├── layout/           # Header (Mobile Search), Sidebar (Drawer), PortalLayout
│   │   │   └── dashboard/        # StatCards, Schedule, Assignments, Notices, Activity, LocationWidget
│   │   ├── pages/                # StudentsPage, TasksPage, DashboardPage, CoursesPage, AttendancePage, ProfilePage, etc.
│   │   ├── services/             # studentService.js (MySQL API), taskService.js (JSON API)
│   │   ├── data/                 # Mock academic dataset (Aarav Mehta, CS2026001)
│   │   ├── lib/                  # storage.js (Local Storage Helper), utils.js
│   │   ├── App.jsx               # Application root with lastVisitedPage restoration
│   │   ├── main.jsx              # DOM entry
│   │   └── index.css             # Academic color variables, fluid vw typography & media queries
│   ├── components.json
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                      # Node.js + Express backend
│   ├── app.js                    # Express app with /api/health, /api/tasks, /api/students, /api/database
│   ├── config/
│   │   └── db.js                 # mysql2/promise connection pool & health checker
│   ├── database/
│   │   ├── schema.sql            # Database & students table DDL
│   │   ├── functions.sql         # calculate_grade() MySQL stored function DDL
│   │   ├── seed.sql              # Fictional academic seed dataset (5 students)
│   │   └── initDb.js             # Automated database initialization runner
│   ├── routes/
│   │   ├── studentRoutes.js      # Student CRUD, distinct depts, UDF & drop table routes
│   │   ├── databaseRoutes.js     # MySQL connection health route
│   │   └── taskRoutes.js         # JSON task REST Endpoints
│   ├── controllers/
│   │   ├── studentController.js  # Parameterized SQL queries & business logic
│   │   └── taskController.js     # JSON CRUD Logic
│   ├── package.json
│   ├── data/
│   │   ├── demo.json             # Fictional academic JSON dataset
│   │   └── tasks.json            # File-based JSON task storage
│   └── demos/
│       ├── helloWorld.js         # Practical 1: Server-side JS demonstration
│       ├── jsonObjectDemo.js     # Practical 1 & 2 (Req I): JSON object creation & display
│       ├── readJsonDemo.js       # Practical 2 (Req II): External JSON file reader
│       └── multiJsonDemo.js      # Practical 2 (Req III): Multi-dimensional JSON arrays
│
├── docs/
│   ├── practical-1.md            # Practical 1 documentation & verification
│   ├── practical-2.md            # Practical 2 documentation & verification
│   ├── practical-3.md            # Practical 3 documentation & verification
│   ├── practical-4.md            # Practical 4 documentation & verification
│   ├── practical-5.md            # Practical 5 documentation & verification
│   ├── practical-6.md            # Practical 6 documentation & verification
│   ├── practical-7.md            # Practical 7 documentation & verification
│   └── practical-8.md            # Practical 8 documentation & verification (Node.js + MySQL)
│
├── .env.example                  # Environment variable template for MySQL configuration
├── AGENTS.md                     # Mandatory Global AI Rules & Restrictions
├── package.json                  # Root convenience scripts
└── README.md
```

---

## 🚀 Getting Started

### 1. Configure Environment & MySQL Database
```bash
# 1. Copy the example environment file
cp .env.example .env

# 2. Configure DB_USER, DB_PASSWORD, DB_NAME, DB_PORT in .env

# 3. Initialize MySQL database, tables, UDF, and seed data
node backend/database/initDb.js
```

### 2. Install Dependencies
Run from the project root:
```bash
# Install backend dependencies (including mysql2, dotenv)
npm --prefix backend install

# Install frontend dependencies
npm --prefix frontend install
```

### 3. Run Practical Demonstrations
```bash
# Practical 1: Server-Side JavaScript demo
npm run demo:hello

# Practical 1 & 2 (I): JSON Object manipulation demo
npm run demo:json

# Practical 2 (II): Read External JSON File demo
npm run demo:read-json

# Practical 2 (III): Multi-dimensional JSON Arrays demo
npm run demo:multi-json
```

### 4. Start Backend Server
```bash
npm run start:backend
# Server runs at: http://localhost:5000
# Health check: http://localhost:5000/api/health
# DB Health check: http://localhost:5000/api/database/health
# Students API: http://localhost:5000/api/students
# Tasks API: http://localhost:5000/api/tasks
```

### 5. Start Frontend Development Server
```bash
npm run dev:frontend
# Application runs at: http://localhost:5173
```

---

## 📋 Authentication & RBAC REST API Reference

| Method | Endpoint | Description | Access Control |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user with username & password, returns JWT | Public |
| `GET` | `/api/auth/me` | Fetch active user session from live database | Authenticated (Any Role) |
| `POST` | `/api/auth/logout` | Terminate session (stateless token discard) | Authenticated (Any Role) |
| `GET` | `/api/protected/profile` | Test profile resource authorization | Authenticated (Any Role) |
| `GET` | `/api/protected/academic` | Test academic management authorization | Faculty & Admin |
| `GET` | `/api/protected/admin` | Test system administrator console authorization | Admin Only |
| `GET` | `/api/users` | List all user accounts with search/role filters | Admin Only |
| `POST` | `/api/users` | Provision new user account with hashed password | Admin Only |
| `PUT` | `/api/users/:id` | Update user role and full name | Admin Only |
| `DELETE` | `/api/users/:id` | Delete user account (self/last admin protected) | Admin Only |

---

## 📋 Student (MySQL) REST API Reference

| Method | Endpoint | Description | Query / Body Params | Access Control |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/students` | Get all students (with optional `department` / `search` filters) | `?department=...&search=...` | Faculty & Admin |
| `GET` | `/api/students/:id` | Get single student record by primary key ID | None | Faculty & Admin |
| `GET` | `/api/students/departments` | Get unique departments (`SELECT DISTINCT department`) | None | Faculty & Admin |
| `GET` | `/api/students/:id/grade` | Call MySQL Stored Function `calculate_grade(?)` | `?score=88` | Faculty & Admin |
| `POST` | `/api/students` | Insert student with validation | `{ roll_number, first_name, ... }` | Faculty & Admin |
| `PUT` | `/api/students/:id` | Update existing student record | `{ roll_number, first_name, ... }` | Faculty & Admin |
| `DELETE` | `/api/students/:id` | Delete student record | None | Admin Only |
| `POST` | `/api/students/demo-drop-table` | Educational DROP TABLE demonstration (safe demo) | `{ confirm_token: "..." }` | Admin Only (Dev) |
| `GET` | `/api/database/health` | MySQL connection pool health check | None | Admin Only |

---

## 📋 Task (JSON) REST API Reference

| Method | Endpoint | Description | Request Body | Access Control |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get all academic tasks from `tasks.json` | None | Authenticated (Any Role) |
| `GET` | `/api/tasks/:id` | Get single task by ID | None | Authenticated (Any Role) |
| `POST` | `/api/tasks` | Create task with validation | `{ title, course, dueDate, description }` | Authenticated (Any Role) |
| `PUT` | `/api/tasks/:id` | Update completion status / fields | `{ completed, title, course, ... }` | Authenticated (Any Role) |
| `DELETE` | `/api/tasks/:id` | Delete task from `tasks.json` | None | Authenticated (Any Role) |

---

## 📋 Practical Mapping

| Practical | Module / File | Description | Status |
| :--- | :--- | :--- | :--- |
| **Practical 1** | `backend/demos/helloWorld.js` | Server-side JavaScript in Node.js runtime | Completed |
| **Practical 1** | `backend/demos/jsonObjectDemo.js` | JSON creation, parsing, query & serialization | Completed |
| **Practical 1** | `backend/app.js` | Express server & `/api/health` JSON endpoint | Completed |
| **Practical 1** | `frontend/` | Academic portal shell, responsive layout, student dashboard | Completed |
| **Practical 2 (I)** | `backend/demos/jsonObjectDemo.js` | Create and display JSON object in terminal | Completed |
| **Practical 2 (II)** | `backend/demos/readJsonDemo.js` | Read and display external JSON file (`demo.json`) | Completed |
| **Practical 2 (III)** | `backend/demos/multiJsonDemo.js` | Multi-dimensional JSON arrays and element access | Completed |
| **Practical 2 (IV)** | `frontend/src/pages/TasksPage.jsx` | Web application manipulating JSON task data via REST API | Completed |
| **Practical 3 (I)** | `frontend/index.html` | Responsive viewport meta tag configuration | Completed |
| **Practical 3 (II)** | `frontend/src/` | Width, max-width, and responsive media scaling | Completed |
| **Practical 3 (III)**| `frontend/src/index.css` | Responsive fluid typography using `vw` & `clamp()` | Completed |
| **Practical 3 (IV)** | `frontend/src/` | Responsive layout, media queries, and drawer navigation | Completed |
| **Practical 4 (I)** | `frontend/src/components/dashboard/LocationWidget.jsx` | Geolocation API (`navigator.geolocation`) verification | Completed |
| **Practical 4 (II)**| `frontend/src/lib/storage.js` | Browser Local Storage preference management | Completed |
| **Practical 4 (III)**| `frontend/src/pages/TasksPage.jsx` | Native HTML5 Drag & Drop task card reordering | Completed |
| **Practical 5 (I)** | `frontend/src/pages/admissions/` | Bootstrap 5 Student Admissions module (online CDN & local bundling) | Completed |
| **Practical 5 (II)**| `frontend/src/pages/admissions/` | Multi-step admission form with draft persistence & summary review | Completed |
| **Practical 6** | `frontend/src/pages/calendar/` | Academic Calendar module with weekly timetable, exam schedule, holidays | Completed |
| **Practical 7** | `frontend/src/pages/library/` | Library Catalogue with Vue 3 custom directives (debounce, clickOutside, focus) | Completed |
| **Practical 8** | `backend/database/`, `frontend/src/pages/StudentsPage.jsx` | Node.js + MySQL CRUD, SELECT DISTINCT, DROP TABLE demo, UDF (`calculate_grade`) | Completed |
| **Practical 9** | `backend/middleware/auth.js`, `frontend/src/context/AuthContext.jsx` | Role-Based Authentication & Access Control (JWT, bcrypt, users table, RBAC) | Completed |

---

## 🔒 Design & Compliance Rules
- Complies strictly with the **38 Global AI Rules & Restrictions** in [`AGENTS.md`](./AGENTS.md).
- Restrained academic color palette (Navy/Slate, no neon/gradients).
- 100% fictional demo data (no real student PII or credentials).
- Strictly Phase 9 scoped (Role-Based Authentication & Access Control).

