"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import {
  Button,
  startNavigationLoading,
  toast,
} from "@/src/components/ui";
import { useFormValidation } from "@/src/core/forms";
import { authLogger, setAuthSession } from "@/src/core/auth";
import { authService } from "../api/authService";

import AuthShell from "./AuthShell";
import AuthForm from "../forms/AuthForm";
import type { AuthFormValues, AuthMode, AuthScreenProps } from "../types";
import { getAuthFormValues, validateAuthForm } from "../validation";


const AuthScreen = ({
  initialMode = "login",
  showSocialLogin = false,
  socialContent,
}: AuthScreenProps) => {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const {
    errors,
    clearError,
    clearErrors,
    validateValues,
  } = useFormValidation<AuthFormValues>();
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
    clearErrors();
    if (navigationTimer.current) {
      clearTimeout(navigationTimer.current);
    }

    navigationTimer.current = setTimeout(() => {
      router.replace(nextMode === "login" ? "/login" : "/signup");
    }, 450);
  };

  const validateForm = (form: HTMLFormElement, formMode: AuthMode) => {
    const result = validateValues(
      getAuthFormValues(form),
      (values) => validateAuthForm(formMode, values),
    );

    if (!result.isValid) {
      authLogger.warn("Authentication form validation failed", {
        mode: formMode,
        fields: Object.keys(result.errors),
      });
    }

    return result;
  };

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>,
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
    event: FormEvent<HTMLFormElement>,
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
              : "Enter your details to create your Healthbase account."}
          </p>
        </div>

        <AuthForm
          mode={mode}
          loading={loading}
          errors={errors}
          onClearError={clearError}
          onSubmit={isLogin ? handleLogin : handleSignup}
        />

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
