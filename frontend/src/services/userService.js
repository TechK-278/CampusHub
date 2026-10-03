/**
 * CampusHub — User Management Service (Admin Only)
 * Practical 9: RBAC User Management Client
 */

import { apiClient } from "./apiClient";

const BASE_URL = "/api/users";

export const userService = {
  /**
   * Fetch all users with optional role & search filters
   */
  async getUsers(params = {}) {
    const query = new URLSearchParams();
    if (params.role && params.role !== "all") {
      query.append("role", params.role);
    }
    if (params.search && params.search.trim()) {
      query.append("search", params.search.trim());
    }

    const url = query.toString() ? `${BASE_URL}?${query.toString()}` : BASE_URL;
    const res = await apiClient(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch user list.");
    }
    return data.users || [];
  },

  /**
   * Create a new user account
   */
  async createUser(userData) {
    const res = await apiClient(BASE_URL, {
      method: "POST",
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to create user account.");
    }
    return data.user;
  },

  /**
   * Update user details (role and/or full name)
   */
  async updateUser(id, updates) {
    const res = await apiClient(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to update user account.");
    }
    return data.user;
  },

  /**
   * Delete user account
   */
  async deleteUser(id) {
    const res = await apiClient(`${BASE_URL}/${id}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to delete user account.");
    }
    return data;
  }
};
