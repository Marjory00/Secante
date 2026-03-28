/* =========================
   ALERT TYPES
========================= */
export type AlertSeverity = "critical" | "high" | "medium" | "low";

export type AlertStatus =
  | "open"
  | "acknowledged"
  | "investigating"
  | "resolved";

/* =========================
   CAMERA TYPES
========================= */
export type CameraStatus =
  | "online"
  | "offline"
  | "maintenance"
  | "degraded";

/* =========================
   METRIC TYPES
========================= */
export type MetricTrend = "up" | "down" | "neutral";

/* =========================
   ALERT MODEL
========================= */
export interface AlertItem {
  id: number;
  title: string;
  location: string;
  time: string;
  severity: AlertSeverity;
  status: AlertStatus;
}

/* =========================
   CAMERA MODEL (FINAL FIX)
========================= */
export interface CameraItem {
  id: number;
  name: string;
  location: string;
  status: CameraStatus;
  streamLabel: string;

  /**
   * Optional from backend
   * Required in frontend (we inject fallback)
   */
  image: string;

  /* Optional future-ready fields */
  lastSeen?: string;
  fps?: number;
  resolution?: string;
}

/* =========================
   METRIC MODEL
========================= */
export interface MetricItem {
  label: string;
  value: string;
  helper: string;
  trend?: MetricTrend;
}

/* =========================
   API SAFE TYPES (IMPORTANT)
========================= */

/**
 * Backend camera response (NO image)
 * This prevents TypeScript errors when calling API
 */
export type ApiCameraItem = Omit<CameraItem, "image"> & {
  image?: string;
};