import { useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser } from "../services/authService";
import { isAuthenticated } from "../lib/storage";
import type { CurrentUser, LoginPayload } from "../types/api";

interface UseAuthResult {
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
  authenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthenticated());

  async function refreshUser(): Promise<void> {
    if (!isAuthenticated()) {
      setUser(null);
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setAuthenticated(true);
    } catch (err) {
      setUser(null);
      setAuthenticated(false);
      setError(err instanceof Error ? err.message : "Failed to load user.");
    } finally {
      setLoading(false);
    }
  }

  async function login(payload: LoginPayload): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      await loginUser(payload);
      setAuthenticated(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setUser(null);
      setAuthenticated(false);
      setError(err instanceof Error ? err.message : "Login failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout(): void {
    logoutUser();
    setUser(null);
    setAuthenticated(false);
  }

  useEffect(() => {
    void refreshUser();
  }, []);

  return {
    user,
    loading,
    error,
    authenticated,
    login,
    logout,
    refreshUser
  };
}