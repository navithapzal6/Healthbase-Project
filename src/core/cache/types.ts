export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface CacheAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttlMs: number): void;
  remove(key: string): void;
  clearScope(scope: string): void;
  clear(): void;
}

export type CachePolicy = "memory" | "session" | "none";
