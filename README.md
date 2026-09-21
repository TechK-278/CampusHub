# CampusHub — College Management Portal

> **CampusHub** is an academic management portal designed for students, faculty, and administrators. Built with a clean full-stack architecture adhering to strict enterprise and university usability standards.

---

## Current Status: Phase 4 (Browser APIs — Geolocation + Local Storage + Drag & Drop)

Phase 4 implements browser API capabilities within the academic portal:
1. **Geolocation API:** Student dashboard Campus & Browser Location widget with permission/error state handling.
2. **Local Storage:** Client-side preference management (`campushub:lastVisitedPage`, `campushub:compactDashboard`, `campushub:taskFilter`, `campushub:taskOrder`).
3. **Native HTML5 Drag & Drop:** Custom task card reordering on the Tasks page with Local Storage order persistence and keyboard accessibility.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 6, JavaScript, Tailwind CSS 3, Lucide React, shadcn/ui design patterns
- **Browser APIs:** Geolocation (`navigator.geolocation`), Local Storage (`localStorage`), Native HTML5 Drag and Drop (`draggable`, `dragstart`, `dragover`, `drop`, `dragend`)
- **Backend:** Node.js (v24.x), Express.js 4, CORS
- **Storage Layer (Phases 1-4):** File-based JSON (`backend/data/tasks.json` & `backend/data/demo.json`)
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
│   │   ├── pages/                # TasksPage, DashboardPage, CoursesPage, AttendancePage, ProfilePage, etc.
│   │   ├── services/             # taskService.js (REST API Client)
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
│   ├── app.js                    # Express app with /api/health and /api/tasks routes
│   ├── routes/                   # taskRoutes.js (REST Endpoints)
│   ├── controllers/              # taskController.js (JSON CRUD Logic)
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
│   └── practical-4.md            # Practical 4 documentation & verification
│
├── AGENTS.md                     # Mandatory Global AI Rules & Restrictions
├── package.json                  # Root convenience scripts
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
Run from the project root:
```bash
# Install backend dependencies
npm --prefix backend install

# Install frontend dependencies
npm --prefix frontend install
```

### 2. Run Practical Demonstrations
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

### 3. Start Backend Server
```bash
npm run start:backend
# Server runs at: http://localhost:5000
# Health check: http://localhost:5000/api/health
# Tasks API: http://localhost:5000/api/tasks
```

### 4. Start Frontend Development Server
```bash
npm run dev:frontend
# Application runs at: http://localhost:5173
```

---

## 📋 Task REST API Reference

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get all academic tasks from `tasks.json` | None |
| `GET` | `/api/tasks/:id` | Get single task by ID | None |
| `POST` | `/api/tasks` | Create task with validation | `{ title, course, dueDate, description }` |
| `PUT` | `/api/tasks/:id` | Update completion status / fields | `{ completed, title, course, dueDate, description }` |
| `DELETE` | `/api/tasks/:id` | Delete task from `tasks.json` | None |

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

---

## 🔒 Design & Compliance Rules
- Complies strictly with the **38 Global AI Rules & Restrictions** in [`AGENTS.md`](./AGENTS.md).
- Restrained academic color palette (Navy/Slate, no neon/gradients).
- 100% fictional demo data (no real student PII or credentials).
- Strictly Phase 4 scoped.
