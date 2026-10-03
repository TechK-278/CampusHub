/**
 * v-permission — Conditionally shows/hides elements based on user role.
 * Used to hide librarian-only actions (approve/reject requests)
 * unless the current mock user has the required role.
 *
 * Usage: v-permission="'librarian'"
 *   - value = required role string
 *   - The directive checks against a global MOCK_USER_ROLE
 *
 * In production this would read from an auth store; here it uses
 * a mock role constant for demonstration purposes.
 */

// Mock role — change to "librarian" to see admin actions
const MOCK_USER_ROLE = "student";

export const permissionDirective = {
  mounted(el, binding) {
    const requiredRole = binding.value;
    if (requiredRole && MOCK_USER_ROLE !== requiredRole) {
      el.style.display = "none";
    }
  },

  updated(el, binding) {
    const requiredRole = binding.value;
    if (requiredRole && MOCK_USER_ROLE !== requiredRole) {
      el.style.display = "none";
    } else {
      el.style.display = "";
    }
  },
};
