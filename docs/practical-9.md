# Practical 9: Role-Based Authentication & Access Control (RBAC)

## 1. Practical Objective

To design and implement a secure **Role-Based Authentication and Access Control (RBAC)** architecture in Node.js and Express with MySQL persistent user storage, BCrypt password hashing, JSON Web Tokens (JWT), and frontend session gating in React.

Key aspects demonstrated:
1. **User Storage:** MySQL `users` table with username/email uniqueness and role enumeration (`student`, `faculty`, `admin`).
2. **Password Security:** One-way salted hashing using `bcryptjs` (salt cost: 10) — passwords never stored or returned in plaintext.
3. **Stateless JWT Sign-in:** HS256 algorithm signing minimal claims (`sub`, `username`, `role`) with configurable token expiry.
4. **Middleware Enforcement:** Authorization middleware chain verifying tokens, querying authoritative live roles from MySQL, and returning strict HTTP `401 Unauthorized` vs `403 Forbidden` responses.
5. **Brute-Force Protection:** In-memory login throttling returning HTTP `429 Too Many Requests` after 5 failed attempts per user/IP within 15 minutes.
6. **Frontend State & Guards:** React `AuthContext`, Bearer token injector `apiClient`, tab-based `ProtectedTab` guards, role-filtered navigation, and admin User Management.

---

## 2. Architecture Overview

```
               ┌────────────────────────────────────────┐
               │           React Frontend (SPA)         │
               │   LoginPage ── AuthContext ── Sidebar  │
               └───────────────────┬────────────────────┘
                                   │ Authorization: Bearer <token>
                                   ▼
               ┌────────────────────────────────────────┐
               │        Express Backend Server          │
               │           (backend/app.js)             │
               └───────────────────┬────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
        ┌───────────────────────┐     ┌───────────────────────┐
        │  authenticateToken    │     │    authorizeRoles     │
        │ - Verifies JWT (HS256)│ ──► │ - Checks live role    │
        │ - Loads user from DB  │     │ - 401 unauth / 403 FB │
        └───────────────────────┘     └───────────────────────┘
                    │                             │
                    └──────────────┬──────────────┘
                                   ▼
               ┌────────────────────────────────────────┐
               │        MySQL Database (campushub)      │
               │        Table: `users` & `students`     │
               └────────────────────────────────────────┘
```

---

## 3. Database Schema (`users` Table)

File: [`backend/database/schema.sql`](file:///E:/College/Sem-5/Practicals/FSD/CampusHub/backend/database/schema.sql)

```sql
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
```

### Seeded Fictional Demo Accounts
File: [`backend/database/seedUsers.js`](file:///E:/College/Sem-5/Practicals/FSD/CampusHub/backend/database/seedUsers.js)

| Role | Username | Email | Demo Password | Full Name |
|---|---|---|---|---|
| **Student** | `aarav.mehta` | `aarav.mehta@campushub.test` | `Student@123` | Aarav Mehta |
| **Faculty** | `prof.nair` | `prof.nair@campushub.test` | `Faculty@123` | Prof. Harish Nair |
| **Admin** | `admin.campus` | `admin.campus@campushub.test` | `Admin@123` | Campus Administrator |

---

## 4. Permission Matrix

| Resource / Endpoint | Method | Public | Student | Faculty | Admin |
|---|---|:---:|:---:|:---:|:---:|
| `/api/auth/login` | POST | ✅ | ✅ | ✅ | ✅ |
| `/api/auth/me` | GET | ❌ (401) | ✅ | ✅ | ✅ |
| `/api/auth/logout` | POST | ❌ (401) | ✅ | ✅ | ✅ |
| `/api/protected/profile` | GET | ❌ (401) | ✅ | ✅ | ✅ |
| `/api/protected/academic` | GET | ❌ (401) | ❌ (403) | ✅ | ✅ |
| `/api/protected/admin` | GET | ❌ (401) | ❌ (403) | ❌ (403) | ✅ |
| `/api/tasks` (JSON Storage) | GET, POST, PUT, DELETE | ❌ (401) | ✅ | ✅ | ✅ |
| `/api/students` | GET, POST, PUT | ❌ (401) | ❌ (403) | ✅ | ✅ |
| `/api/students/:id` | DELETE | ❌ (401) | ❌ (403) | ❌ (403) | ✅ |
| `/api/students/demo-drop-table` | POST | ❌ (401) | ❌ (403) | ❌ (403) | ✅ (Dev only) |
| `/api/database` | GET | ❌ (401) | ❌ (403) | ❌ (403) | ✅ |
| `/api/users` | GET, POST, PUT, DELETE | ❌ (401) | ❌ (403) | ❌ (403) | ✅ |
| `/api/health` | GET | ✅ | ✅ | ✅ | ✅ |
| `/api/demo-data` | GET | ✅ | ✅ | ✅ | ✅ |

---

## 5. Key Implementation Details

### 5.1 Password Hashing & Timing-Attack Mitigation
File: [`backend/controllers/authController.js`](file:///E:/College/Sem-5/Practicals/FSD/CampusHub/backend/controllers/authController.js)

```javascript
// Dummy hash evaluated when user does not exist to prevent timing-based user enumeration
const DUMMY_HASH = "$2a$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKGPCgg6u";

if (users.length === 0) {
  await bcrypt.compare(password, DUMMY_HASH);
  recordFailedLogin(throttleKey);
  return res.status(401).json({ success: false, error: "Invalid username or password." });
}
```

### 5.2 Authoritative Live Role Verification
File: [`backend/middleware/auth.js`](file:///E:/College/Sem-5/Practicals/FSD/CampusHub/backend/middleware/auth.js)

When authenticating a request, `authenticateToken` does not simply trust the role claim embedded inside the token payload. It queries the live MySQL `users` table:
```javascript
const users = await query(
  "SELECT id, username, email, role, full_name, created_at FROM users WHERE id = ?",
  [decoded.sub]
);
if (users.length === 0) {
  return res.status(401).json({ success: false, error: "User account no longer exists." });
}
req.user = users[0]; // Authoritative role from database
```

### 5.3 401 Unauthorized vs 403 Forbidden
- **401 Unauthorized:** The client has not supplied a valid authorization token (missing, malformed, tampered, or expired).
- **403 Forbidden:** The client is authenticated and identity is known, but lacks sufficient role privileges for the requested action.

### 5.4 In-Memory Rate Limiting
File: [`backend/middleware/auth.js`](file:///E:/College/Sem-5/Practicals/FSD/CampusHub/backend/middleware/auth.js)
- Limits failed login attempts to **5 attempts per 15 minutes** per `username + IP`.
- Returns `HTTP 429 Too Many Requests` on exceeding threshold.
- Resets automatically upon successful authentication or server restart.

---

## 6. Frontend Authentication Architecture

### 6.1 Session State (`AuthContext.jsx`)
File: [`frontend/src/context/AuthContext.jsx`](file:///E:/College/Sem-5/Practicals/FSD/CampusHub/frontend/src/context/AuthContext.jsx)
- Exposes `user`, `token`, `isAuthenticated`, `loading`, `login()`, `logout()`.
- Validates stored token on mount via `GET /api/auth/me`. Discards token if invalid or expired.
- Automatically handles `campushub:auth:expired` events dispatched by `apiClient.js` on 401 responses.

### 6.2 Bearer Token Injection (`apiClient.js`)
File: [`frontend/src/services/apiClient.js`](file:///E:/College/Sem-5/Practicals/FSD/CampusHub/frontend/src/services/apiClient.js)
- Reads `campushub:authToken` from localStorage and injects `Authorization: Bearer <token>`.
- On receiving an unhandled 401 from any backend endpoint, purges storage and triggers instant session logout.

### 6.3 Tab Guard & Access Denied Page
Files:
- [`frontend/src/components/auth/ProtectedTab.jsx`](file:///E:/College/Sem-5/Practicals/FSD/CampusHub/frontend/src/components/auth/ProtectedTab.jsx)
- [`frontend/src/components/auth/AccessDeniedPage.jsx`](file:///E:/College/Sem-5/Practicals/FSD/CampusHub/frontend/src/components/auth/AccessDeniedPage.jsx)
- [`frontend/src/lib/permissions.js`](file:///E:/College/Sem-5/Practicals/FSD/CampusHub/frontend/src/lib/permissions.js)

---

## 7. How to Run & Test

### 1. Seed Database Users
```bash
npm run db:seed-users
```

### 2. Run Automated Test Suite (17 Test Cases)
```bash
npm run test:auth
```

### 3. Start Backend & Frontend
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

---

## 8. Test Suite Results

```text
▶ Practical 9 — Authentication & RBAC Verification
  ✔ 1. Student login returns 200 and safe user profile with token (188ms)
  ✔ 2. Faculty login returns 200 and role=faculty (123ms)
  ✔ 3. Admin login returns 200 and role=admin (116ms)
  ✔ 4. Wrong password and unknown user return identical 401 error responses (231ms)
  ✔ 5. Requests with missing Authorization header return 401 (3ms)
  ✔ 6. Malformed, tampered, and expired tokens return 401 (11ms)
  ✔ 7. /api/protected/admin denies students (403), denies faculty (403), allows admin (200) (21ms)
  ✔ 8. /api/protected/academic denies students (403), allows faculty (200) & admin (200) (10ms)
  ✔ 9. /api/protected/profile returns 200 for any authenticated user (11ms)
  ✔ 10. /api/auth/me returns active user; /api/auth/logout returns 200 (9ms)
  ✔ 11. password_hash is never exposed in auth, user listing, or protected responses (5ms)
  ✔ 12. Students API: student 403, faculty can GET/POST/PUT but 403 on DELETE, admin can DELETE (46ms)
  ✔ 13. Tasks API requires authentication (401 unauth, 200 with student token) (4ms)
  ✔ 14. demo-drop-table returns 403 for non-admins (6ms)
  ✔ 15. Users API: admin-only, duplicate 409, cannot delete self, last admin protected (133ms)
  ✔ 16. Login throttle returns 429 after 5 failed attempts within window (575ms)
  ✔ 17. JWT_SECRET verification is enforced (0.2ms)
✔ Practical 9 — Authentication & RBAC Verification (1886ms)
ℹ tests 17 | pass 17 | fail 0
```

---

## 9. Viva Questions & Key Concepts

**Q1: What is the difference between Authentication and Authorization?**
> Authentication verifies *who* the user is (e.g. valid username and password matching a hash). Authorization determines *what* an authenticated user is permitted to do (e.g. only faculty and admins can insert students, only admins can delete users).

**Q2: Why is BCrypt preferred over MD5 or SHA256 for passwords?**
> MD5 and SHA256 are fast hash algorithms designed for integrity, making them vulnerable to brute-force GPU and rainbow table attacks. BCrypt includes a configurable work factor (cost) and automatic salt generation, making hashing deliberately slow and computationally expensive to crack.

**Q3: What data is stored inside the JWT payload in CampusHub?**
> Only non-sensitive claims: `sub` (User ID), `username`, and `role`. Sensitive fields such as `password_hash` are strictly omitted.

**Q4: How does CampusHub handle token revocation if JWTs are stateless?**
> Since standard JWTs are stateless, client logout discards the token from local storage. To protect against demoted or deleted accounts having active tokens, the backend `authenticateToken` middleware verifies each token against the live MySQL database to confirm the user exists and refresh their authoritative role.

**Q5: What is the difference between HTTP 401 and 403?**
> `401 Unauthorized` means authentication is required or the token was invalid/expired. `403 Forbidden` means authentication succeeded, but the user's role lacks permission for the specific resource.
