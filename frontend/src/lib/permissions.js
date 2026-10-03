/**
 * CampusHub — Centralized Role-Based Access Control (RBAC) Permissions Matrix
 * Practical 9: Single Source of Truth for Tab Access & Navigation Visibility
 */

export const TAB_PERMISSIONS = {
  "dashboard": ["student", "faculty", "admin"],
  "courses": ["student", "faculty", "admin"],
  "attendance": ["student", "faculty", "admin"],
  "assignments": ["student", "faculty", "admin"],
  "results": ["student", "faculty", "admin"],
  "notices": ["student", "faculty", "admin"],
  "tasks": ["student", "faculty", "admin"],
  "tailwind-demo": ["student", "faculty", "admin"],   // Academic Calendar
  "vue-demo": ["student", "faculty", "admin"],         // Library Catalogue
  "profile": ["student", "faculty", "admin"],          // Academic Profile
  "access": ["student", "faculty", "admin"],           // My Access / RBAC Inspector
  "students": ["faculty", "admin"],                    // Student Registry (MySQL)
  "student-registration": ["faculty", "admin"],        // Admissions (Bootstrap)
  "user-management": ["admin"],                        // User Administration
};

export const ALL_VALID_TABS = Object.keys(TAB_PERMISSIONS);

/**
 * Check if a tab is allowed for a given role
 * @param {string} tabId
 * @param {string} role - 'student' | 'faculty' | 'admin'
 * @returns {boolean}
 */
export function isTabAllowed(tabId, role) {
  if (!tabId || !role) return false;
  const allowedRoles = TAB_PERMISSIONS[tabId];
  if (!allowedRoles) return false;
  return allowedRoles.includes(role);
}

/**
 * Get list of all tab IDs permitted for a given role
 * @param {string} role
 * @returns {string[]}
 */
export function getAllowedTabsForRole(role) {
  if (!role) return ["dashboard"];
  return Object.entries(TAB_PERMISSIONS)
    .filter(([_, roles]) => roles.includes(role))
    .map(([tabId]) => tabId);
}
