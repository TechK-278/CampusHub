# CampusHub — Practical 4: Browser APIs (Geolocation, Local Storage, Drag & Drop)

## 1. Objective
To implement, verify, and demonstrate all three key browser API requirements of **Practical 4** within **CampusHub (College Management Portal)**:
1. **Requirement I: Geolocation API:** Retrieve and display the user's current browser coordinates on the student dashboard, handling all browser permission and error states.
2. **Requirement II: Local Storage:** Provide safe, structured client-side persistence for user preferences (last visited page, compact dashboard mode, task filter, and custom task ordering).
3. **Requirement III: Native Drag & Drop API:** Implement native HTML5 drag-and-drop task reordering on the Tasks page with Local Storage persistence and keyboard-accessible alternatives.

---

## 2. Practical 4 Requirements Mapping & Implementation

### Requirement I: Geolocation API (`navigator.geolocation`)
- **Component:** [`frontend/src/components/dashboard/LocationWidget.jsx`](../frontend/src/components/dashboard/LocationWidget.jsx)
- **Integration:** Placed in the Student Dashboard ([`frontend/src/pages/DashboardPage.jsx`](../frontend/src/pages/DashboardPage.jsx))
- **Implementation:**
  Uses `navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options)` to retrieve coordinates.
- **States Handled:**
  1. **Idle:** Displays informational prompt ("Location has not been requested").
  2. **Loading:** Displays loading spinner ("Getting your location from browser...").
  3. **Success:** Displays formatted Latitude, Longitude, Accuracy (in meters), and verification timestamp.
  4. **Permission Denied (`error.PERMISSION_DENIED`):** Clear user instructions to enable browser permissions.
  5. **Position Unavailable (`error.POSITION_UNAVAILABLE`):** Friendly message indicating device position cannot be determined.
  6. **Timeout (`error.TIMEOUT`):** Notifies user of request expiration with retry action.
  7. **Unsupported:** Gracefully alerts user if `navigator.geolocation` is absent in older environments.
- **Privacy & Security:** Coordinates are processed purely in client-side memory and are never transmitted to external endpoints.

---

### Requirement II: Local Storage API
- **Helper Module:** [`frontend/src/lib/storage.js`](../frontend/src/lib/storage.js)
- **Namespaced Keys Used:**
  - `campushub:lastVisitedPage`: Stores active portal tab (`dashboard`, `tasks`, `attendance`, etc.) to restore user context across reloads.
  - `campushub:compactDashboard`: Stores boolean toggle for compact vs detailed dashboard statistics.
  - `campushub:taskFilter`: Stores current task view filter (`all`, `pending`, `completed`).
  - `campushub:taskOrder`: Stores array of task IDs representing custom user reorderings.
- **Key Methods:**
  - `getStorageItem(key, defaultValue)`: Safely parses JSON with fallback.
  - `setStorageItem(key, value)`: Serializes objects/values safely.
  - `removeStorageItem(key)`: Deletes individual keys.
  - `resetCampusHubPreferences()`: Selectively clears only `campushub:*` keys without wiping unrelated browser data.

---

### Requirement III: Native Drag & Drop API
- **File:** [`frontend/src/pages/TasksPage.jsx`](../frontend/src/pages/TasksPage.jsx)
- **Implementation:** Built strictly using native browser HTML5 Drag & Drop events (zero third-party dependencies):
  - `draggable={filter === 'all'}`: Enables drag interactions on task cards.
  - `onDragStart`: Captures initial task index via `dataTransfer.setData('text/plain', index)`.
  - `onDragOver`: Calls `e.preventDefault()` to allow dropping and sets `dataTransfer.dropEffect = 'move'`.
  - `onDrop`: Reorders task array in memory and invokes `persistOrder()` to update `campushub:taskOrder` in Local Storage.
  - `onDragEnd`: Resets visual highlight states.
- **Accessibility Alternative:**
  For keyboard users, each task card includes Move Up (`ChevronUp`) and Move Down (`ChevronDown`) buttons allowing sequential reordering that synchronizes with the same Local Storage order.
- **Reset Capability:** Provides "Reset Order" action to restore default server-side order.

---

## 3. Files Created & Modified

| File | Role | Practical Mapping |
| :--- | :--- | :--- |
| [`frontend/src/lib/storage.js`](../frontend/src/lib/storage.js) | Local storage serialization & preference manager | Requirement II |
| [`frontend/src/components/dashboard/LocationWidget.jsx`](../frontend/src/components/dashboard/LocationWidget.jsx) | Browser Geolocation API widget | Requirement I |
| [`frontend/src/pages/TasksPage.jsx`](../frontend/src/pages/TasksPage.jsx) | Native Drag & Drop task reordering + order persistence | Requirement II & III |
| [`frontend/src/pages/DashboardPage.jsx`](../frontend/src/pages/DashboardPage.jsx) | Integrated LocationWidget & compact view preference | Requirement I & II |
| [`frontend/src/App.jsx`](../frontend/src/App.jsx) | Last visited page persistence | Requirement II |
| [`docs/practical-4.md`](./practical-4.md) | Practical 4 documentation | Documentation |

---

## 4. How to Run & Demonstrate

### 1. Start Application
```bash
# Start backend server (port 5000)
npm run start:backend

# Start frontend dev server (port 5173)
npm run dev:frontend
```

### 2. Demonstrate Geolocation API:
1. Open `http://localhost:5173/` in the browser.
2. In the Dashboard, scroll to the **Campus & Browser Location** widget.
3. Click **Get My Location**.
4. Allow browser permission prompt.
5. Verify latitude, longitude, and accuracy appear.

### 3. Demonstrate Local Storage Preferences:
1. On Dashboard, click **Compact View: OFF** ➔ toggles to **Compact View: ON**.
2. Refresh the browser page (`F5`) ➔ Verify compact mode remains **ON**.
3. Navigate to **Tasks** tab, then refresh the browser ➔ Verify application reopens directly on the **Tasks** tab via `campushub:lastVisitedPage`.

### 4. Demonstrate Drag & Drop Task Reordering:
1. Navigate to **Tasks** tab.
2. Click and hold the `GripVertical` handle on task #3 (e.g. *CN Assignment*).
3. Drag it above task #1 and drop.
4. Verify task order updates immediately with success banner.
5. Refresh the browser (`F5`) ➔ Verify custom task order persists from `campushub:taskOrder`.
6. Click **Reset Order** ➔ Verify order reverts to backend defaults.
