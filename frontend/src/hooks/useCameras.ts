import { useCallback, useEffect, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  const refetch = useCallback(async (): Promise<void> => {
    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await fetchCameras();

      if (!isMountedRef.current) return;

      setCameras(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load cameras:", err);

      if (!isMountedRef.current) return;

      setCameras([]);
      setError(err instanceof Error ? err.message : "Failed to load cameras.");
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

  return { cameras, loading, error, refetch };
}