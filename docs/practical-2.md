# CampusHub — Practical 2: JSON Operations & Web Task Management

## 1. Objective
To implement, verify, and demonstrate all four key requirements of **Practical 2** inside **CampusHub**:
1. **Requirement I:** Create a JSON object and display the same using Node.js in the terminal.
2. **Requirement II:** Create a Node.js script to read and display the content of an external JSON file.
3. **Requirement III:** Create and display multi-dimensional JSON Arrays and demonstrate accessing individual elements.
4. **Requirement IV:** Create a web-based application using JavaScript and JSON to manipulate JSON data (Add, View, Complete, Delete tasks).

---

## 2. Technologies Used
- **Runtime Environment:** Node.js (v24.x)
- **Backend Framework:** Express.js (v4.x) with CORS
- **Storage Layer:** File-based JSON (`backend/data/tasks.json` & `backend/data/demo.json`)
- **Frontend Stack:** React 18, Vite 6, Tailwind CSS 3, Lucide React
- **Architecture Pattern:** Route -> Controller -> JSON File Store -> REST API -> React Service -> UI

---

## 3. Practical 2 Requirements Mapping & Implementation

### Requirement I: JSON Object Creation & Terminal Display
- **File:** [`backend/demos/jsonObjectDemo.js`](../backend/demos/jsonObjectDemo.js)
- **Implementation:** Demonstrates creating in-memory JSON objects representing student and course details, manipulating properties, and serializing via `JSON.stringify(..., null, 2)` to terminal output.

### Requirement II: Reading External JSON File
- **File:** [`backend/demos/readJsonDemo.js`](../backend/demos/readJsonDemo.js)
- **Target File:** [`backend/data/demo.json`](../backend/data/demo.json)
- **Implementation:** Uses Node.js filesystem `fs.readFileSync` to load an external JSON file, checks existence, parses string to JavaScript objects with `JSON.parse`, and formats values (student info, enrolled courses, active notices).

### Requirement III: Multi-dimensional JSON Arrays & Element Access
- **File:** [`backend/demos/multiJsonDemo.js`](../backend/demos/multiJsonDemo.js)
- **Data Model:**
  `Departments[]` ➔ `Semesters[]` ➔ `Courses[]` ➔ `Practicals[]` ➔ `StudentSubmissions[]`
- **Demonstration:**
  - Indexed access to Department `[0]`
  - Indexed access to Semester `[0][0]`
  - Indexed access to Course `[0][0][0]`
  - Indexed access to Practical `[0][0][0][1]`
  - Deepest element access to Student Practical Score `[0][0][0][1][0]`
  - Matrix table output summarizing practical marks.

### Requirement IV: Web Application for JSON Data Manipulation
- **Backend Storage:** [`backend/data/tasks.json`](../backend/data/tasks.json)
- **Controller:** [`backend/controllers/taskController.js`](../backend/controllers/taskController.js)
- **Routes:** [`backend/routes/taskRoutes.js`](../backend/routes/taskRoutes.js)
- **Frontend Service:** [`frontend/src/services/taskService.js`](../frontend/src/services/taskService.js)
- **Frontend Page:** [`frontend/src/pages/TasksPage.jsx`](../frontend/src/pages/TasksPage.jsx)
- **Features:**
  - **View Tasks:** Loads tasks from backend REST API with loading skeletons and summary metrics (Total, Pending, Completed).
  - **Add Task:** Accessible modal dialog with visible labels, validation (`title` and `course` required), due date picker, and server persistence.
  - **Complete Task:** Toggle checkbox that updates `completed: true/false` on backend and provides visual strike-through and semantic badge feedback.
  - **Delete Task:** Destructive action protected by a confirmation modal dialog, returning 404 if not found.
  - **Filter Tasks:** Filter by `All`, `Pending`, or `Completed`.
  - **Error & Empty States:** Meaningful empty state ("No tasks yet" + "Create Task") and error state with retry.

---

## 4. REST API Reference

| Method | Endpoint | Description | Request Body | Success Response | Error Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get all academic tasks | None | `200 OK` `{ success: true, count: N, tasks: [...] }` | `500 Internal Error` |
| `GET` | `/api/tasks/:id` | Get single task by ID | None | `200 OK` `{ success: true, task: {...} }` | `404 Not Found` |
| `POST` | `/api/tasks` | Create a new task | `{ title, description, course, dueDate }` | `201 Created` `{ success: true, task: {...} }` | `400 Bad Request` |
| `PUT` | `/api/tasks/:id` | Update task fields / status | `{ completed, title, description, course, dueDate }` | `200 OK` `{ success: true, task: {...} }` | `404 Not Found` |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | None | `200 OK` `{ success: true, deletedTask: {...} }` | `404 Not Found` |

---

## 5. How to Run & Demonstrate

### 1. Run Requirement I Demo (JSON Object Creation & Output)
```bash
npm run demo:json
# or
node backend/demos/jsonObjectDemo.js
```

### 2. Run Requirement II Demo (Read External JSON File)
```bash
npm run demo:read-json
# or
node backend/demos/readJsonDemo.js
```

### 3. Run Requirement III Demo (Multi-dimensional JSON Arrays)
```bash
npm run demo:multi-json
# or
node backend/demos/multiJsonDemo.js
```

### 4. Run Requirement IV Web Application
```bash
# Start backend server (port 5000)
npm run start:backend

# Start frontend dev server (port 5173)
npm run dev:frontend
```
Open browser at `http://localhost:5173/` and navigate to **Tasks** from the sidebar.

---

## 6. Verification Results

### Requirement II Output (`readJsonDemo.js`):
```text
==================================================
CampusHub — Practical 2: External JSON File Reader
Requirement II: Reading & parsing external demo.json
==================================================
[1] Locating external file: demo.json
[2] Reading file content synchronously via fs.readFileSync...
[3] Parsing raw JSON string to JavaScript Object...
[4] Displaying Parsed Academic Records:
    Student: Aarav Mehta (CS2026001) - Semester 5
[5] Enrolled Courses List from JSON:
    1. [CS501] Full Stack Web Development (4 Credits)
...
External JSON file successfully read, parsed, and displayed.
```

### Requirement III Output (`multiJsonDemo.js`):
```text
==================================================
[2] Demonstrating Multi-dimensional Element Access:
==================================================
• Department [0] Name: "Computer Science and Engineering"
• Semester [0][0] Number: Semester 5 (Enrolled Students: 120)
• Course [0][0][0] Code & Title: [CS501] Full Stack Web Development
• Practical [0][0][0][1] Topic: Practical 2 — "JSON Operations & Web Task Management"
• Student Submission [0][0][0][1][0]:
    - Student Name : Aarav Mehta
    - Roll Number  : CS2026001
    - Marks Scored : 50 / 50
    - Status       : Verified
```

### Requirement IV API Tests:
- `GET /api/tasks` returned `200 OK` with 4 initial tasks.
- `POST /api/tasks` created new task and persisted to `tasks.json`.
- `PUT /api/tasks/:id` successfully toggled completion status.
- `DELETE /api/tasks/:id` removed task from `tasks.json`.
- Invalid `POST /api/tasks` (missing title) returned `400 Bad Request`.
- Nonexistent `DELETE /api/tasks/999` returned `404 Not Found`.
