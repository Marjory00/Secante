import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function refetch(): Promise<void> {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAlerts();
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load alerts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refetch();
  }, []);

  return { alerts, loading, error, refetch };
}