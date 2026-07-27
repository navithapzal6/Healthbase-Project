import { apiClient } from "@/src/core/api";

import type {
  AuthApiResponse,
  LoginRequest,
  SignupRequest,
} from "../types";

const AUTH_BASE_PATH = "/api/v1/auth";

export const authService = {
  login(payload: LoginRequest) {
    return apiClient<AuthApiResponse>(`${AUTH_BASE_PATH}/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  signup(payload: SignupRequest) {
    return apiClient<AuthApiResponse>(`${AUTH_BASE_PATH}/signup`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
