/**
 * Practical 7: Vue.js Custom Directive — Human-Readable Date
 * 
 * Directive Hooks: mounted(el, binding), updated(el, binding)
 * Formats ISO timestamps / date strings into human-readable academic formats.
 * Supports modifiers:
 *   .short -> Abbreviated month (e.g., 21 Sep 2026)
 *   .time  -> Include localized time (e.g., 21 September 2026, 10:30 AM)
 */
function formatAcademicDate(dateVal, modifiers = {}) {
  if (!dateVal) return "—";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "Invalid Date";

  const isShort = Boolean(modifiers.short);
  const includeTime = Boolean(modifiers.time || !isShort);

  const options = {
    day: "numeric",
    month: isShort ? "short" : "long",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit", hour12: true } : {})
  };

  return new Intl.DateTimeFormat("en-IN", options).format(date);
}

export const humanDateDirective = {
  mounted(el, binding) {
    el.innerText = formatAcademicDate(binding.value, binding.modifiers);
  },

  updated(el, binding) {
    el.innerText = formatAcademicDate(binding.value, binding.modifiers);
  }
};
