import type { AppLogger, LogLevel, LogMetadata } from "./types";

const sensitiveKeyPattern =
  /password|confirmPassword|token|authorization|cookie|secret|apiKey/i;
const maximumDepth = 4;
const runtimeEnvironment = (
  globalThis as { process?: { env?: { NODE_ENV?: string } } }
).process?.env?.NODE_ENV;

const normalizeValue = (value: unknown, depth = 0): unknown => {
  if (depth > maximumDepth) return "[Max depth]";

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: runtimeEnvironment === "development" ? value.stack : undefined,
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item, depth + 1));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        sensitiveKeyPattern.test(key)
          ? "[REDACTED]"
          : normalizeValue(item, depth + 1),
      ]),
    );
  }

  return value;
};

const shouldWrite = (level: LogLevel) =>
  runtimeEnvironment !== "production" || level === "warn" || level === "error";

const write = (
  level: LogLevel,
  scope: string,
  message: string,
  metadata?: LogMetadata,
) => {
  if (!shouldWrite(level)) return;

  const prefix = `[Stonebuild] [${scope}]`;
  const normalizedMetadata = metadata
    ? normalizeValue(metadata)
    : undefined;

  if (normalizedMetadata) {
    console[level](prefix, message, normalizedMetadata);
    return;
  }

  console[level](prefix, message);
};

export const createLogger = (scope = "app"): AppLogger => ({
  debug: (message, metadata) => write("debug", scope, message, metadata),
  info: (message, metadata) => write("info", scope, message, metadata),
  warn: (message, metadata) => write("warn", scope, message, metadata),
  error: (message, error, metadata) =>
    write("error", scope, message, {
      ...metadata,
      ...(error === undefined ? {} : { error }),
    }),
  child: (childScope) => createLogger(`${scope}:${childScope}`),
});

export const logger = createLogger();
