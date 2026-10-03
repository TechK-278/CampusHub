/**
 * v-focus — Auto-focuses the element when it is mounted into the DOM.
 * Used on the search input and the book request form fields
 * to improve keyboard navigation UX.
 *
 * Usage: v-focus (no arguments needed)
 */
export const focusDirective = {
  mounted(el) {
    // Use nextTick timing to ensure the element is fully rendered
    setTimeout(() => {
      if (typeof el.focus === "function") {
        el.focus();
      }
    }, 50);
  },
};
