# CampusHub — Project Summary for Claude

> **Purpose of this file:** Complete context for Claude to understand the CampusHub codebase before making any changes. Read this entire file before touching any code.

---

## 1. What Is CampusHub?

CampusHub is a **college academic management portal** built as a Full Stack Development (FSD) practicals project (Sem 5, B.Tech CSE). It is a **real academic management UI** — not a landing page, not a SaaS app. It must feel like a university information system / enterprise dashboard.

It is **not**:
- A startup marketing page
- A flashy SaaS template
- A gaming or social media app
- A portfolio website

---

## 2. Tech Stack

### Frontend
| Item | Detail |
|---|---|
| Framework | React 18 (Vite, ESM) |
| Styling | Tailwind CSS v3 + shadcn/ui component conventions |
| Icons | `lucide-react` only (no emojis as UI elements) |
| Fonts | Inter (primary), system-ui fallback |
| Path alias | `@/` → `frontend/src/` |
| Port | `5173` (dev server) |
| Special libs | `bootstrap` (isolated to practical 5 only), `vue` (isolated to practical 7 only) |

### Backend
| Item | Detail |
|---|---|
| Runtime | Node.js, CommonJS (`require`/`module.exports`) |
| Framework | Express 4 |
| Database | MySQL 2 (connection pool via `mysql2/promise`) |
| Port | `5000` |
| Dev script | `node --watch app.js` |

### Monorepo Structure
```
CampusHub/               <- root (workspace)
├── package.json         <- root scripts only (no deps)
├── .env                 <- secrets (gitignored)
├── .env.example         <- placeholder env vars
├── AGENTS.md            <- mandatory rules file
├── CLAUDE_PROJECT_SUMMARY.md  <- this file
├── README.md
├── docs/                <- practical documentation (markdown)
├── backend/             <- Node.js Express API
└── frontend/            <- React Vite SPA
```

---

## 3. Running the Project

```bash
# From root:
npm run dev:frontend     # starts Vite on :5173
npm run dev:backend      # starts Express on :5000

# Demo scripts (Node.js only, no server):
npm run demo:hello
npm run demo:json
npm run demo:read-json
npm run demo:multi-json
```

Vite proxies `/api/*` → `http://localhost:5000` automatically (`vite.config.js`).

---

## 4. Environment Variables

File: `.env` (root level, gitignored). See `.env.example`:

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=campushub
```

---

## 5. Frontend Structure

```
frontend/src/
├── App.jsx                    <- Root component, tab routing
├── main.jsx                   <- React DOM entry point
├── index.css                  <- Global CSS + design tokens (CSS variables)
├── data/
│   └── mockData.js            <- All mock academic data (NO real PII)
├── lib/
│   ├── utils.js               <- cn() helper (clsx + tailwind-merge)
│   └── storage.js             <- localStorage helpers + STORAGE_KEYS
├── services/
│   ├── studentService.js      <- fetch() calls to /api/students
│   └── taskService.js         <- fetch() calls to /api/tasks
├── components/
│   ├── layout/
│   │   ├── PortalLayout.jsx   <- Root layout: Sidebar + Header + main
│   │   ├── Sidebar.jsx        <- Desktop sidebar + mobile drawer nav
│   │   └── Header.jsx         <- Top header bar, mobile menu toggle
│   ├── dashboard/             <- Dashboard widget components
│   │   ├── StatCards.jsx
│   │   ├── ScheduleWidget.jsx
│   │   ├── AssignmentsWidget.jsx
│   │   ├── NoticesWidget.jsx
│   │   ├── ActivityWidget.jsx
│   │   └── LocationWidget.jsx
│   └── ui/                    <- shadcn/ui style primitive components
└── pages/
    ├── DashboardPage.jsx       <- Main student dashboard
    ├── StudentsPage.jsx        <- MySQL CRUD (Practical 8) — large file ~44KB
    ├── StudentRegistrationPage.jsx  <- Bootstrap form demo (Practical 5) ~43KB
    ├── CoursesPage.jsx         <- Enrolled courses view
    ├── AttendancePage.jsx      <- Attendance records
    ├── AssignmentsPage.jsx     <- Assignment list
    ├── ResultsPage.jsx         <- Academic results
    ├── NoticesPage.jsx         <- Notices board
    ├── TasksPage.jsx           <- JSON task management (Practical 2) ~31KB
    ├── TailwindDemoPage.jsx    <- Tailwind CSS showcase (Practical 6) ~39KB
    ├── VueDemoPage.jsx         <- Vue.js directives demo (Practical 7)
    └── ProfilePage.jsx         <- Student profile page
```

### Navigation / Routing

Navigation is **tab-based** (no React Router). `App.jsx` holds `activeTab` in state and renders the active page via a `switch` statement. Tab changes are persisted to `localStorage` via `storage.js`.

Valid tab IDs:
```
dashboard | students | courses | attendance | assignments |
results | notices | tasks | student-registration |
tailwind-demo | vue-demo | profile
```

To navigate programmatically, call `onNavigate(tabId)` (prop passed to `DashboardPage`).

---

## 6. Backend Structure

```
backend/
├── app.js                     <- Express server entry point
├── package.json               <- CommonJS, Express + mysql2 + dotenv + cors
├── config/
│   └── db.js                  <- MySQL pool, query(), checkHealth()
├── database/
│   ├── schema.sql             <- CREATE TABLE students
│   ├── seed.sql               <- INSERT fictional student records
│   ├── functions.sql          <- MySQL stored function (calculate_grade)
│   └── initDb.js              <- Script to run schema + seed programmatically
├── routes/
│   ├── studentRoutes.js       <- /api/students CRUD
│   ├── taskRoutes.js          <- /api/tasks CRUD
│   └── databaseRoutes.js      <- /api/database health/info
├── controllers/
│   ├── studentController.js   <- MySQL CRUD logic
│   └── taskController.js      <- JSON file-based task logic
├── data/
│   └── demo.json              <- Static demo data file
└── demos/                     <- Standalone Node.js demo scripts (Practicals 1 & 2)
```

### API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | App info |
| GET | `/api/health` | Health check |
| GET | `/api/demo-data` | Read demo.json |
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/students` | List all students |
| GET | `/api/students/:id` | Get student by ID |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |
| GET | `/api/students/departments` | Distinct departments |
| GET | `/api/students/calculate-grade` | UDF grade calc |
| POST | `/api/students/demo-drop-table` | Controlled DROP demo |
| GET | `/api/database` | DB health/info |

---

## 7. Database Schema

Database: `campushub` (MySQL)

```sql
CREATE TABLE students (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  roll_number  VARCHAR(20) NOT NULL UNIQUE,   -- e.g. CS2026001
  first_name   VARCHAR(50) NOT NULL,
  last_name    VARCHAR(50) NOT NULL,
  email        VARCHAR(100) NOT NULL UNIQUE,
  mobile       VARCHAR(15) NOT NULL,
  department   VARCHAR(100) NOT NULL,
  semester     INT NOT NULL,
  division     VARCHAR(10) NOT NULL DEFAULT 'A',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Seed data — fictional students:
- CS2026001 — Aarav Mehta, CSE, Sem 5, Div A
- CS2026002 — Diya Shah, CSE, Sem 5, Div A
- IT2026015 — Rohan Patel, IT, Sem 5, Div B
- EC2026030 — Ananya Sharma, ECE, Sem 5, Div A
- ME2026042 — Kabir Joshi, ME, Sem 5, Div B

---

## 8. Design System

### Color Tokens (CSS Variables in `index.css`)

All colors are HSL-based CSS variables, consumed via Tailwind utility classes.

| Token | Value | Usage |
|---|---|---|
| `--primary` | Blue-600 (221.2 83.2% 53.3%) | CTA buttons, active nav, icons |
| `--primary-hover` | Blue-700 | Button hover state |
| `--background` | Slate-50 | Page background |
| `--foreground` | Slate-900 | Body text |
| `--card` | White | Card backgrounds |
| `--muted-foreground` | Slate-500 | Secondary text |
| `--border` | Slate-200 | Dividers, input borders |
| `--destructive` | Red-500 | Delete/error actions |
| `--radius` | 0.5rem | Base border radius |

**Color Rules:** No neon colors. No gradients. No glassmorphism. No colored shadows. One primary brand color (blue-600) only.

### Typography
- Primary font: **Inter** (configured in Tailwind)
- Hierarchy: page title → section title → card title → body → metadata → helper/error
- No giant hero headings (48px+) on authenticated portal pages
- Dashboard pages must be information-dense and practical

### Layout Pattern
- **Desktop (>=1024px):** Fixed `w-64` sidebar + `h-16` header + main content
- **Mobile/Tablet (<1024px):** Hidden sidebar replaced by slide-in drawer
- Max content width: `max-w-7xl` in `PortalLayout.jsx`

### Responsive Breakpoints
```
Mobile:  < 640px   (.mobile-stack)
Tablet:  640-1023px (.tablet-grid-2)
Desktop: >= 1024px  (.desktop-grid-4, persistent sidebar)
```

### Fluid Typography Utilities (from `index.css`)
```css
.text-fluid-title    /* clamp(1.125rem → 1.5rem) */
.text-fluid-subtitle /* clamp(0.75rem → 0.875rem) */
.text-fluid-stat     /* clamp(1.5rem → 1.875rem) */
```

---

## 9. Mock Data Summary (`src/data/mockData.js`)

All mock data is fictional. Exported constants:

| Export | Contents |
|---|---|
| `mockStudent` | Logged-in student: Aarav Mehta, CS2026001, CSE, Sem 5, Div A |
| `mockStats` | Dashboard stat cards: attendance 88.4%, 5 courses, 3 tasks, CGPA 8.62 |
| `mockSchedule` | Today's 4-class timetable (CS501–CS504) |
| `mockAssignments` | 3 pending assignments (CS501, CS502, CS503) |
| `mockNotices` | 3 notices (academic, department, event) |
| `mockActivities` | 4 recent activity log items |
| `mockCourses` | 5 enrolled courses with credits, faculty, attendance, syllabus % |

---

## 10. LocalStorage Keys

Prefix: `campushub:` — defined in `src/lib/storage.js`

| Constant | localStorage Key | Purpose |
|---|---|---|
| `LAST_VISITED_PAGE` | `campushub:lastVisitedPage` | Restore active tab on reload |
| `COMPACT_DASHBOARD` | `campushub:compactDashboard` | Dashboard layout preference |
| `TASK_ORDER` | `campushub:taskOrder` | Task list sort order |
| `TASK_FILTER` | `campushub:taskFilter` | Task filter state |
| `DISMISSED_BANNER` | `campushub:dismissedBanner` | Banner dismissed flag |

---

## 11. Practicals Map

| Practical | Feature | Key File(s) |
|---|---|---|
| P1 | Node.js + Express foundation, JSON, health API | `backend/app.js`, `backend/demos/` |
| P2 | JSON task management CRUD | `TasksPage.jsx`, `taskController.js` |
| P3 | Responsive CSS (vw, media queries, flex/grid) | `index.css`, layout components |
| P4 | Browser APIs (localStorage, geolocation) | `storage.js`, `LocationWidget.jsx` |
| P5 | Bootstrap form components | `StudentRegistrationPage.jsx` (Bootstrap isolated here) |
| P6 | Tailwind CSS showcase | `TailwindDemoPage.jsx` |
| P7 | Vue.js custom directives | `VueDemoPage.jsx`, `src/vue-practical/` |
| P8 | MySQL CRUD integration | `StudentsPage.jsx`, `studentController.js`, `schema.sql` |

---

## 12. Key Coding Conventions

### Frontend
- **Imports:** Use `@/` alias. Never relative `../../` paths
- **Components:** Named exports (`export function Foo`). Only `App.jsx` uses default export
- **Styling:** Tailwind utility classes. No inline `style={{}}` unless technically required. Use `cn()` from `@/lib/utils` for conditional classes
- **Icons:** `lucide-react` only. Import individually by name. No emoji as UI elements
- **Routing:** Tab-based only via `activeTab` state in `App.jsx`. No React Router
- **Services:** All API calls go through `src/services/` files using `fetch()`

### Backend
- **Module system:** CommonJS (`require`/`module.exports`). NOT ESM `import/export`
- **DB queries:** Always use `db.query(sql, [params])` — parameterized, never string interpolation
- **Error handling:** All async controller methods in try/catch, return proper HTTP status codes
- **Env vars:** Load via `dotenv` referencing root `.env`

---

## 13. What NOT to Do

- Do NOT add React Router or any client-side routing library
- Do NOT use TailwindCSS v4 (project uses v3.4)
- Do NOT add new color tokens outside `index.css :root`
- Do NOT use gradient backgrounds or text gradients
- Do NOT use emojis as primary UI elements
- Do NOT use Bootstrap or Vue code outside their dedicated practical pages
- Do NOT commit `.env` or any credentials
- Do NOT use `style={{}}` inline styles for layout/colors (Tailwind only)
- Do NOT use ESM `import/export` syntax in backend files
- Do NOT change the tab-based navigation to React Router
- Do NOT create monolithic files — split into focused components
- Do NOT use SaaS terminology (Leads, Revenue, Conversion) — use academic terms only

---

## 14. Git Commit Convention

Use Conventional Commits:
```
feat: implement [feature]
fix: handle [problem]
refactor: simplify [component]
docs: update [documentation]
chore: [maintenance task]
```

Commit only at meaningful checkpoints (completed feature/practical/module). Never commit broken code. Never commit `.env`. Always verify before committing.

---

## 15. File Size Warnings

These files are large — read before editing, make minimal targeted changes:

| File | Size | Notes |
|---|---|---|
| `StudentsPage.jsx` | ~44 KB | Full MySQL CRUD UI, Practical 8 |
| `StudentRegistrationPage.jsx` | ~43 KB | Bootstrap form demo, Practical 5 |
| `TailwindDemoPage.jsx` | ~39 KB | Tailwind showcase, Practical 6 |
| `TasksPage.jsx` | ~31 KB | Task management UI, Practical 2 |
