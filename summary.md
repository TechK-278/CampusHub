# CampusHub --- Remaining Phases Summary

## Purpose

This file is a handoff summary for Claude to generate the **master
prompts for the remaining CampusHub phases**.

CampusHub is a continuous university Full Stack Development project.
Phases 1--8 are already completed. Only Phases 9, 10, and 11 remain.

------------------------------------------------------------------------

# Current Status

  Phase   Practical                                    Status
  ------- -------------------------------------------- -----------
  1       Foundation + Node.js basics                  COMPLETED
  2       JSON + Task CRUD                             COMPLETED
  3       Responsive Web Design                        COMPLETED
  4       Geolocation + Local Storage + Drag & Drop    COMPLETED
  5       Bootstrap 5 + Student Registration           COMPLETED
  6       Tailwind CSS                                 COMPLETED
  7       Vue.js Custom Directives                     COMPLETED
  8       Node.js + MySQL                              COMPLETED
  9       Role-Based Authentication / Access Control   NEXT
  10      Node.js + MongoDB                            PENDING
  11      Git/GitHub + Deployment                      PENDING

------------------------------------------------------------------------

# Existing Architecture

## Frontend

-   React 18
-   Vite
-   JavaScript
-   Tailwind CSS
-   shadcn/ui
-   Lucide React

## Backend

-   Node.js
-   Express.js

## Databases

### MySQL --- already implemented

Database: `campushub`

Primary table: `students`

Already supports: - Create student - Read students - Update student -
Delete student - Search/filter - SELECT DISTINCT departments - MySQL
stored function `calculate_grade(score)` - Database health endpoint

Uses `mysql2/promise`, connection pooling, and environment variables.

### JSON

Practical 2 task management uses JSON storage.

Do not unnecessarily replace the existing JSON task system.

### Vue

Vue 3 is installed only for Practical 7 and remains isolated from the
main React application.

### Bootstrap

Bootstrap 5 is isolated to Practical 5.

### Tailwind

Tailwind CSS is the main styling system.

## Git

Repository:

`https://github.com/TechK-278/CampusHub.git`

Branch:

`main`

Git identity:

`TechK <krushnbagdana@gmail.com>`

Latest confirmed Phase 8 commit:

`adb89ad` --- `feat: integrate MySQL student management`

------------------------------------------------------------------------

# Global Rules for All Remaining Phases

Claude-generated prompts must instruct Antigravity to:

1.  Read and follow `AGENTS.md`.
2.  Read the existing implementation before modifying it.
3.  Preserve the existing architecture.
4.  Keep React as the main frontend.
5.  Keep Tailwind/shadcn/ui as the main UI system.
6.  Keep Bootstrap isolated to Practical 5.
7.  Keep Vue isolated to Practical 7.
8.  Keep JSON task storage intact.
9.  Keep MySQL Student Management intact.
10. Use fictional demo data only.
11. Never commit secrets or `.env`.
12. Use environment variables for credentials/secrets.
13. Validate frontend and backend inputs where appropriate.
14. Maintain accessibility and responsive behavior.
15. Avoid unnecessary dependencies.
16. Test the actual implementation.
17. Run regression tests for previous practicals.
18. Update documentation.
19. Create one meaningful Git checkpoint commit.
20. Push to `origin/main`.
21. Never use force push for normal phase work.
22. Stop after the requested phase.

------------------------------------------------------------------------

# Phase 9 --- Role-Based Authentication / Access Control

## Objective

Implement real authentication and role-based authorization.

This must NOT be frontend-only. The backend must enforce authorization.

## Architecture

``` text
React Login
    ↓
Express Authentication API
    ↓
MySQL users table
    ↓
Password verification
    ↓
JWT
    ↓
Authentication middleware
    ↓
Role authorization middleware
    ↓
Protected API
```

## Technologies

Use the existing: - React - Node.js - Express.js - MySQL

Expected additional packages: - bcrypt/bcryptjs - jsonwebtoken

Do not add unnecessary authentication frameworks.

## MySQL Users Table

Create a `users` table containing appropriate fields such as:

-   id
-   username
-   email
-   password_hash
-   role
-   full_name
-   created_at
-   updated_at

Roles:

-   `student`
-   `faculty`
-   `admin`

Username/email should be unique.

Passwords must be bcrypt/bcryptjs hashes.

Never store plaintext passwords.

## Authentication

Implement:

``` text
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Login should: 1. Receive username/password. 2. Find the user. 3. Compare
password with bcrypt. 4. Generate JWT. 5. Return safe user information
and token.

Never return `password_hash`.

Invalid credentials should return `401`.

Use a generic authentication error.

## JWT

JWT should contain only necessary data, such as:

-   user ID
-   username
-   role

JWT secret must come from `.env`.

Example:

``` text
JWT_SECRET=
JWT_EXPIRES_IN=2h
```

## Authorization

Create reusable middleware such as:

``` text
authorizeRoles("admin")
authorizeRoles("faculty", "admin")
```

Distinguish:

-   `401` = not authenticated
-   `403` = authenticated but not authorized

## Role Permissions

### Student

-   Student-facing academic resources
-   Cannot perform administrative operations

### Faculty

-   Academic/student-management resources according to the implemented
    policy
-   Cannot access admin-only resources

### Admin

-   Administrative functionality
-   Admin-only resources

The exact permissions must be documented.

## Protected API Demonstration

Implement clear protected endpoints, for example:

``` text
GET /api/protected/profile
GET /api/protected/academic
GET /api/protected/admin
```

Suggested access:

``` text
profile  → authenticated users
academic → faculty + admin
admin    → admin only
```

## Frontend

Create a login page with:

-   username
-   password
-   show/hide password
-   validation
-   loading state
-   authentication errors
-   fictional demo-account information

Create reusable auth state, for example:

``` text
AuthContext
```

Expose:

-   user
-   token
-   login()
-   logout()
-   isAuthenticated
-   loading/initialization state

## Protected UI

Implement protected routes/pages.

Logged-out users should be redirected to Login.

Authenticated users without permission should see:

``` text
403 — Access Denied
```

Frontend visibility is not the security boundary. Backend authorization
is mandatory.

## Role-Based Navigation

Example:

Student: - Dashboard - Academic - Tasks - Profile

Faculty: - Dashboard - Students - Academic - Tasks - Profile

Admin: - Dashboard - Students - User Management - Academic - Tasks -
Profile

## Existing Student Module

Integrate authorization with the existing MySQL Student Management
module.

Do not break Phase 8.

Do not rebuild the MySQL module.

## Security

Require:

-   bcrypt password hashing
-   JWT secret in `.env`
-   parameterized SQL
-   backend authorization
-   no plaintext passwords
-   no password logging
-   no committed secrets
-   safe error responses

## Testing

Require actual tests for:

1.  Valid student login → 200
2.  Valid faculty login → 200
3.  Valid admin login → 200
4.  Invalid credentials → 401
5.  Missing token → 401
6.  Invalid/expired token → 401
7.  Student → admin endpoint → 403
8.  Faculty → admin endpoint → 403
9.  Admin → admin endpoint → 200
10. Authenticated user → protected endpoint → 200
11. Logout
12. Protected frontend while logged out
13. Role-based navigation
14. Student Management authorization
15. P1--P8 regression

## Documentation

Create:

`docs/practical-9.md`

Cover: - authentication vs authorization - roles - users table -
password hashing - JWT - middleware - protected APIs - frontend auth
state - protected routes - role-based navigation - 401 vs 403 -
security - testing - viva explanation

## Git Checkpoint

Use:

`feat: add role based authentication`

Push to `origin/main`.

Do not force push.

------------------------------------------------------------------------

# Phase 10 --- Node.js + MongoDB

## Objective

Introduce MongoDB and implement real Node.js + MongoDB CRUD.

Do NOT replace MySQL.

## Architecture

``` text
React
   ↓
Express API
   ↓
MongoDB Driver
   ↓
MongoDB Collection
```

## Technology

Use: - Node.js - Express.js - MongoDB - official MongoDB Node.js driver

Avoid unnecessary ORMs/ODMs.

## Database / Collection

Use a MongoDB database such as:

`campushub`

Create a document-oriented academic collection.

Recommended:

`notices`

Example document:

``` text
{
  title,
  description,
  category,
  department,
  postedBy,
  priority,
  publishDate,
  createdAt
}
```

Use fictional data.

## CRUD APIs

Implement:

``` text
POST /api/notices
GET /api/notices
GET /api/notices/:id
PUT /api/notices/:id
DELETE /api/notices/:id
```

Use proper MongoDB ObjectId handling.

Invalid ObjectIds must not crash the server.

## Frontend

Create a CampusHub Notices/Academic Notices module.

Features: - list notices - create notice - edit notice - delete notice -
search/filter - loading - error - empty state - delete confirmation

Use React + Tailwind + shadcn/ui + Lucide.

Do not use Bootstrap or Vue for this module.

## Environment Variables

Add appropriate MongoDB configuration to `.env.example`, for example:

``` text
MONGODB_URI=
MONGODB_DB_NAME=campushub
```

Never commit credentials.

## Backend

Create a reusable MongoDB connection layer.

Do not open a new database connection for every request.

Follow the existing backend architecture.

## Validation and Errors

Validate: - required fields - title length - description - category -
department - priority - dates

Handle: - MongoDB unavailable - invalid ObjectId - missing record -
validation errors

Do not expose raw MongoDB errors.

## Authentication Integration

Reuse Phase 9 authentication middleware.

Suggested policy:

-   students → read notices
-   faculty → create/update notices
-   admin → delete notices

The exact policy must be documented.

Do not rebuild authentication.

## Testing

Require actual tests for:

1.  MongoDB connection
2.  POST/create
3.  GET all
4.  GET by ID
5.  PUT/update
6.  DELETE
7.  invalid ObjectId
8.  missing record
9.  validation errors
10. authentication/authorization
11. frontend CRUD
12. P1--P9 regression
13. production build

## Documentation

Create:

`docs/practical-10.md`

Cover: - MongoDB - database - collection - document structure -
connection - CRUD - ObjectId - API endpoints - frontend - validation -
errors - authentication integration - setup - testing - viva explanation

## Git Checkpoint

Use:

`feat: integrate MongoDB academic notices`

Push to `origin/main`.

Do not force push.

------------------------------------------------------------------------

# Phase 11 --- Git/GitHub + Deployment

## Objective

Complete the project with:

-   Git version control
-   GitHub
-   meaningful commits
-   production build
-   deployment

## Existing Repository

Use the existing repository:

`https://github.com/TechK-278/CampusHub.git`

Branch:

`main`

Do not create another repository unless necessary.

## Git Requirements

Use:

``` text
git status
git branch -vv
git diff
git log
```

Never commit:

-   `.env`
-   passwords
-   DB credentials
-   JWT secrets
-   MongoDB credentials
-   API keys
-   node_modules
-   build junk

Use meaningful conventional commits.

Do not create artificial commits.

Do not force push.

## Deployment Architecture

Deploy the completed application with:

-   React/Vite frontend
-   Express backend
-   production MySQL
-   production MongoDB
-   environment variables
-   correct CORS
-   production API URL

Do not assume localhost databases work in production.

## Frontend

Run:

``` text
npm run build
```

Configure the frontend with the production backend API URL.

## Backend

The Express backend must:

-   use the platform-provided port
-   use environment variables
-   connect to production databases
-   expose API routes
-   configure CORS
-   provide a health endpoint

Do not hard-code production port.

## Databases

Clearly separate:

``` text
Local MySQL
Production MySQL
```

and:

``` text
Local MongoDB
Production MongoDB
```

Never publish credentials.

## Environment Variables

Document only variables actually used, potentially including:

``` text
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME

MONGODB_URI
MONGODB_DB_NAME

JWT_SECRET
JWT_EXPIRES_IN

FRONTEND_URL
API_BASE_URL
PORT
```

## CORS

Configure production CORS using the deployed frontend URL.

## Deployment Verification

After deployment verify:

1.  Frontend loads
2.  Backend health endpoint works
3.  Login works
4.  Role-based access works
5.  MySQL Student Management works
6.  MongoDB Notices works
7.  JSON task module works
8.  Previous practical pages work
9.  No browser console errors
10. No broken API URLs
11. No mixed-content issues
12. Responsive UI works

## Documentation

Update:

`README.md`

Include: - project overview - stack - architecture - local setup -
environment variables - database setup - frontend setup - backend
setup - deployment - deployed URL - GitHub URL - practical mapping

Create/update:

`docs/deployment.md`

Cover: - deployment architecture - frontend - backend - MySQL -
MongoDB - environment variables - CORS - troubleshooting - verification
checklist

## Final Git Checkpoint

Use:

`feat: deploy CampusHub`

Push to `origin/main`.

Do not force push.

------------------------------------------------------------------------

# Recommended Order for Claude

Generate the master prompts separately in this order:

``` text
Phase 9 — Role-Based Authentication
        ↓
Phase 10 — Node.js + MongoDB
        ↓
Phase 11 — GitHub + Deployment
```

Each prompt should follow:

``` text
Read existing project
        ↓
Implement ONLY current phase
        ↓
Test current phase
        ↓
Regression test previous phases
        ↓
Update documentation
        ↓
git status + git diff
        ↓
One meaningful commit
        ↓
Push origin/main
        ↓
Verify clean working tree
        ↓
STOP
```

Do not combine all three implementation phases into one prompt.

------------------------------------------------------------------------

# Final Goal

After Phase 11, CampusHub should contain:

-   React frontend
-   Tailwind CSS
-   shadcn/ui
-   Bootstrap practical demonstration
-   Vue practical demonstration
-   Node.js + Express backend
-   JSON task module
-   Browser API demonstrations
-   MySQL Student Management
-   JWT authentication
-   Role-based access control
-   MongoDB academic module
-   Git/GitHub history
-   Production deployment
-   Complete practical documentation

The final project should remain one continuous College Management Portal
rather than a collection of unrelated mini-projects.
