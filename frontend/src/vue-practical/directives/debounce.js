/**
 * v-debounce — Debounces input event handler by a configurable delay.
 * Used on the catalogue search input to avoid excessive filtering
 * while the user is still typing.
 *
 * Usage: v-debounce:300="handleSearch"
 *   - arg (300) = delay in ms (defaults to 300)
 *   - value = callback function receiving the input value
 */
export const debounceDirective = {
  mounted(el, binding) {
    const delay = parseInt(binding.arg, 10) || 300;
    const handler = binding.value;
    let timer = null;

    el._debounceHandler = (e) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (typeof handler === "function") {
          handler(e.target.value);
        }
      }, delay);
    };

    el.addEventListener("input", el._debounceHandler);
  },

  unmounted(el) {
    if (el._debounceHandler) {
      el.removeEventListener("input", el._debounceHandler);
      delete el._debounceHandler;
    }
  },
};
