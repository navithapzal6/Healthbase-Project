import type { AuthSession, StoredAuthUser } from "./types";

export const AUTH_TOKEN_KEY = "stonebuild-auth-token";
export const AUTH_USER_KEY = "stonebuild-auth-user";
export const AUTH_SESSION_CHANGED_EVENT = "stonebuild-auth-session-changed";

const canUseStorage = () => typeof window !== "undefined";

const emitSessionChanged = () => {
  if (!canUseStorage()) return;
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
};

export const getAuthToken = () => {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getAuthUser = (): StoredAuthUser | null => {
  if (!canUseStorage()) return null;

  const storedUser = window.localStorage.getItem(AUTH_USER_KEY);
  if (!storedUser) return null;

  try {
    const user = JSON.parse(storedUser) as unknown;
    return user && typeof user === "object"
      ? (user as StoredAuthUser)
      : null;
  } catch {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

export const getAuthSession = (): AuthSession | null => {
  const token = getAuthToken();
  const user = getAuthUser();

  if (!token || !user) return null;
  return { token, user };
};

export const hasAuthSession = () => Boolean(getAuthSession());

export const setAuthSession = ({ token, user }: AuthSession) => {
  if (!canUseStorage()) return;

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  emitSessionChanged();
};

export const clearAuthSession = () => {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  emitSessionChanged();
};
