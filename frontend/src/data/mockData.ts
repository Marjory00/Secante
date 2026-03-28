import type { AlertItem, CameraItem, MetricItem } from "../types/auth";

export const metrics: MetricItem[] = [
  {
    label: "Active Alerts",
    value: "14",
    helper: "+3 in the last hour"
  },
  {
    label: "Online Cameras",
    value: "42 / 48",
    helper: "6 need attention"
  },
  {
    label: "Open Incidents",
    value: "5",
    helper: "2 escalated"
  },
  {
    label: "System Health",
    value: "97.8%",
    helper: "stable performance"
  }
];

export const alerts: AlertItem[] = [
  {
    id: 1001,
    title: "Unauthorized access attempt",
    location: "North Gate",
    time: "08:41 AM",
    severity: "critical",
    status: "open"
  },
  {
    id: 1002,
    title: "Camera feed interruption",
    location: "Warehouse 2",
    time: "08:27 AM",
    severity: "high",
    status: "acknowledged"
  },
  {
    id: 1003,
    title: "Motion after hours",
    location: "Server Room Hallway",
    time: "07:58 AM",
    severity: "medium",
    status: "open"
  },
  {
    id: 1004,
    title: "Door left open",
    location: "Loading Dock",
    time: "07:13 AM",
    severity: "low",
    status: "resolved"
  }
];

export const cameras: CameraItem[] = [
  {
    id: 1,
    name: "CAM-01",
    location: "Main Entrance",
    status: "online",
    streamLabel: "Live Stream 01"
  },
  {
    id: 2,
    name: "CAM-02",
    location: "Parking Lot A",
    status: "online",
    streamLabel: "Live Stream 02"
  },
  {
    id: 3,
    name: "CAM-03",
    location: "Warehouse Aisle 3",
    status: "offline",
    streamLabel: "Signal Lost"
  },
  {
    id: 4,
    name: "CAM-04",
    location: "Reception Desk",
    status: "maintenance",
    streamLabel: "Maintenance Mode"
  }
];