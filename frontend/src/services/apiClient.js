/**
 * CampusHub — Centralized API Client with JWT Bearer Token Injection
 * Practical 9: RBAC Frontend Client
 */

import { getStorageItem, removeStorageItem, STORAGE_KEYS } from "@/lib/storage";

export const AUTH_EXPIRED_EVENT = "campushub:auth:expired";

/**
 * Fetch wrapper with automatic Bearer token injection and 401 handling
 * @param {string} url - Request URL
 * @param {RequestInit} options - Fetch options
 */
export async function apiClient(url, options = {}) {
  const token = getStorageItem(STORAGE_KEYS.AUTH_TOKEN, null);

  const headers = {
    ...options.headers
  };

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Handle unauthorized/expired token
  if (response.status === 401 && !url.includes("/api/auth/login")) {
    removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
    window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
  }

  return response;
}
