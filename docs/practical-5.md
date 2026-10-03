# CampusHub — Practical 5: Bootstrap 5 · Student Admissions Module

## 1. Objective
Implement a real student admission and enrollment module using **Bootstrap 5** within CampusHub, demonstrating:
1. **Bootstrap Online CDN Integration:** Live switching to jsDelivr CDN.
2. **Bootstrap Offline / Local Usage:** Bundled via `bootstrap` npm package with Vite inline CSS loader.
3. **Bootstrap 5 Admission Form:** Multi-section enrollment form with comprehensive validation, draft persistence, and API submission.

---

## 2. Module Overview

The **Admissions** module (`student-registration` tab) provides a complete student enrollment workflow:
- Multi-section Bootstrap form: Personal, Contact, Academic, Guardian, Declaration
- Client-side validation with `is-valid` / `is-invalid` states
- Input groups, selects, radios, checkboxes
- Confirm modal (`Bootstrap modal`) before submission
- Draft auto-save to `localStorage` (debounced 500ms)
- API submission to `POST /api/students` with error handling (duplicate roll number / email)
- Recent enrollments table from `GET /api/students`

---

## 3. Bootstrap Isolation Strategy

Bootstrap CSS is loaded on mount and removed on unmount to prevent style bleeding into Tailwind/shadcn:
- **Local Mode:** `import localBootstrapCss from "bootstrap/dist/css/bootstrap.min.css?inline"` injected as a `<style>` tag
- **CDN Mode:** `<link>` tag pointing to jsDelivr CDN injected into `document.head`
- **Cleanup:** Both tags removed in `useEffect` cleanup function

---

## 4. File Structure

```
frontend/src/pages/admissions/
├── AdmissionsPage.jsx       # Page shell, Bootstrap CSS lifecycle, alerts, composition
├── AdmissionForm.jsx         # Multi-section form, validation, draft save, submit flow
├── ConfirmSubmitModal.jsx    # Bootstrap modal for review before submission
├── RecentEnrollments.jsx     # Bootstrap table of recent students from API
└── SubmissionAlert.jsx       # Bootstrap alert for success/error feedback

frontend/src/services/
└── admissionService.js       # API wrapper for POST/GET /api/students
```

---

## 5. Bootstrap Components Demonstrated

| Bootstrap Component | Usage |
|---|---|
| Grid (`row`, `col-md-*`) | Form layout across breakpoints |
| Form Controls (`form-control`, `form-select`) | All input fields |
| Input Groups (`input-group`, `input-group-text`) | Roll number, email, mobile prefixes |
| Validation States (`is-valid`, `is-invalid`, `invalid-feedback`) | Field-level validation |
| Radio Buttons (`form-check`, `form-check-input`) | Gender selection |
| Checkboxes | Declaration agreement |
| Modal (`modal`, `modal-dialog`, `modal-content`) | Confirm submission |
| Alert (`alert`, `alert-dismissible`) | Success/error feedback |
| Table (`table`, `table-hover`, `table-bordered`) | Recent enrollments |
| Badge (`badge`) | Roll number display, practical label |
| Button Groups (`btn-group`) | Bootstrap source toggle (Local/CDN) |
| Spinner (`spinner-border`) | Loading and submit states |
