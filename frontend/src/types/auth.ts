export type AlertSeverity = "critical" | "high" | "medium" | "low";

export interface AlertItem {
  id: number;
  title: string;
  location: string;
  time: string;
  severity: AlertSeverity;
  status: "open" | "acknowledged" | "resolved";
}

export interface CameraItem {
  id: number;
  name: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  streamLabel: string;
}

export interface MetricItem {
  label: string;
  value: string;
  helper: string;
}