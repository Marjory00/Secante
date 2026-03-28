import { apiRequest } from "./api";
import { removeAccessToken, setAccessToken } from "../lib/storage";
import type { CurrentUser, LoginPayload, LoginResponse } from "../types/api";

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  setAccessToken(data.access_token);
  return data;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  return apiRequest<CurrentUser>("/auth/me", {
    method: "GET",
    auth: true
  });
}

export function logoutUser(): void {
  removeAccessToken();
}