# CampusHub — Practical 7: Vue.js Custom Directives · Library Module

## 1. Objective
Implement a real library catalogue and book request module using **Vue 3 Custom Directives** within CampusHub, demonstrating:
1. Five custom directives with real use cases (not tutorial demos)
2. Vue 3 Composition API with `setup()`, `ref()`, `computed()`, `onMounted()`
3. Strict framework isolation (Vue mounted inside React container)

---

## 2. Module Overview

The **Library** module (`vue-demo` tab) provides:

### Catalogue View
- Searchable book grid (15 academic textbooks)
- Category filter dropdown
- "Available Only" toggle
- Book detail drawer (slide-in panel)
- Book request/reservation workflow

### My Requests View
- Request history table
- Status badges (Pending / Approved / Rejected)
- Librarian-only action buttons (hidden for student role)

---

## 3. Custom Directives

Each directive is in its own file under `frontend/src/vue-practical/directives/`:

| Directive | File | Real Use Case | Lifecycle Hooks |
|---|---|---|---|
| `v-debounce` | `debounce.js` | Delays catalogue search input handler by 300ms to avoid excessive API calls | `mounted`, `unmounted` |
| `v-click-outside` | `clickOutside.js` | Closes category filter dropdown and book detail drawer when clicking outside | `mounted`, `unmounted` |
| `v-focus` | `focus.js` | Auto-focuses search input on page load | `mounted` |
| `v-tooltip` | `tooltip.js` | Shows availability counts on hover over status badges ("2 of 5 copies available") | `mounted`, `updated`, `unmounted` |
| `v-permission` | `permission.js` | Hides librarian-only approve/reject actions for student users | `mounted`, `updated` |

---

## 4. Framework Isolation Strategy

- **React Container:** `LibraryPage.jsx` uses `useRef` + `useEffect` to mount Vue
- **Mount:** `createApp(LibraryApp)` → register directives → `app.mount(ref.current)`
- **Cleanup:** `app.unmount()` in `useEffect` cleanup — zero memory leaks
- **No Global State:** Vue has no Router, Pinia, or global plugins
- **Styling:** Tailwind classes for portal consistency (not separate Vue CSS)

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/library/books` | List books (optional `?search=`, `?category=`, `?available=true`) |
| `GET` | `/api/library/books/:id` | Get single book details |
| `GET` | `/api/library/requests` | List all book requests |
| `POST` | `/api/library/requests` | Create a new book request |

Backend uses JSON-file-based CRUD (same pattern as `taskController.js`).

---

## 6. File Structure

```
frontend/src/pages/library/
└── LibraryPage.jsx              # React wrapper, mounts Vue app

frontend/src/vue-practical/
├── LibraryApp.js                 # Vue 3 component with template + setup()
└── directives/
    ├── debounce.js               # v-debounce
    ├── clickOutside.js           # v-click-outside
    ├── focus.js                  # v-focus
    ├── tooltip.js                # v-tooltip
    └── permission.js             # v-permission

frontend/src/services/
└── libraryService.js             # API client for library endpoints

backend/
├── controllers/libraryController.js   # JSON CRUD operations
├── routes/libraryRoutes.js            # Express route definitions
└── data/
    ├── books.json                     # 15 academic book records
    └── bookRequests.json              # Book request records
```

---

## 7. Book Data

15 fictional academic textbooks across categories:
- **Computer Science** (8): Algorithms, DBMS, Networks, OS, Design Patterns, Clean Code, AI, Compilers
- **Electronics** (3): Art of Electronics, Electric Circuits, Signals & Systems
- **Mathematics** (3): Linear Algebra, Discrete Math, Probability & Statistics
- **Mechanical** (1): Engineering Mechanics
