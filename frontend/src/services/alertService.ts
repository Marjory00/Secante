import { apiRequest } from "./api";
import type { AlertItem } from "../types/auth";

export async function fetchAlerts(): Promise<AlertItem[]> {
  try {
    return await apiRequest<AlertItem[]>("/alerts", {
      method: "GET",
      auth: true,
    });
  } catch (error) {
    console.error("Alerts API failed, using fallback data");

    return [
      {
        id: 1,
        title: "Unauthorized access attempt",
        location: "North Gate",
        time: "08:41 AM",
        severity: "critical",
        status: "open",
      },
      {
        id: 2,
        title: "Camera feed interruption",
        location: "Warehouse 2",
        time: "08:27 AM",
        severity: "high",
        status: "investigating",
      },
    ];
  }
}