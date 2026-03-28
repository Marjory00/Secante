import { apiRequest } from "./api";
import type { CameraItem } from "../types/auth";

export async function fetchCameras(): Promise<CameraItem[]> {
  return apiRequest<CameraItem[]>("/cameras", {
    method: "GET",
    auth: true
  });
}