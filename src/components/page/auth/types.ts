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
