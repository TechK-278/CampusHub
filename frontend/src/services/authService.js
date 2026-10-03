/**
 * CampusHub — Authentication Service
 * Practical 9: JWT Authentication API Client
 */

import { apiClient } from "./apiClient";

export const authService = {
  /**
   * Log in user with username & password
   */
  async login(username, password) {
    const res = await apiClient("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Authentication failed.");
    }
    return data;
  },

  /**
   * Fetch currently authenticated user session
   */
  async getMe() {
    const res = await apiClient("/api/auth/me");
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Session invalid or expired.");
    }
    return data.user;
  },

  /**
   * Sign out user from current session
   */
  async logout() {
    try {
      const res = await apiClient("/api/auth/logout", {
        method: "POST"
      });
      return await res.json();
    } catch {
      return { success: true };
    }
  },

  /**
   * Test protected route access (for MyAccess live testing: profile, academic, admin)
   */
  async testProtectedEndpoint(resource) {
    const res = await apiClient(`/api/protected/${resource}`);
    const data = await res.json();
    return {
      status: res.status,
      ok: res.ok,
      data
    };
  }
};
