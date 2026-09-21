# CampusHub — Practical 7: Vue.js Custom Directives

## 1. Objective
To implement, verify, and demonstrate all key requirements of **Practical 7: Vue.js Custom Directives** within **CampusHub (College Management Portal)**:
1. **Requirement 1: Custom Directive — Uppercase on Click:** Implement a custom directive (`v-uppercase-click`) that transforms clicked text or input content into uppercase using Vue 3 DOM hook handlers.
2. **Requirement 2: Dynamic List & Reactivity:** Implement a reactive academic course catalog allowing real-time additions, removals, and computed credit/course aggregations without manual DOM manipulation.
3. **Requirement 3: Human-Readable Date Directive:** Implement a custom directive (`v-human-date`) that reactively converts ISO timestamp strings into formatted, localized academic dates.

---

## 2. Framework Isolation Strategy (React ↔ Vue Coexistence)

As specified in the **CampusHub Architecture Rules & Restrictions ([`AGENTS.md`](../AGENTS.md))**:
- **Primary Portal Architecture:** CampusHub's core portal remains built with **React 18 + Tailwind CSS + shadcn/ui**.
- **Isolated Vue Playground:** Vue.js v3.5 is mounted into a scoped React container component ([`frontend/src/pages/VueDemoPage.jsx`](../frontend/src/pages/VueDemoPage.jsx)) using Vue's `createApp()` and unmounted cleanly via `app.unmount()` when navigating away.
- **Zero Framework Collision:** Vue operates strictly inside its designated mount point. No Vue Router or Pinia is loaded globally, ensuring zero memory leaks or routing interference.

---

## 3. Custom Directives Implementation & Lifecycle Hooks

In Vue 3, custom directives are registered with specific lifecycle hooks (`mounted`, `updated`, `unmounted`):

### I. Uppercase on Click Directive (`v-uppercase-click`)
- **File:** [`frontend/src/vue-practical/directives/uppercaseClick.js`](../frontend/src/vue-practical/directives/uppercaseClick.js)
- **Lifecycle Hook:** `mounted(el, binding)`
- **Mechanism:** Attaches an event listener to the element. When clicked, it converts `innerText` or input `value` to uppercase and triggers a synthetic `input` event to keep `v-model` synchronized.
- **Visual Feedback:** Briefly pulses a subtle blue ring indicator (`ring-2 ring-blue-500`) to confirm the transformation to the user.

```javascript
export const uppercaseClickDirective = {
  mounted(el) {
    el.style.cursor = 'pointer';
    const handler = () => {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = el.value.toUpperCase();
        el.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        el.innerText = el.innerText.toUpperCase();
      }
    };
    el._uppercaseHandler = handler;
    el.addEventListener('click', handler);
  },
  unmounted(el) {
    if (el._uppercaseHandler) {
      el.removeEventListener('click', el._uppercaseHandler);
    }
  }
};
```

---

### II. Human-Readable Date Directive (`v-human-date`)
- **File:** [`frontend/src/vue-practical/directives/humanDate.js`](../frontend/src/vue-practical/directives/humanDate.js)
- **Lifecycle Hooks:** `mounted(el, binding)` and `updated(el, binding)`
- **Mechanism:** Parses the raw date string from `binding.value` using `Intl.DateTimeFormat` and writes the localized date string into `el.innerText`.
- **Modifiers Supported:**
  - Standard: Full month and time (`25 September 2026, 02:30 PM`).
  - `.short`: Abbreviated month format (`25 Sep 2026, 02:30 PM`).

---

## 4. Reactive Dynamic List Implementation
- **File:** [`frontend/src/vue-practical/VuePracticalApp.js`](../frontend/src/vue-practical/VuePracticalApp.js)
- **Reactivity Engine:** Utilizes Vue's `ref()` for reactive state and `computed()` for derived values:
  - `courses = ref([...])`: Reactive list of enrolled academic courses.
  - `totalCredits = computed(...)`: Dynamically recalculates total credit sum whenever items are added or removed.
  - `addCourse()`: Validates course code and title, then pushes new items into the reactive array.
  - `removeCourse(id)`: Filters out the selected course; the UI updates instantly via `v-for`.

---

## 5. Files Created & Modified

| File | Type | Practical Mapping |
| :--- | :--- | :--- |
| [`frontend/src/vue-practical/directives/uppercaseClick.js`](../frontend/src/vue-practical/directives/uppercaseClick.js) | Vue Custom Directive | Requirement 1 (Uppercase on Click) |
| [`frontend/src/vue-practical/directives/humanDate.js`](../frontend/src/vue-practical/directives/humanDate.js) | Vue Custom Directive | Requirement 3 (Human-Readable Date) |
| [`frontend/src/vue-practical/VuePracticalApp.js`](../frontend/src/vue-practical/VuePracticalApp.js) | Vue Root Component | Requirements 1, 2, & 3 UI & Viva notes |
| [`frontend/src/pages/VueDemoPage.jsx`](../frontend/src/pages/VueDemoPage.jsx) | React Component | Isolated Vue 3 mounting bridge |
| [`frontend/src/components/layout/Sidebar.jsx`](../frontend/src/components/layout/Sidebar.jsx) | Navigation | Added "Vue.js" (`vue-demo`) navigation item |
| [`frontend/src/App.jsx`](../frontend/src/App.jsx) | Root Component | Registered `vue-demo` route tab |
| [`docs/practical-7.md`](./practical-7.md) | Documentation | Comprehensive Practical 7 documentation |
| [`README.md`](../README.md) | Documentation | Updated status and practical mapping |

---

## 6. How to Run & Demonstrate

### 1. Start the Portal
```bash
# Start backend API (port 5000)
npm run start:backend

# Start frontend dev server (port 5173)
npm run dev:frontend
```

### 2. Practical Demonstration Steps:
1. Open `http://localhost:5173/` in a browser.
2. Click **Vue.js** in the left sidebar navigation (marked with badge **P7**).
3. **Demonstrate Uppercase on Click (Requirement 1):**
   - Click on the Notice Heading box ➔ verify lowercase text converts to uppercase.
   - Click on the Faculty box ➔ verify uppercase conversion.
   - Click inside the interactive input box ➔ verify input value converts to uppercase.
   - Click **Reset Sample Text** to restore lowercase strings.
4. **Demonstrate Dynamic Course List (Requirement 2):**
   - Observe initial 5 enrolled courses and computed totals (19 credits).
   - Enter Course Code `CS506`, Title `Cloud Computing & DevOps`, select `4 Credits`, and click **Add to Course Catalog**.
   - Verify course appears immediately in the list and total credits increment to 23.
   - Click **Remove** on any course ➔ verify reactive removal and updated total credits.
5. **Demonstrate Human-Readable Date (Requirement 3):**
   - Select any date preset (e.g. *FSD Practical Evaluation* or *Mid-Semester Examinations*).
   - Verify raw ISO string (`2026-09-25T14:30:00`) is formatted into human-readable text by the `v-human-date` directive.

---

## 7. Verification & Testing

- **Production Build:** `npm --prefix frontend run build` completed with **0 errors**.
- **Responsive Testing:** Verified layout across standard breakpoints (`320px`, `375px`, `390px`, `430px`, `768px`, `1024px`, and `1280px`).
- **Regression Verification:**
  - Practical 1: `helloWorld.js`, `jsonObjectDemo.js`, `GET /api/health` — PASSED
  - Practical 2: `readJsonDemo.js`, `multiJsonDemo.js`, `GET /api/tasks` CRUD — PASSED
  - Practical 3: Responsive layouts, fluid `vw` typography, drawer navigation — PASSED
  - Practical 4: Geolocation widget, Local Storage persistence, and Drag & Drop task ordering — PASSED
  - Practical 5: Isolated Bootstrap 5 registration form — PASSED
  - Practical 6: Tailwind CSS design system and utility demonstration — PASSED
