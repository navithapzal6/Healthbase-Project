"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

import { Button, Input, toast } from "@/src/components/ui";

import AuthShell from "./AuthShell";
import type { AuthMode, AuthScreenProps } from "./types";

const AuthScreen = ({
  initialMode = "login",
  showSocialLogin = false,
  socialContent,
}: AuthScreenProps) => {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }
    },
    [],
  );

  const switchMode = (nextMode: AuthMode) => {
    if (nextMode === mode) return;

    setMode(nextMode);
    setShowPassword(false);
    setShowConfirmPassword(false);

    if (navigationTimer.current) {
      clearTimeout(navigationTimer.current);
    }

    navigationTimer.current = setTimeout(() => {
      router.replace(nextMode === "login" ? "/login" : "/signup");
    }, 450);
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    localStorage.setItem("stonebuild-auth", "authenticated");

    toast.success({
      title: "Login Successful",
      description: "Welcome back to Stonebuild.",
    });

    router.push("/");
  };

  const handleSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      toast.error({
        title: "Password Mismatch",
        description: "Password and confirm password must be the same.",
      });
      return;
    }

    toast.success({
      title: "Account Created",
      description: "Your account is ready. Please login to continue.",
    });

    switchMode("login");
  };

  const isLogin = mode === "login";

  return (
    <AuthShell
      mode={mode}
      showSocialLogin={showSocialLogin}
      socialContent={socialContent}
    >
      <div key={mode} className="animate-[auth-form-in_.35s_ease-out]">
        <div className="mb-7">
          <p className="mb-2 text-sm font-semibold text-primary">
            {isLogin ? "Welcome back" : "Get started"}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {isLogin ? "Login to your account" : "Create an account"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isLogin
              ? "Enter your credentials to continue to the dashboard."
              : "Enter your details to create your Stonebuild account."}
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={isLogin ? handleLogin : handleSignup}
        >
          {!isLogin && (
            <Input
              id="signup-name"
              name="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          )}

          <Input
            id={isLogin ? "login-email" : "signup-email"}
            name="email"
            type="email"
            label="Email Address"
            placeholder="name@company.com"
            autoComplete="email"
            required
          />

          <Input
            id={isLogin ? "login-password" : "signup-password"}
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={6}
            required
            rightIcon={
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                className="rounded-md p-1 text-slate-400 hover:text-primary"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            }
          />

          {!isLogin && (
            <Input
              id="signup-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              minLength={6}
              required
              rightIcon={
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="rounded-md p-1 text-slate-400 hover:text-primary"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              }
            />
          )}

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  name="rememberMe"
                  className="h-4 w-4 rounded accent-[var(--primary)]"
                />
                Remember me
              </label>

              <button
                type="button"
                className="font-medium text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            loading={loading}
            leftIcon={isLogin ? <LogIn size={17} /> : <UserPlus size={17} />}
          >
            {isLogin ? "Login" : "Create Account"}
          </Button>
        </form>

        <div className="mt-7 flex items-center justify-center gap-1.5 text-sm text-slate-500">
          <span>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            type="button"
            onClick={() => switchMode(isLogin ? "signup" : "login")}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </AuthShell>
  );
};

export default AuthScreen;
