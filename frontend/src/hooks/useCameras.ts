import { useCallback, useEffect, useState } from "react";
import { fetchCameras } from "../services/cameraService";
import type { CameraItem } from "../types/auth";

interface UseCamerasResult {
  cameras: CameraItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCameras(): UseCamerasResult {
  const [cameras, setCameras] = useState<CameraItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchCameras();
      setCameras(data);
    } catch (err) {
      console.error("Failed to load cameras:", err);
      setCameras([]);
      setError(err instanceof Error ? err.message : "Failed to load cameras.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { cameras, loading, error, refetch };
}