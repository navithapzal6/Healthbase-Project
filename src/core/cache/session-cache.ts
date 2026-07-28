import type { CacheAdapter, CacheEntry } from "./types";

const STORAGE_PREFIX = "stonebuild-cache:";

const canUseSessionStorage = () => typeof window !== "undefined";

const storageKey = (key: string) => `${STORAGE_PREFIX}${key}`;

class SessionCache implements CacheAdapter {
  get<T>(key: string): T | null {
    if (!canUseSessionStorage()) return null;

    const itemKey = storageKey(key);
    const stored = window.sessionStorage.getItem(itemKey);
    if (!stored) return null;

    try {
      const entry = JSON.parse(stored) as CacheEntry<T>;

      if (
        !entry ||
        typeof entry.expiresAt !== "number" ||
        entry.expiresAt <= Date.now()
      ) {
        window.sessionStorage.removeItem(itemKey);
        return null;
      }

      return entry.value;
    } catch {
      window.sessionStorage.removeItem(itemKey);
      return null;
    }
  }

  set<T>(key: string, value: T, ttlMs: number) {
    if (!canUseSessionStorage()) return;

    try {
      window.sessionStorage.setItem(
        storageKey(key),
        JSON.stringify({
          value,
          expiresAt: Date.now() + Math.max(0, ttlMs),
        } satisfies CacheEntry<T>),
      );
    } catch {
      // Storage can be unavailable or full. Live React state keeps the list
      // functional, so a cache failure must never break a page.
    }
  }

  remove(key: string) {
    if (!canUseSessionStorage()) return;
    window.sessionStorage.removeItem(storageKey(key));
  }

  clearScope(scope: string) {
    if (!canUseSessionStorage()) return;

    const scopedPrefix = storageKey(`${scope}:`);
    const exactKey = storageKey(scope);

    for (let index = window.sessionStorage.length - 1; index >= 0; index -= 1) {
      const key = window.sessionStorage.key(index);
      if (key === exactKey || key?.startsWith(scopedPrefix)) {
        window.sessionStorage.removeItem(key);
      }
    }
  }

  clear() {
    if (!canUseSessionStorage()) return;

    for (let index = window.sessionStorage.length - 1; index >= 0; index -= 1) {
      const key = window.sessionStorage.key(index);
      if (key?.startsWith(STORAGE_PREFIX)) {
        window.sessionStorage.removeItem(key);
      }
    }
  }
}

export const sessionCache = new SessionCache();
