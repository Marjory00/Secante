import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAlerts } from "../services/alertService";
import type { AlertItem } from "../types/auth";

interface UseAlertsResult {
  alerts: AlertItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAlerts(): UseAlertsResult {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  const refetch = useCallback(async (): Promise<void> => {
    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await fetchAlerts();

      if (!isMountedRef.current) return;

      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load alerts:", err);

      if (!isMountedRef.current) return;

      setAlerts([]);
      setError(err instanceof Error ? err.message : "Failed to load alerts.");
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void refetch();

    return () => {
      isMountedRef.current = false;
    };
  }, [refetch]);

  return { alerts, loading, error, refetch };
}