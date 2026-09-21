/**
 * Practical 7: Vue.js Custom Directive — Uppercase on Click
 * 
 * Directive Hook: mounted(el, binding)
 * Behavior: Listens for click events on the bound DOM element or input,
 * transforming its text content or input value to uppercase.
 */
export const uppercaseClickDirective = {
  mounted(el, binding) {
    el.style.cursor = "pointer";
    el.title = "Click to transform text to uppercase (Vue Custom Directive)";

    const handler = (e) => {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.value = el.value.toUpperCase();
        // Dispatch synthetic input event to sync with Vue v-model if bound
        el.dispatchEvent(new Event("input", { bubbles: true }));
      } else {
        el.innerText = el.innerText.toUpperCase();
      }

      // Visual feedback ring
      el.classList.add("ring-2", "ring-blue-500", "ring-offset-1");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-blue-500", "ring-offset-1");
      }, 400);
    };

    el._uppercaseHandler = handler;
    el.addEventListener("click", handler);
  },

  unmounted(el) {
    if (el._uppercaseHandler) {
      el.removeEventListener("click", el._uppercaseHandler);
      delete el._uppercaseHandler;
    }
  }
};
