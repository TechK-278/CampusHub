# CampusHub — Practical 1: Foundation, Server-Side JavaScript & JSON

## 1. Objective
To set up the clean architectural foundation for **CampusHub (College Management Portal)** and demonstrate:
1. **Server-side JavaScript execution** using Node.js.
2. **Handling, parsing, manipulation, and structured output of JSON data** representing academic entities (students, courses, timetable, assignments, notices).
3. **Setting up an Express.js backend server** with health check verification (`GET /api/health`).
4. **Initial frontend portal layout shell** using React, Vite, Tailwind CSS, and shadcn/ui design patterns.

---

## 2. Technologies Used
- **Runtime Environment:** Node.js (v24.x)
- **Backend Framework:** Express.js (v4.x) with CORS
- **Frontend Framework:** React 18, Vite 6, Tailwind CSS 3
- **Icons & UI Primitives:** Lucide React, shadcn/ui component patterns
- **Data Format:** JSON (JavaScript Object Notation)

---

## 3. Directory Structure & Files Created

```
CampusHub/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Reusable UI primitives (Card, Button, Badge, Avatar, Separator)
│   │   │   ├── layout/           # Header, Sidebar, PortalLayout (Responsive Drawer)
│   │   │   └── dashboard/        # StatCards, ScheduleWidget, AssignmentsWidget, NoticesWidget, ActivityWidget
│   │   ├── pages/                # Dashboard, Courses, Attendance, Assignments, Results, Notices, Tasks, Profile
│   │   ├── data/
│   │   │   └── mockData.js       # Academic dataset for student Aarav Mehta (CS2026001)
│   │   ├── lib/
│   │   │   └── utils.js          # Class merging utility (clsx + tailwind-merge)
│   │   ├── App.jsx               # Tab-based portal page renderer
│   │   ├── main.jsx              # React DOM entry point
│   │   └── index.css             # Academic theme tokens & Tailwind directives
│   ├── components.json           # shadcn configuration
│   ├── index.html                # HTML entry with Inter font
│   ├── package.json              # Frontend dependencies and Vite scripts
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tailwind.config.js        # Restrained academic color theme configuration
│   └── vite.config.js            # Vite build and proxy configuration
│
├── backend/
│   ├── app.js                    # Express server with / and /api/health
│   ├── package.json              # Backend dependencies
│   ├── data/
│   │   └── demo.json             # Structured academic JSON entity dataset
│   └── demos/
│       ├── helloWorld.js         # Practical 1: Server-side JS execution demo
│       └── jsonObjectDemo.js     # Practical 1: JSON read, parse, query & manipulation demo
│
├── docs/
│   └── practical-1.md            # Practical 1 documentation & verification report
│
├── .gitignore
├── AGENTS.md                     # Global AI Rules & Restrictions (38 rules)
├── package.json                  # Root runner scripts
└── README.md                     # Project overview and quickstart
```

---

## 4. Implementation Details

### A. Server-Side JavaScript (`backend/demos/helloWorld.js`)
Demonstrates running JavaScript outside of the browser via Node.js runtime, accessing `process` global properties such as version, platform, architecture, and current timestamp.

### B. JSON Handling & Object Manipulation (`backend/demos/jsonObjectDemo.js`)
Demonstrates:
- Synchronous filesystem reading (`fs.readFileSync`).
- Parsing JSON into in-memory JavaScript objects (`JSON.parse`).
- Traversing nested properties (student profile, enrolled course lists, assignment status filtering).
- Creating new JSON objects at runtime and serializing them with formatting (`JSON.stringify`).

### C. Express Backend Server (`backend/app.js`)
Exposes:
- `GET /`: Returns portal metadata and version.
- `GET /api/health`: Returns `{ "status": "ok", "application": "CampusHub" }`.
- `GET /api/demo-data`: Exposes the demo JSON data structure.

### D. Frontend Portal UI (`frontend/src/`)
- Professional, restrained academic color system (Slate/Navy theme, clean borders, high-density layouts).
- Responsive navigation (persistent desktop sidebar, mobile overlay drawer with hamburger menu).
- Student dashboard showcasing attendance (88.4%), courses, schedule, assignments, notices, and activity log.

---

## 5. Commands to Run & Demonstrate

### 1. Server-Side JavaScript Demo
```bash
npm run demo:hello
# or
node backend/demos/helloWorld.js
```

### 2. JSON Object Demonstration
```bash
npm run demo:json
# or
node backend/demos/jsonObjectDemo.js
```

### 3. Backend Server
```bash
npm run start:backend
# Server runs on http://localhost:5000
```

### 4. Frontend Application
```bash
npm run dev:frontend
# App runs on http://localhost:5173
```

---

## 6. Expected Output

### `node backend/demos/helloWorld.js` Output:
```text
==================================================
CampusHub — College Management Portal
Practical 1: Server-Side JavaScript Demonstration
==================================================
Hello World! Welcome to CampusHub Server-Side JavaScript.

--- Server Runtime Information ---
Node.js Version : v24.x
Platform        : win32
Architecture    : x64
Process ID (PID): 1234
Current Time    : 2026-09-21T12:00:00.000Z
==================================================
```

### `node backend/demos/jsonObjectDemo.js` Output:
```text
==================================================
CampusHub — JSON Object Demonstration
Practical 1: Handling Structured JSON Data in Node.js
==================================================

[1] Application Header:
    Application : CampusHub
    Subtitle    : College Management Portal
    Session     : 2025-2026
    Version     : 1.0.0

[2] Student Details:
    Roll Number : CS2026001
    Name        : Aarav Mehta
    Program     : B.Tech Computer Science and Engineering
    Semester    : 5 (Division A, Batch B1)
    Attendance  : 88.4%
    Current CGPA: 8.62
    Mentor      : Dr. Rajesh Sharma

[3] Enrolled Courses Catalog:
    1. [CS501] Full Stack Web Development (4 Credits) - Faculty: Prof. Sanjay Patel
    2. [CS502] Database Management Systems (4 Credits) - Faculty: Dr. Ananya Roy
    3. [CS503] Computer Networks (4 Credits) - Faculty: Prof. Vikram Joshi
    4. [CS504] Operating Systems (3 Credits) - Faculty: Dr. Neha Verma
    5. [CS505] Design & Analysis of Algorithms (4 Credits) - Faculty: Prof. Harish Nair

[4] Pending Assignments Summary:
    Total Pending: 3
    1. [CS501] Practical 1: Server-Side JS & JSON Basics (Due: 2026-09-25, Status: In Progress)
    2. [CS502] Lab Task: ER Diagram & Normalization (3NF) (Due: 2026-09-27, Status: Pending)
    3. [CS503] Subnetting and Routing Table Simulation (Due: 2026-09-30, Status: Pending)

[5] Creating & Serializing New JSON Object:
{
  "eventType": "DEMO_VERIFICATION",
  "executedBy": "PracticalEvaluator",
  "timestamp": "2026-09-21T12:00:00.000Z",
  "status": "SUCCESS",
  "details": {
    "studentRoll": "CS2026001",
    "verifiedCourses": 5
  }
}

==================================================
JSON Demonstration Executed Successfully.
==================================================
```

### `GET http://localhost:5000/api/health` Response:
```json
{
  "status": "ok",
  "application": "CampusHub"
}
```

---

## 7. Practical 1 Mapping & Compliance Checklist
- [x] Clean separation between `/frontend` and `/backend`.
- [x] `backend/demos/helloWorld.js` demonstrates server-side JavaScript.
- [x] `backend/demos/jsonObjectDemo.js` & `backend/data/demo.json` demonstrate reading, parsing, querying, and serializing JSON objects.
- [x] Express server with `GET /api/health` returning `{ "status": "ok", "application": "CampusHub" }`.
- [x] Professional, responsive React + Vite + Tailwind + shadcn portal UI shell with mock student dashboard.
