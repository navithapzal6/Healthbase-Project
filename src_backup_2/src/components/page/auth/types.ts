import type { ReactNode } from "react";

export type AuthMode = "login" | "signup";

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
