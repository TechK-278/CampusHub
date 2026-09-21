# CampusHub — Practical 6: Tailwind CSS

## 1. Objective
To implement, verify, and demonstrate all key requirements of **Practical 6: Tailwind CSS** within **CampusHub (College Management Portal)**:
- Demonstrate modern, utility-first styling for academic interfaces.
- Utilize responsive design modifiers (`sm:`, `md:`, `lg:`, `xl:`).
- Apply Flexbox and CSS Grid layout models in academic portal views.
- Implement state variants (hover, focus, active, disabled) with accessible contrast.
- Showcase atomic typography, spacing tokens, and reusable component composition without custom CSS bloat.

---

## 2. Tailwind CSS Architecture in CampusHub

CampusHub leverages Tailwind CSS v3.4 configured with custom design tokens adhering to the **38 Global AI Rules & Restrictions** in [`AGENTS.md`](../AGENTS.md):
- **Configuration File:** [`frontend/tailwind.config.js`](../frontend/tailwind.config.js)
- **Base Stylesheet:** [`frontend/src/index.css`](../frontend/src/index.css)
- **Token Highlights:**
  - Standardized HSL theme variables for `--primary` (Deep Navy / Blue-600), `--secondary` (Slate), `--muted`, `--accent`, and `--destructive`.
  - Academic font stack utilizing `Inter` with system fallbacks.
  - Fluid typography utilities with `clamp()` and `vw` units.

---

## 3. Practical 6 Requirements Mapping

| Requirement | Implementation Concept | Demonstration in CampusHub |
| :--- | :--- | :--- |
| **I. Utility-First Styling** | Atomic utility classes for spacing (`p-*`, `m-*`, `gap-*`), sizing (`w-*`, `max-w-*`), borders (`border`, `rounded-*`), shadows (`shadow-2xs`, `shadow-xs`, `shadow-sm`), and colors (`bg-blue-600`, `text-slate-900`). | Section 1: Utility-First Design Tokens matrix with live class inspector. |
| **II. Responsive Utilities** | Breakpoint prefixes (`sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`). | Section 2: Multi-breakpoint academic metric cards rearranging from 1 col on mobile to 2 on tablet and 4 on desktop. |
| **III. Flexbox Layout** | Alignment and distribution (`flex`, `items-center`, `justify-between`, `flex-wrap`, `gap-3`, `grow`, `shrink-0`). | Section 3: Faculty coordinator directory bar and navigation elements. |
| **IV. CSS Grid Layout** | Multi-column grid definition (`grid`, `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `col-span-*`). | Section 3: Academic curriculum grid with column spanning (`col-span-2`, `col-span-3`). |
| **V. Typography** | Font size (`text-xs`, `text-sm`, `text-base`, `text-lg`), weights (`font-medium`, `font-semibold`, `font-bold`), letter-spacing (`tracking-tight`), and line-heights. | Section 1 & Section 4: Academic heading hierarchy and metadata styling. |
| **VI. Spacing & Sizing** | Consistent padding, margins, and dimension constraints without arbitrary pixel values. | Standard Tailwind spacing scale (`p-3.5`, `gap-3`, `space-y-4`). |
| **VII. State Variants** | Interactive pseudo-classes (`hover:bg-blue-700`, `active:scale-98`, `focus:ring-2`, `focus:ring-blue-600`, `disabled:opacity-50`). | Section 4: Interactive buttons, focus-ring inputs, and state modifier toggles. |
| **VIII. Reusable Components** | Composition with shadcn/ui and Tailwind tokens. | Section 5: Academic Course Enrollment Table with hoverable rows (`hover:bg-slate-50/80`) and status badges. |

---

## 4. Screens Created & Modified

| File | Type | Role |
| :--- | :--- | :--- |
| [`frontend/src/pages/TailwindDemoPage.jsx`](../frontend/src/pages/TailwindDemoPage.jsx) | Page Component | Main Practical 6 demonstration module featuring 5 interactive sections and a live utility class inspector. |
| [`frontend/src/components/layout/Sidebar.jsx`](../frontend/src/components/layout/Sidebar.jsx) | Layout Component | Added "Tailwind CSS" (`tailwind-demo`) navigation item with badge `P6`. |
| [`frontend/src/App.jsx`](../frontend/src/App.jsx) | Root Component | Registered `tailwind-demo` route tab in navigation state. |
| [`docs/practical-6.md`](./practical-6.md) | Documentation | Comprehensive Practical 6 documentation. |
| [`README.md`](../README.md) | Documentation | Updated status and practical mapping table. |

---

## 5. How to Run & Demonstrate

### 1. Start the Portal
```bash
# Start backend API (port 5000)
npm run start:backend

# Start frontend dev server (port 5173)
npm run dev:frontend
```

### 2. Practical Demonstration Steps:
1. Open `http://localhost:5173/` in a modern browser.
2. Click **Tailwind CSS** in the sidebar navigation.
3. **Explore Utility-First Design Tokens:** Click any color token or elevation card to inspect its atomic utility classes in the live inspector at the bottom.
4. **Test Responsive Breakpoints:** Resize the browser window from 320px to 1280px to verify that metric cards automatically shift between 1, 2, and 4 columns.
5. **Test Flexbox & Grid:** Observe the Faculty Header Bar (`flex items-center justify-between`) and Curriculum Grid (`grid col-span-2 col-span-1`).
6. **Test State Variants:**
   - Hover over the primary, outline, and destructive buttons.
   - Click into the text input to observe the emerald and blue focus rings (`focus:ring-2`).
   - Click **Toggle Enabled/Disabled** to verify the `disabled:opacity-50 disabled:cursor-not-allowed` variant.
7. **Inspect Academic Data Table:** Hover over rows in the course registration table to verify subtle background transitions (`hover:bg-slate-50/80`).

---

## 6. Verification & Testing

- **Production Build:** `npm --prefix frontend run build` completed with **0 errors**.
- **Responsive Testing:** Verified across standard breakpoints: `320px`, `375px`, `390px`, `430px`, `768px`, `1024px`, and `1280px`.
- **Regression Verification:**
  - Practical 1: `helloWorld.js`, `jsonObjectDemo.js`, `GET /api/health` — PASSED
  - Practical 2: `readJsonDemo.js`, `multiJsonDemo.js`, `GET /api/tasks` CRUD — PASSED
  - Practical 3: Viewport meta tag, width/max-width scaling, and media queries — PASSED
  - Practical 4: Geolocation widget, Local Storage persistence, and Drag & Drop task ordering — PASSED
  - Practical 5: Isolated Bootstrap 5 registration form (CDN & Offline modes) — PASSED
