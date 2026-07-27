"use client";

import { Boxes } from "lucide-react";

import type { AuthShellProps } from "../types";

const AuthShell = ({
  mode,
  children,
  brandName = "Stonebuild",
  showSocialLogin = false,
  socialContent,
}: AuthShellProps) => {
  const isLogin = mode === "login";

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-slate-100">
      <div className="relative min-h-[620px] w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
        <section
          className={`absolute inset-y-0 z-10 hidden w-1/2 overflow-hidden bg-gradient-to-br from-primary via-indigo-500 to-violet-600 p-10 text-white transition-[left] duration-500 ease-in-out md:flex md:flex-col md:justify-between ${
            isLogin ? "left-0" : "left-1/2"
          }`}
        >
          <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Boxes size={24} />
            </span>
            <span className="text-xl font-semibold tracking-tight">
              {brandName}
            </span>
          </div>

          <div className="relative max-w-sm">
            <p className="mb-3 text-sm font-medium text-white/70">
              {isLogin ? "Welcome back" : "Build with confidence"}
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              {isLogin
                ? "Manage your projects from one simple workspace."
                : "Create your account and start your journey."}
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/75">
              {isLogin
                ? "Sign in to access contacts, ledger, reports and the complete Stonebuild workspace."
                : "Keep your teams, contacts and daily business operations connected in one place."}
            </p>
          </div>

          <p className="relative text-xs text-white/60">
            Stonebuild ERP · Secure workspace
          </p>
        </section>

        <section
          className={`absolute inset-y-0 left-0 flex w-full items-center justify-center overflow-y-auto p-6 transition-[left] duration-500 ease-in-out sm:p-10 md:w-1/2 ${
            isLogin ? "md:left-1/2" : "md:left-0"
          }`}
        >
          <div className="w-full max-w-sm">
            <div className="mb-8 flex items-center gap-3 md:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <Boxes size={21} />
              </span>
              <span className="text-lg font-semibold text-slate-900">
                {brandName}
              </span>
            </div>

            {children}

            {showSocialLogin && socialContent && (
              <div className="mt-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs text-slate-400">
                    or continue with
                  </span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
                {socialContent}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthShell;
