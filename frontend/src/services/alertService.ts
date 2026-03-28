import { apiRequest } from "./api";
import type { AlertItem } from "../types/auth";

export async function fetchAlerts(): Promise<AlertItem[]> {
  return apiRequest<AlertItem[]>("/alerts", {
    method: "GET",
    auth: true
  });
}