import type { ReactNode } from "react";

export type AuthMode = "login" | "signup";

export interface AuthFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthShellProps {
  mode: AuthMode;
  children: ReactNode;
  brandName?: string;
  showSocialLogin?: boolean;
  socialContent?: ReactNode;
}

export interface AuthScreenProps {
  initialMode?: AuthMode;
  showSocialLogin?: boolean;
  socialContent?: ReactNode;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

export interface AuthData {
  token: string;
  user: AuthUser;
}

export interface AuthApiResponse {
  success: boolean;
  message: string;
  data: AuthData;
}
