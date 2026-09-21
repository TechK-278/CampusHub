# CampusHub — Practical 5: Bootstrap 5 + Student Registration

## 1. Objective
To implement, verify, and demonstrate all three key requirements of **Practical 5** within **CampusHub (College Management Portal)**:
1. **Requirement I: Bootstrap Online CDN Integration:** Demonstrate Bootstrap 5 loaded via the official jsDelivr CDN link.
2. **Requirement II: Bootstrap Offline / Local Usage:** Demonstrate Bootstrap 5 bundled and served completely offline via the locally installed `bootstrap` npm package.
3. **Requirement III: Bootstrap 5 Student Registration Form:** Implement a responsive, accessible academic student registration form with comprehensive client-side validation, error states, and structured post-submission summary.

---

## 2. Practical 5 Requirements Mapping & Implementation

### Requirement I: Bootstrap Online (CDN Link)
- **CDN Source:** jsDelivr (`https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css`)
- **Version:** Bootstrap 5.3.3 (Minified + Compiled)
- **Implementation:** 
  The `StudentRegistrationPage` component includes a runtime mode selector allowing instant switching to **Online CDN Mode**. When selected, a dynamic `<link rel="stylesheet">` tag pointing to the official jsDelivr CDN is injected into `document.head`.
- **Demonstration:**
  The dedicated **CDN Demonstration** tab showcases CDN delivery advantages, HTML `<link>` configuration, and edge-distributed Bootstrap grid and alert components.

---

### Requirement II: Bootstrap Offline / Local Usage
- **Local Package:** `bootstrap@^5.3.8` installed via `npm --prefix frontend install bootstrap`
- **Asset Location:** `frontend/node_modules/bootstrap/dist/css/bootstrap.min.css`
- **Implementation:**
  Bundled directly using Vite's inline CSS loader (`import localBootstrapCss from "bootstrap/dist/css/bootstrap.min.css?inline"`). When **Offline / Local Mode** is active, styles are injected into `document.head` via a scoped `<style>` block without making any network requests.
- **Demonstration:**
  The dedicated **Offline / Local Demonstration** tab proves zero external network dependency, ideal for air-gapped lab or intranet university networks.

---

### Requirement III: Student Registration Form
- **Component:** [`frontend/src/pages/StudentRegistrationPage.jsx`](../frontend/src/pages/StudentRegistrationPage.jsx)
- **Required Fields Implemented:**
  1. **Title:** "Student Academic Registration"
  2. **Roll Number:** Alphanumeric validation (4–15 chars, e.g. `CS2026001`)
  3. **First Name:** Text validation (minimum 2 characters)
  4. **Mobile Number:** 10-digit Indian telecom validation (`/^[6-9]\d{9}$/`)
  5. **Email ID:** Standard email format validation (`student@university.edu`)
  6. **Address:** Residential street / campus address textarea
- **Academic Extensions Added:**
  - **Last Name:** Additional name field
  - **Department:** Academic dropdown (`Computer Science & Engineering`, `IT`, `ECE`, etc.)
  - **Semester:** Numerical dropdown (`Semester 1` through `Semester 8`)
  - **Division:** Class section dropdown (`Div A`, `Div B`, `Div C`)
  - **Gender:** Radio selection
  - **Declaration:** Confirmation checkbox

---

## 3. Bootstrap 5 Components Demonstrated

| Component Category | Classes / Selectors Used | Purpose in CampusHub |
| :--- | :--- | :--- |
| **Grid & Layout** | `container-fluid`, `row`, `col-12`, `col-md-6`, `col-lg-8`, `col-lg-4` | Responsive column stacking across mobile, tablet, and desktop viewports. |
| **Form Controls** | `form-control`, `form-control-sm`, `form-label`, `form-select`, `form-select-sm`, `form-check`, `input-group`, `input-group-text` | Clean, accessible inputs with country prefix and styled dropdowns. |
| **Validation States** | `is-invalid`, `invalid-feedback`, `is-valid`, `valid-feedback` | Dynamic visual indicators with helpful error messages. |
| **Cards & Headers** | `card`, `card-header`, `card-body`, `card-footer`, `shadow-sm`, `border-0` | Structured module containers, summary panels, and requirement checklists. |
| **Buttons & Groups** | `btn`, `btn-primary`, `btn-outline-secondary`, `btn-success`, `btn-danger`, `btn-group` | Mode switchers, demo autofill, reset, and submit actions. |
| **Alerts & Spinners** | `alert`, `alert-success`, `alert-info`, `alert-danger`, `spinner-border` | Real-time feedback, submission summary cards, and submission loaders. |
| **Badges & Utilities** | `badge`, `bg-primary`, `bg-secondary`, `bg-success`, `text-muted`, `d-flex` | Status indicators, version badges, and flex alignment. |

---

## 4. CSS Isolation & Safety Architecture

To avoid CSS collisions with CampusHub's primary **Tailwind CSS + shadcn/ui** design system:
1. **Dynamic Lifecycle Management:** Bootstrap styles (`<style>` or `<link>`) are attached upon mounting `StudentRegistrationPage` and automatically removed on unmount.
2. **Zero Global Bleed:** Navigating to other modules (e.g., Dashboard, Tasks, Courses, Profile) restores the clean Tailwind styling without any typography or button reset artifacts.

---

## 5. Files Created & Modified

| File | Role | Practical Mapping |
| :--- | :--- | :--- |
| [`frontend/src/pages/StudentRegistrationPage.jsx`](../frontend/src/pages/StudentRegistrationPage.jsx) | Bootstrap 5 Registration Form + CDN/Offline demos | Requirement I, II, III |
| [`frontend/src/components/layout/Sidebar.jsx`](../frontend/src/components/layout/Sidebar.jsx) | Added "Registration" navigation entry | Portal Integration |
| [`frontend/src/App.jsx`](../frontend/src/App.jsx) | Registered `student-registration` tab route | Portal Integration |
| [`frontend/package.json`](../frontend/package.json) | Added `bootstrap` dependency | Requirement II |
| [`docs/practical-5.md`](./practical-5.md) | Comprehensive Practical 5 documentation | Documentation |

---

## 6. How to Run & Demonstrate

### 1. Start the Portal
```bash
# Terminal 1: Backend API
npm run start:backend

# Terminal 2: Frontend Development Server
npm run dev:frontend
```

### 2. Demonstrate Student Registration (Requirement III):
1. Open `http://localhost:5173/` in your browser.
2. Click **Registration** in the left sidebar under Academic Modules.
3. Attempt to submit an empty form by clicking **Submit Registration** ➔ observe validation feedback on all mandatory fields.
4. Click **Auto-fill Demo Data** to populate realistic academic data (Aarav Mehta, CS2026001, 9876543210, etc.).
5. Click **Submit Registration** ➔ observe loading spinner followed by the **Registration Summary Card**.
6. Click **Reset Form** ➔ verify all fields clear cleanly.

### 3. Demonstrate Online CDN vs Offline Local Mode (Requirements I & II):
1. On the top right of the registration page, observe the **Bootstrap 5 Source** widget.
2. Click **Online CDN (jsDelivr)** ➔ inspect browser `<head>` to verify `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/...">`.
3. Click **Local / Offline (npm)** ➔ verify stylesheet immediately switches to the local inline package bundle.
4. Navigate to the **CDN Demonstration** and **Offline / Local Demonstration** tabs to view component showcases.
