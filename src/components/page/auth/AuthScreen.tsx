"use client";

import type { SubmitEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

import {
  Button,
  Checkbox,
  Form,
  Input,
  startNavigationLoading,
  toast,
} from "@/src/components/ui";
import { clearFieldError } from "@/src/core/forms";
import { authLogger, setAuthSession } from "@/src/core/auth";
import type { ValidationErrors } from "@/src/core/validation";
import { authService } from "./service";

import AuthShell from "./AuthShell";
import type {
  AuthFormValues,
  AuthMode,
  AuthScreenProps,
} from "./types";
import { getAuthFormValues, validateAuthForm } from "./validation";


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
  const [errors, setErrors] = useState<ValidationErrors<AuthFormValues>>({});
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }
    },
    [],
  );

  const clearError = (field: keyof AuthFormValues) => {
    setErrors((current) => clearFieldError(current, field));
  };

  const switchMode = (nextMode: AuthMode) => {
    if (nextMode === mode) return;

    setMode(nextMode);
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);

    if (navigationTimer.current) {
      clearTimeout(navigationTimer.current);
    }

    navigationTimer.current = setTimeout(() => {
      router.replace(nextMode === "login" ? "/login" : "/signup");
    }, 450);
  };

  const validateForm = (form: HTMLFormElement, formMode: AuthMode) => {
    const result = validateAuthForm(formMode, getAuthFormValues(form));
    setErrors(result.errors);

    if (!result.isValid) {
      authLogger.warn("Authentication form validation failed", {
        mode: formMode,
        fields: Object.keys(result.errors),
      });
    }

    return result;
  };

  const handleLogin = async (
    event: SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const result = validateForm(event.currentTarget, "login");

    if (!result.isValid) return;

    setLoading(true);

    try {
      const response = await authService.login({
        email: result.values.email,
        password: result.values.password,
      });

      setAuthSession({
        token: response.data.token,
        user: response.data.user,
      });

      authLogger.info("Login completed", {
        userId: response.data.user.id,
      });

      toast.success({
        title: "Login Successful",
        description: response.message,
      });

      startNavigationLoading("Loading dashboard...");
      router.replace("/dashboard");
    } catch (error) {
      authLogger.error("Login failed", error);

      toast.error({
        title: "Login Failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to login.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (
    event: SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const result = validateForm(event.currentTarget, "signup");

    if (!result.isValid) return;

    setLoading(true);

    try {
      const response = await authService.signup({
        name: result.values.fullName,
        email: result.values.email,
        password: result.values.password,
      });

      authLogger.info("Signup completed", {
        userId: response.data.user.id,
      });

      toast.success({
        title: "Account Created",
        description: "Your account is ready. Please login.",
      });

      switchMode("login");
    } catch (error) {
      authLogger.error("Signup failed", error);

      toast.error({
        title: "Signup Failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to create account.",
      });
    } finally {
      setLoading(false);
    }
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

        <Form
          className="space-y-5"
          onSubmit={isLogin ? handleLogin : handleSignup}
          noValidate
        >
          {!isLogin && (
            <Input
              id="signup-name"
              name="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              autoComplete="name"
              error={errors.fullName}
              onChange={() => clearError("fullName")}
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
            error={errors.email}
            onChange={() => clearError("email")}
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
            error={errors.password}
            onChange={() => {
              clearError("password");
              clearError("confirmPassword");
            }}
            required
            rightIcon={
              <Button unstyled
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                className="rounded-md p-1 text-slate-400 hover:text-primary"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </Button>
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
              error={errors.confirmPassword}
              onChange={() => clearError("confirmPassword")}
              required
              rightIcon={
                <Button unstyled
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
                </Button>
              }
            />
          )}

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                <Checkbox
                  unstyled
                  name="rememberMe"
                  className="h-4 w-4 rounded accent-[var(--primary)]"
                />
                Remember me
              </label>

              <Button unstyled
                type="button"
                className="font-medium text-primary hover:underline"
              >
                Forgot password?
              </Button>
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
        </Form>

        <div className="mt-7 flex items-center justify-center gap-1.5 text-sm text-slate-500">
          <span>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <Button unstyled
            type="button"
            onClick={() => switchMode(isLogin ? "signup" : "login")}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </AuthShell>
  );
};

export default AuthScreen;
