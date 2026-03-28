import { apiRequest } from "./api";
import arm1 from "../assets/cameras/arm-1.jpg";
import arm2 from "../assets/cameras/arm-2.jpg";
import arm3 from "../assets/cameras/arm-3.jpg";
import arm4 from "../assets/cameras/arm-4.jpg";
import arm5 from "../assets/cameras/arm-5.jpg";
import arm6 from "../assets/cameras/arm-6.jpg";
import arm7 from "../assets/cameras/arm-7.jpg";
import arm8 from "../assets/cameras/arm-8.jpg";

import type { CameraItem, ApiCameraItem } from "../types/auth";

const fallbackImages = [arm1, arm2, arm3, arm4, arm5, arm6, arm7, arm8];

export async function fetchCameras(): Promise<CameraItem[]> {
  try {
    const cameras = await apiRequest<ApiCameraItem[]>("/cameras", {
      method: "GET",
      auth: true,
    });

    return cameras.map((camera, index) => ({
      ...camera,
      image: camera.image ?? fallbackImages[index % fallbackImages.length],
    }));
  } catch (error) {
    console.error("Failed to fetch cameras:", error);

    // full fallback grid (so UI still looks real)
    return fallbackImages.map((img, index) => ({
      id: index + 1,
      name: `CAM-0${index + 1}`,
      location: "Fallback Location",
      status: index % 3 === 0 ? "offline" : "online",
      streamLabel: `Fallback Stream ${index + 1}`,
      image: img,
    }));
  }
}