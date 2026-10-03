/**
 * v-tooltip — Shows a positioned tooltip on hover/focus.
 * Used on availability badges and status icons to display
 * copy counts and status descriptions without cluttering the UI.
 *
 * Usage: v-tooltip="'2 copies available'"
 *   - value = tooltip text string
 */
export const tooltipDirective = {
  mounted(el, binding) {
    const text = binding.value || "";
    if (!text) return;

    let tooltipEl = null;

    const show = () => {
      if (tooltipEl) return;
      tooltipEl = document.createElement("div");
      tooltipEl.textContent = text;
      tooltipEl.style.cssText = [
        "position:fixed",
        "z-index:99999",
        "padding:4px 10px",
        "font-size:11px",
        "font-family:Inter,system-ui,sans-serif",
        "color:#fff",
        "background:#334155",
        "border-radius:4px",
        "pointer-events:none",
        "white-space:nowrap",
        "opacity:0",
        "transition:opacity 0.15s ease",
      ].join(";");
      document.body.appendChild(tooltipEl);

      const rect = el.getBoundingClientRect();
      tooltipEl.style.left = `${rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2}px`;
      tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 6}px`;

      // Fade in
      requestAnimationFrame(() => {
        if (tooltipEl) tooltipEl.style.opacity = "1";
      });
    };

    const hide = () => {
      if (tooltipEl) {
        tooltipEl.remove();
        tooltipEl = null;
      }
    };

    el._tooltipShow = show;
    el._tooltipHide = hide;

    el.addEventListener("mouseenter", show);
    el.addEventListener("mouseleave", hide);
    el.addEventListener("focusin", show);
    el.addEventListener("focusout", hide);
  },

  updated(el, binding) {
    // Update text when reactive value changes
    if (el._tooltipShow) {
      el._tooltipHide();
    }
  },

  unmounted(el) {
    if (el._tooltipHide) el._tooltipHide();
    if (el._tooltipShow) el.removeEventListener("mouseenter", el._tooltipShow);
    if (el._tooltipHide) {
      el.removeEventListener("mouseleave", el._tooltipHide);
      el.removeEventListener("focusin", el._tooltipShow);
      el.removeEventListener("focusout", el._tooltipHide);
    }
  },
};
