export interface ApiErrorResponse {
  detail?: string | { msg?: string }[] | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface CurrentUser {
  id: number | string;
  email: string;
  full_name?: string;
  role?: string;
}