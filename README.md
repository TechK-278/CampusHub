# CampusHub — College Management Portal

> **CampusHub** is an academic management portal designed for students, faculty, and administrators. Built with a clean full-stack architecture adhering to strict enterprise and university usability standards.

---

## Current Status: Phase 1 (Foundation + Initial Portal UI)

Phase 1 establishes the clean project foundation, server-side JavaScript demos, structured JSON handling, backend health check API, and an initial responsive student portal UI.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 6, JavaScript, Tailwind CSS 3, Lucide React, shadcn/ui design patterns
- **Backend:** Node.js, Express.js 4, CORS
- **Data Interchange:** JSON (JavaScript Object Notation)

---

## 📁 Project Structure

```
CampusHub/
├── frontend/                     # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Card, Button, Badge, Avatar, Separator, Input
│   │   │   ├── layout/           # Header, Sidebar, PortalLayout (Responsive)
│   │   │   └── dashboard/        # StatCards, Schedule, Assignments, Notices, Activity
│   │   ├── pages/                # Dashboard, Courses, Attendance, Assignments, Results, etc.
│   │   ├── data/                 # Mock academic dataset (Aarav Mehta, CS2026001)
│   │   ├── lib/                  # Utility functions
│   │   ├── App.jsx               # Application root
│   │   ├── main.jsx              # DOM entry
│   │   └── index.css             # Academic color variables & Tailwind styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                      # Node.js + Express backend
│   ├── app.js                    # Express app & /api/health endpoint
│   ├── package.json
│   ├── data/
│   │   └── demo.json             # Fictional academic JSON dataset
│   └── demos/
│       ├── helloWorld.js         # Practical 1: Server-side JS demonstration
│       └── jsonObjectDemo.js     # Practical 1: JSON handling demonstration
│
├── docs/
│   └── practical-1.md            # Detailed Practical 1 documentation & verification
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

### 2. Run Practical 1 Demos
```bash
# Server-Side JavaScript demo
npm run demo:hello

# JSON Object manipulation demo
npm run demo:json
```

### 3. Start Backend Server
```bash
npm run start:backend
# Server runs at: http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### 4. Start Frontend Development Server
```bash
npm run dev:frontend
# Application runs at: http://localhost:5173
```

---

## 📋 Practical Mapping

| Practical | Module / File | Description | Status |
| :--- | :--- | :--- | :--- |
| **Practical 1** | `backend/demos/helloWorld.js` | Server-side JavaScript in Node.js runtime | Completed |
| **Practical 1** | `backend/demos/jsonObjectDemo.js` | JSON creation, parsing, query & serialization | Completed |
| **Practical 1** | `backend/app.js` | Express server & `/api/health` JSON endpoint | Completed |
| **Practical 1** | `frontend/` | Academic portal shell, responsive layout, student dashboard | Completed |

---

## 🔒 Design & Compliance Rules
- Complies strictly with the **38 Global AI Rules & Restrictions** in [`AGENTS.md`](./AGENTS.md).
- Restrained academic color palette (Navy/Slate, no neon/gradients).
- 100% fictional demo data (no real student PII or credentials).
- Strictly Phase 1 scoped (no databases or authentication backends added prematurely).
