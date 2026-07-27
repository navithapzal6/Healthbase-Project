"use client";

import type { FormEventHandler } from "react";
import { useState } from "react";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

import {
  Button,
  Checkbox,
  Form,
  Input,
} from "@/src/components/ui";
import type { ValidationErrors } from "@/src/core/validation";

import type { AuthFormValues, AuthMode } from "../types";

interface AuthFormProps {
  mode: AuthMode;
  loading: boolean;
  errors: ValidationErrors<AuthFormValues>;
  onClearError: (field: keyof AuthFormValues) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const AuthForm = ({
  mode,
  loading,
  errors,
  onClearError,
  onSubmit,
}: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isLogin = mode === "login";

  return (
    <Form className="space-y-5" onSubmit={onSubmit} noValidate>
      {!isLogin && (
        <Input
          id="signup-name"
          name="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          autoComplete="name"
          error={errors.fullName}
          onChange={() => onClearError("fullName")}
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
        onChange={() => onClearError("email")}
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
          onClearError("password");
          onClearError("confirmPassword");
        }}
        required
        rightIcon={
          <Button
            unstyled
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
          onChange={() => onClearError("confirmPassword")}
          required
          rightIcon={
            <Button
              unstyled
              type="button"
              tabIndex={-1}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              onClick={() =>
                setShowConfirmPassword((current) => !current)
              }
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

          <Button
            unstyled
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
  );
};

export default AuthForm;
