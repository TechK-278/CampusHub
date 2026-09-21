/**
 * CampusHub — Local Storage Helper Utility
 * Phase 4: Browser Local Storage Management
 *
 * Provides safe serialization, deserialization, and namespaced preference management.
 */

const STORAGE_PREFIX = "campushub:";

export const STORAGE_KEYS = {
  LAST_VISITED_PAGE: `${STORAGE_PREFIX}lastVisitedPage`,
  COMPACT_DASHBOARD: `${STORAGE_PREFIX}compactDashboard`,
  TASK_ORDER: `${STORAGE_PREFIX}taskOrder`,
  TASK_FILTER: `${STORAGE_PREFIX}taskFilter`,
  DISMISSED_BANNER: `${STORAGE_PREFIX}dismissedBanner`,
};

/**
 * Safely retrieve an item from localStorage with fallback
 * @param {string} key
 * @param {*} defaultValue
 */
export function getStorageItem(key, defaultValue = null) {
  if (typeof window === "undefined" || !window.localStorage) {
    return defaultValue;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[CampusHub Storage] Failed to parse key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely save an item to localStorage
 * @param {string} key
 * @param {*} value
 */
export function setStorageItem(key, value) {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[CampusHub Storage] Failed to save key "${key}":`, error);
    return false;
  }
}

/**
 * Remove a specific key from localStorage
 * @param {string} key
 */
export function removeStorageItem(key) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[CampusHub Storage] Failed to remove key "${key}":`, error);
  }
}

/**
 * Reset all CampusHub-specific preferences without clearing entire browser storage
 */
export function resetCampusHubPreferences() {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });
    console.info("[CampusHub Storage] CampusHub preferences reset successfully.");
  } catch (error) {
    console.warn("[CampusHub Storage] Error resetting preferences:", error);
  }
}
