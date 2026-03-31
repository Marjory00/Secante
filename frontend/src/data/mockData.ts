import heroImage from "../assets/hero.png";
import type { AlertItem, CameraItem, MetricItem } from "../types/auth";

// METRICS
export const metrics: MetricItem[] = [
  {
    label: "Active Alerts",
    value: "14",
    helper: "+3 since last hour",
    trend: "up",
  },
  {
    label: "Online Cameras",
    value: "42 / 48",
    helper: "6 devices require attention",
    trend: "down",
  },
  {
    label: "Open Incidents",
    value: "5",
    helper: "2 escalated to response team",
    trend: "up",
  },
  {
    label: "System Health",
    value: "97.8%",
    helper: "Stable across all monitored sites",
    trend: "neutral",
  },
];

// ALERTS
export const alerts: AlertItem[] = [
  {
    id: 1001,
    title: "Unauthorized access attempt",
    location: "North Gate",
    time: "08:41 AM",
    severity: "critical",
    status: "open",
  },
  {
    id: 1002,
    title: "Camera feed interruption",
    location: "Warehouse 2",
    time: "08:27 AM",
    severity: "high",
    status: "investigating",
  },
  {
    id: 1003,
    title: "Motion detected after hours",
    location: "Server Room Hallway",
    time: "07:58 AM",
    severity: "medium",
    status: "open",
  },
  {
    id: 1004,
    title: "Door held open beyond threshold",
    location: "Loading Dock",
    time: "07:13 AM",
    severity: "low",
    status: "resolved",
  },
  {
    id: 1005,
    title: "Perimeter camera offline",
    location: "South Fence Line",
    time: "06:49 AM",
    severity: "high",
    status: "acknowledged",
  },
  {
    id: 1006,
    title: "Access panel communication loss",
    location: "Building B Lobby",
    time: "06:22 AM",
    severity: "medium",
    status: "investigating",
  },
];

// CAMERAS
export const cameras: CameraItem[] = [
  {
    id: 1,
    name: "CAM-01",
    location: "Main Entrance",
    status: "online",
    streamLabel: "Live Stream 01",
    image: heroImage,
  },
  {
    id: 2,
    name: "CAM-02",
    location: "Parking Lot A",
    status: "online",
    streamLabel: "Live Stream 02",
    image: heroImage,
  },
  {
    id: 3,
    name: "CAM-03",
    location: "Warehouse Aisle 3",
    status: "offline",
    streamLabel: "Signal Lost",
    image: heroImage,
  },
  {
    id: 4,
    name: "CAM-04",
    location: "Reception Desk",
    status: "maintenance",
    streamLabel: "Maintenance Mode",
    image: heroImage,
  },
  {
    id: 5,
    name: "CAM-05",
    location: "North Gate",
    status: "online",
    streamLabel: "Live Stream 05",
    image: heroImage,
  },
  {
    id: 6,
    name: "CAM-06",
    location: "Loading Dock",
    status: "degraded",
    streamLabel: "Intermittent Signal",
    image: heroImage,
  },
  {
    id: 7,
    name: "CAM-07",
    location: "Operations Corridor",
    status: "online",
    streamLabel: "Live Stream 07",
    image: heroImage,
  },
  {
    id: 8,
    name: "CAM-08",
    location: "South Perimeter",
    status: "offline",
    streamLabel: "No Connectivity",
    image: heroImage,
  },
];