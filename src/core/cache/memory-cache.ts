import type { CacheAdapter, CacheEntry } from "./types";

class MemoryCache implements CacheAdapter {
  private readonly entries = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.entries.get(key);
    if (!entry) return null;

    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number) {
    this.entries.set(key, {
      value,
      expiresAt: Date.now() + Math.max(0, ttlMs),
    });
  }

  remove(key: string) {
    this.entries.delete(key);
  }

  clearScope(scope: string) {
    const prefix = `${scope}:`;

    for (const key of this.entries.keys()) {
      if (key === scope || key.startsWith(prefix)) {
        this.entries.delete(key);
      }
    }
  }

  clear() {
    this.entries.clear();
  }
}

export const memoryCache = new MemoryCache();
