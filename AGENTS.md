# CampusHub — Global AI Rules & Restrictions

These rules are mandatory for every phase of CampusHub development.

---

## 1. Design Philosophy
CampusHub is a real academic management portal.
The interface must feel like:
- A university information system
- An academic management platform
- A professional enterprise dashboard

It must **NOT** feel like:
- An AI-generated landing page
- A startup marketing website
- A gaming dashboard
- A social media application
- A portfolio website
- A flashy SaaS template

> **Core Principle:** Prioritize usability, clarity, consistency, and information hierarchy over visual effects.

---

## 2. Color Restrictions
Use a restrained academic/professional color system.
- **Allowed:** One primary brand color, neutral backgrounds, neutral text colors, one success color, one warning color, one destructive/error color, one informational color.
- **Prohibited:** Random new colors, rainbow cards/dashboards, neon colors, excessive purple/blue gradients, gradient backgrounds/text, glowing effects, colored shadows, glassmorphism defaults, arbitrary transparency.
- All colors must come from the central theme/token system.

---

## 3. Font Restrictions
- Use one primary UI font family throughout the application.
- At most: one primary font + one optional monospace font for code/technical data.
- Hierarchy: page title > section title > card title > body > metadata > helper/error text.
- Prioritize readability and consistency.

---

## 4. Typography Size Restrictions
- Avoid giant hero headings (48px+, 64px+, 80px+) inside authenticated portal pages.
- Dashboard pages must remain information-dense, practical, and responsive.

---

## 5. Layout Restrictions
- **Desktop:** Sidebar + Header + Main content
- **Mobile:** Top bar + Sheet/drawer navigation + Main content
- Maintain consistent sidebar width, content max-width, spacing, page padding, header height, card spacing, and table spacing across all modules.

---

## 6. Spacing Restrictions
- Use Tailwind spacing tokens consistently (no arbitrary values like `margin: 13px`, `padding: 17px` unless technically required).

---

## 7. Card Restrictions
- Use cards for: statistics, summaries, notices, profile info, grouped controls.
- Avoid nesting cards inside cards unnecessarily. Use plain layout sections when cards are redundant.

---

## 8. Border Radius & 9. Shadows
- Consistent radius across components (pill shapes reserved for badges/status/compact filters).
- Use subtle elevation, borders, surface contrast; strong shadows only for dialogs, popovers, dropdowns.

---

## 10. Icon Restrictions
- Use Lucide icons consistently.
- Do NOT use emojis (✅ 📚 🎓 🔥 🚀) as primary UI elements.
- Icons must have functional purpose.

---

## 11. Buttons & 12. Action Safety
- Clear primary (Create/Save/Submit/Update), secondary (Cancel/Back/View/Filter), and destructive (Delete/Remove/Revoke) actions.
- Destructive actions require confirmation dialogs and immediate visual feedback (success/error).

---

## 13. Forms & 14. Tables
- Visible labels, explicit validation, error messages, loading states, and reset handling.
- Tables prioritize readability: clear headers, alignment, consistent row height, pagination/search/sorting where useful, responsive horizontal scrolling on mobile.

---

## 15. Dashboard & 21. Content
- Realistic academic metrics only (attendance, courses, assignments, results, students, faculty, notices).
- Realistic academic terminology (Student, Faculty, Course, Semester, Department, Enrollment — no SaaS metrics like Leads, Revenue, Conversion).

---

## 16. Animations & 17. Hover Effects
- Subtle and functional (sidebar/modal transitions, loading spinners, subtle hover background/border/opacity).
- No bouncing, continuous background loops, or exaggerated scaling.

---

## 18. States (Loading, Empty, Error)
- Skeletons, spinners, disabled submit buttons during actions.
- Intentional empty states with contextual action ("No assignments found").
- Clean, user-friendly error messages (no raw stack traces in UI).

---

## 22. Demo Data & 23. Reference Rules
- Fictional academic data (e.g., Aarav Mehta, CS2026001). Never real credentials or PII.
- Reference Nirma MIS/LMS for workflows/terminology only; CampusHub remains an original implementation. Never bypass auth or scrape external systems.

---

## 25. Code & 26. Dependencies
- Clean modular code, no giant monolithic files, no duplication.
- shadcn/ui + Tailwind as primary stack. Check existing packages before adding dependencies.

---

## 29. Bootstrap & 30. Vue Practicals
- Bootstrap is isolated strictly for the Bootstrap practical demonstration.
- Vue is isolated strictly for the Vue custom-directive practical.
- Primary system remains React/Tailwind/shadcn.

---

## 31–38. Execution & Phase Boundaries
- Responsive (mobile/tablet/desktop tested).
- Make minimal clean modifications; preserve working code.
- Implement strictly within the current phase boundary (no jumping ahead to later databases/auth).
- Verify and test before reporting completion.
- Choose "works clearly and professionally" over "looks flashy".

# GIT COMMIT & VERSION CONTROL RULES

These rules apply to every CampusHub development phase.

==================================================

1. COMMIT WHEN A MEANINGFUL CHECKPOINT IS COMPLETE
   ==================================================

Create a Git commit when a meaningful, tested unit of work is completed.

Do NOT wait until the entire project is finished.

Do NOT create a commit for every tiny file modification.

Good commit points include:

* project initialization
* completed practical
* completed major feature
* completed database integration
* completed authentication
* completed RBAC
* completed frontend module
* completed API module
* completed deployment configuration
* important bug fix

==================================================
2. NEVER COMMIT BROKEN WORK
===========================

Before committing:

1. Run the relevant application.
2. Test the feature.
3. Check browser console.
4. Check backend terminal.
5. Run relevant build/test commands.
6. Confirm there are no known blocking errors.

Only commit after the checkpoint is verified.

==================================================
3. COMMIT AFTER EACH COMPLETED PHASE
====================================

At minimum, create one commit after each successfully completed phase.

Example:

Phase 1:
feat: initialize CampusHub foundation

Phase 2:
feat: implement JSON task management

Phase 3:
feat: add responsive portal design

Phase 4:
feat: integrate browser APIs

Phase 5:
feat: add Bootstrap practical implementation

Phase 6:
feat: integrate Tailwind and shadcn UI

Phase 7:
feat: add Vue custom directives

Phase 8:
feat: integrate MySQL academic data

Phase 9:
feat: implement authentication and RBAC

Phase 10:
feat: integrate MongoDB CRUD

Phase 11:
test: verify CampusHub modules

Phase 12:
chore: configure deployment

==================================================
4. COMMIT MESSAGE FORMAT
========================

Use Conventional Commit style.

Preferred types:

feat:
fix:
docs:
refactor:
test:
chore:

Examples:

feat: implement student task management

fix: handle empty assignment state

docs: update practical 4 documentation

refactor: simplify dashboard components

test: verify attendance API

chore: configure deployment

==================================================
5. DO NOT USE VAGUE COMMIT MESSAGES
===================================

Avoid:

update
changes
final
done
work
new changes
latest
testing
stuff
fixes

The commit message must explain what changed.

==================================================
6. DO NOT COMMIT SECRETS
========================

Never commit:

.env
passwords
API keys
database credentials
tokens
private keys
session secrets

Ensure .gitignore protects them.

Maintain:

.env.example

with placeholder values where necessary.

==================================================
7. CHECK GIT STATUS BEFORE COMMIT
=================================

Before committing:

git status

Review the changed files.

Do not blindly commit unrelated files.

==================================================
8. REVIEW THE DIFF
==================

Before important commits, inspect:

git diff

Make sure:

* no accidental files are included
* no secrets are included
* no debug code remains
* no temporary files remain
* no unrelated changes are included

==================================================
9. DO NOT CREATE ARTIFICIAL COMMITS
===================================

Do not create commits simply because a certain number of commits has been reached.

Commit based on meaningful project milestones.

==================================================
10. PHASE COMPLETION CHECKPOINT
===============================

At the end of every phase:

1. Verify the phase.
2. Update documentation.
3. Check Git status.
4. Review the diff.
5. Create the phase commit.
6. Report the commit hash.
7. Only then consider the phase complete.

==================================================
11. PUSH RULE
=============

Do NOT automatically push to GitHub after every commit.

Create the local commit first.

After a phase is verified, tell me:

* commit message
* commit hash
* branch
* whether the working tree is clean
* whether pushing is recommended

Wait for explicit instruction before pushing unless I have specifically authorized automatic pushes for the project.

==================================================
12. ROLLBACK SAFETY
===================

Before major architectural changes:

* ensure the current work is committed
* do not destroy working functionality
* use Git history as a recovery point

Never delete a working implementation simply to replace it with a new approach without checking the current implementation first.

==================================================
13. PHASE HANDOFF
=================

A phase is considered complete only when:

Implementation
+
Testing
+
Documentation
+
Git commit

are all completed.

The next phase should begin from a clean, committed checkpoint whenever practical.
