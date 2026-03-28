export type AlertSeverity = "critical" | "high" | "medium" | "low";

export type AlertStatus =
  | "open"
  | "acknowledged"
  | "investigating"
  | "resolved";

export type CameraStatus =
  | "online"
  | "offline"
  | "maintenance"
  | "degraded";

export type MetricTrend = "up" | "down" | "neutral";

/* =========================
   ALERTS
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
   CAMERAS (FIXED)
========================= */
export interface CameraItem {
  id: number;
  name: string;
  location: string;
  status: CameraStatus;
  streamLabel: string;

  /* 🔥 REQUIRED for mock UI */
  image: string;
}

/* =========================
   METRICS
========================= */
export interface MetricItem {
  label: string;
  value: string;
  helper: string;
  trend?: MetricTrend;
}