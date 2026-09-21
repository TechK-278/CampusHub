# CampusHub — Practical 3: Responsive Web Portal Design

## 1. Objective
To implement, verify, and demonstrate all four key requirements of **Practical 3** across the **CampusHub (College Management Portal)** application:
1. **Requirement I:** Responsive web page using the viewport meta tag.
2. **Requirement II:** Responsive web page using `width` and `max-width` properties and changing images according to browser width.
3. **Requirement III:** Responsive text size using the `vw` (viewport width) unit.
4. **Requirement IV:** Responsive layout using media queries and responsive breakpoints.

---

## 2. Practical 3 Requirements Mapping & Implementation

### Requirement I: Viewport Meta Tag
- **File:** [`frontend/index.html`](../frontend/index.html)
- **Configuration:**
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ```
- **Explanation:** Ensures that the browser renders the page at the device's native screen width with a 1:1 initial scale, disabling arbitrary mobile auto-zooming and enabling CSS media queries to calculate accurate viewport dimensions.

---

### Requirement II: Width, Max-Width & Responsive Media
- **Files:**
  - [`frontend/src/index.css`](../frontend/src/index.css) (`.portal-container`, `.responsive-image`)
  - [`frontend/src/components/layout/PortalLayout.jsx`](../frontend/src/components/layout/PortalLayout.jsx) (`max-w-7xl w-full mx-auto`)
  - [`frontend/src/pages/ProfilePage.jsx`](../frontend/src/pages/ProfilePage.jsx) (Responsive identification avatar & media cards)
- **Implementation:**
  - Main portal container is bound to `w-full max-w-7xl mx-auto` to prevent excessive content stretching on ultra-wide screens (1440px+) while smoothly adapting to 100% width on mobile.
  - Profile identity avatar scales responsively: `h-20 w-20` (80px) on mobile, adapting smoothly to `sm:h-24 sm:w-24` (96px) on tablet and desktop.
  - Image media utility rules enforce `width: 100%`, `max-width: 100%`, `height: auto`, and `object-fit: cover`.

---

### Requirement III: Responsive Text Size using `vw` (Viewport Width)
- **Files:**
  - [`frontend/src/index.css`](../frontend/src/index.css) (`.text-fluid-title`, `.text-fluid-subtitle`, `.text-fluid-stat`)
  - [`frontend/src/pages/DashboardPage.jsx`](../frontend/src/pages/DashboardPage.jsx)
  - [`frontend/src/pages/TasksPage.jsx`](../frontend/src/pages/TasksPage.jsx)
  - [`frontend/src/pages/AttendancePage.jsx`](../frontend/src/pages/AttendancePage.jsx)
- **Implementation:**
  Uses CSS `clamp()` combined with `vw` units to provide smooth, proportional typography scaling across viewports without breaking layout boundaries or becoming unreadably small on mobile or excessively large on desktop:
  ```css
  /* Fluid page title scaling smoothly between 18px (mobile) and 24px (desktop) */
  .text-fluid-title {
    font-size: clamp(1.125rem, 0.875rem + 1.25vw, 1.5rem);
    line-height: 1.25;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  /* Fluid subtitle scaling between 12px and 14px */
  .text-fluid-subtitle {
    font-size: clamp(0.75rem, 0.65rem + 0.4vw, 0.875rem);
    line-height: 1.4;
  }
  ```

---

### Requirement IV: Responsive Layout using Media Queries & Breakpoints
- **Files:**
  - [`frontend/src/index.css`](../frontend/src/index.css)
  - [`frontend/src/components/layout/Header.jsx`](../frontend/src/components/layout/Header.jsx)
  - [`frontend/src/components/layout/Sidebar.jsx`](../frontend/src/components/layout/Sidebar.jsx)
  - [`frontend/src/components/layout/PortalLayout.jsx`](../frontend/src/components/layout/PortalLayout.jsx)
- **Breakpoints Strategy:**
  - **Mobile (`< 640px`):** Single column stat cards, collapsible slide-in drawer navigation with backdrop, expandable mobile search overlay, contained scrollable tables.
  - **Tablet (`640px – 1023px`):** 2-column stat cards (`tablet-grid-2` / `sm:grid-cols-2`), compact header with active term badge, collapsible drawer navigation.
  - **Desktop (`1024px+`):** Persistent 260px left sidebar, 4-column statistics grid (`desktop-grid-4` / `lg:grid-cols-4`), expanded 7:5 multi-column dashboard grid.

---

## 3. Responsive Breakpoints & Device Testing Matrix

| Device / Viewport | Width | Expected Behavior | Status |
| :--- | :--- | :--- | :--- |
| **Small Mobile** | 320px – 375px (iPhone SE) | Drawer navigation, compact header, stacked widgets, zero horizontal overflow | Verified |
| **Standard Mobile** | 390px – 430px (iPhone 14/Pro Max) | Single-column cards, fluid typography, full-width touch targets | Verified |
| **Tablet Portrait** | 768px (iPad Mini) | 2-column stat cards, hamburger drawer trigger, search visible | Verified |
| **Tablet Landscape / Laptop**| 1024px (iPad Pro) | Persistent sidebar appears, 4-column metrics, 7:5 dashboard grid | Verified |
| **Desktop / Wide Screen** | 1280px – 1440px+ | Max-width bounded container (1280px), comfortable margins | Verified |

---

## 4. Contained Table & Modal Handling
1. **Academic Tables (`AttendancePage.jsx`):** Wrapped inside `<div class="overflow-x-auto w-full">` with `min-w-[620px]` on the table element. Table scrolls smoothly inside its card boundary on mobile without triggering document-level horizontal overflow.
2. **Dialogs & Modals (`dialog.jsx`):** Bounded by `w-full max-w-lg p-4 mx-4` ensuring full viewability and usable submit/cancel touch targets on 320px viewports.

---

## 5. How to Demonstrate

```bash
# 1. Start backend server
npm run start:backend

# 2. Start frontend development server
npm run dev:frontend
```

1. Open `http://localhost:5173/` in Google Chrome or Edge.
2. Press `F12` to open Developer Tools and toggle the Device Toolbar (`Ctrl + Shift + M`).
3. Test at **375px (Mobile)**:
   - Notice the persistent desktop sidebar is replaced by the top bar hamburger trigger.
   - Click the hamburger button: the mobile navigation drawer slides in.
   - Click search icon: the mobile search bar expands cleanly.
   - Notice the heading font size adjusts smoothly via `clamp()` with `vw`.
4. Test at **768px (Tablet)**:
   - Notice stat cards rearrange into 2 columns.
5. Test at **1280px (Desktop)**:
   - Notice the persistent sidebar and 4-column stat cards with comfortable padding.
