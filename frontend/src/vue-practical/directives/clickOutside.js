/**
 * v-click-outside — Calls handler when a click occurs outside the element.
 * Used to close filter dropdowns and the book detail drawer
 * when the user clicks elsewhere on the page.
 *
 * Usage: v-click-outside="closeHandler"
 */
export const clickOutsideDirective = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event) => {
      if (!el.contains(event.target) && typeof binding.value === "function") {
        binding.value(event);
      }
    };

    // Delay attachment to prevent the opening click from immediately closing
    setTimeout(() => {
      document.addEventListener("click", el._clickOutsideHandler, true);
    }, 10);
  },

  unmounted(el) {
    if (el._clickOutsideHandler) {
      document.removeEventListener("click", el._clickOutsideHandler, true);
      delete el._clickOutsideHandler;
    }
  },
};
