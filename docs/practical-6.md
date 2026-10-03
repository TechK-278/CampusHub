# CampusHub — Practical 6: Tailwind CSS · Academic Calendar Module

## 1. Objective
Implement a real academic calendar and timetable module using **Tailwind CSS** within CampusHub, demonstrating:
- Utility-first styling for all layout, spacing, colors, and typography
- Responsive design with breakpoint variants (`sm:`, `md:`, `lg:`, `xl:`)
- CSS Grid for the weekly timetable
- Flexbox for filters, headers, and card layouts
- State variants (`hover:`, `focus-visible:`, `active:`, `disabled:`, `group-hover:`)
- Conditional styling via `cn()` utility

---

## 2. Module Overview

The **Academic Calendar** module (`tailwind-demo` tab) provides three views:

### Timetable
- CSS Grid weekly schedule (Mon–Sat × 5 periods)
- Desktop: full grid layout with period headers
- Mobile: stacked day-by-day card list
- Day filter pills for quick navigation
- Color-coded by class type (Lecture/Lab/Tutorial)
- `group-hover` to expand truncated course names

### Exam Schedule
- Filterable table by exam type (Mid-Semester / End-Semester) and department
- Responsive column hiding (`hidden sm:table-cell`, `hidden md:table-cell`)
- Badge variants by exam type
- Horizontal scroll on mobile

### Holidays & Events
- Category filter (Holidays / Events / Exam Breaks)
- Monthly grouping
- Responsive card grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- Color-coded by type with dot indicators
- Past events dimmed with `opacity-60`

---

## 3. Tailwind Concepts Demonstrated

| Concept | Implementation |
|---|---|
| **Utility-First** | All styling via Tailwind classes, zero custom CSS |
| **Responsive Grid** | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` for holiday cards |
| **CSS Grid** | Custom `gridTemplateColumns` for timetable periods |
| **Flexbox** | `flex items-center justify-between gap-*` for headers and filters |
| **Breakpoint Variants** | `hidden lg:block` for desktop grid, `lg:hidden` for mobile stacks |
| **Hover States** | `hover:bg-slate-50`, `hover:shadow-sm`, `hover:border-slate-300` |
| **Focus Visible** | `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1` |
| **Group Hover** | `group-hover:whitespace-normal` to expand timetable course names |
| **Conditional Classes** | `cn()` utility for active/inactive tab states and badge variants |
| **Responsive Table** | `hidden sm:table-cell` for progressive column display |
| **Typography** | `text-xs`, `text-[10px]`, `text-[11px]`, `font-semibold`, `uppercase tracking-wider` |
| **Spacing Tokens** | `space-y-4`, `gap-3`, `p-4`, `px-3 py-1.5` |

---

## 4. File Structure

```
frontend/src/pages/calendar/
├── AcademicCalendarPage.jsx   # Page shell with tab navigation, division picker
├── WeeklyTimetable.jsx         # CSS Grid timetable (desktop) + stacked list (mobile)
├── ExamSchedule.jsx            # Filterable exam table
└── HolidaysEvents.jsx          # Categorized holiday/event card grid

frontend/src/data/mockData.js   # mockTimetable, mockExamSchedule, mockHolidays
```

---

## 5. Mock Data

All calendar data is sourced from `mockData.js`:
- `mockTimetable`: 18 class slots across Mon–Sat
- `mockExamSchedule`: 10 exams (mid-semester + end-semester, multiple departments)
- `mockHolidays`: 17 holidays, events, and exam breaks for Semester 5
