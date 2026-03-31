import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../services/authService";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  const isMountedRef = useRef(true);

  const refreshUser = useCallback(async (): Promise<void> => {
    const hasAuth = isAuthenticated();

    if (!hasAuth) {
      if (!isMountedRef.current) return;
      setUser(null);
      setAuthenticated(false);
      setError(null);
      setLoading(false);
      return;
    }

    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const currentUser = await getCurrentUser();

      if (!isMountedRef.current) return;

      setUser(currentUser);
      setAuthenticated(true);
    } catch (err) {
      if (!isMountedRef.current) return;

      setUser(null);
      setAuthenticated(false);
      setError(err instanceof Error ? err.message : "Failed to load user.");
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      await loginUser(payload);
      const currentUser = await getCurrentUser();

      if (!isMountedRef.current) return;

      setUser(currentUser);
      setAuthenticated(true);
    } catch (err) {
      if (!isMountedRef.current) return;

      setUser(null);
      setAuthenticated(false);
      setError(err instanceof Error ? err.message : "Login failed.");
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const logout = useCallback((): void => {
    logoutUser();

    if (!isMountedRef.current) return;

    setUser(null);
    setAuthenticated(false);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void refreshUser();

    return () => {
      isMountedRef.current = false;
    };
  }, [refreshUser]);

  return {
    user,
    loading,
    error,
    authenticated,
    login,
    logout,
    refreshUser,
  };
}