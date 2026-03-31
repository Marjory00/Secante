import { apiRequest } from "./api";
import type { AlertItem } from "../types/auth";

export async function fetchAlerts(): Promise<AlertItem[]> {
  try {
    const data = await apiRequest<AlertItem[]>("/alerts", {
      method: "GET",
      auth: true,
    });

    // 🔒 safety: ensure always returns array
    if (!Array.isArray(data)) {
      console.warn("Alerts API returned invalid format");
      return [];
    }

    return data;
  } catch (error) {
    console.error("Alerts API failed:", error);

    // ⚠️ fallback ONLY for development (optional)
    if (import.meta.env.DEV) {
      console.warn("Using fallback alert data (DEV mode)");

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

    // 🚨 in production → throw so UI can show error state
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch alerts from server",
    );
  }
}