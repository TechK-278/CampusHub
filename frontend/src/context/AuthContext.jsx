/**
 * CampusHub — Authentication Context & Provider
 * Practical 9: Centralized Session State & Auth Hooks
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "@/services/authService";
import { AUTH_EXPIRED_EVENT } from "@/services/apiClient";
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from "@/lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStorageItem(STORAGE_KEYS.AUTH_TOKEN, null));
  const [loading, setLoading] = useState(true);

  // Restore session on mount using stored token
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const storedToken = getStorageItem(STORAGE_KEYS.AUTH_TOKEN, null);
      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          setLoading(false);
        }
        return;
      }

      try {
        const userData = await authService.getMe();
        if (isMounted) {
          setUser(userData);
          setToken(storedToken);
        }
      } catch (err) {
        console.warn("[Auth] Stored session invalid or expired:", err.message);
        removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for global 401 auth expired events
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
      removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await authService.login(username, password);
    setStorageItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
    setUser(data.user);
    setToken(data.token);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Stateless token logout fallback
    } finally {
      removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
      setUser(null);
      setToken(null);
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
