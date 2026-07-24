import type { AppLogger, LogLevel, LogMetadata } from "./types";

const sensitiveKeyPattern =
  /password|confirmPassword|token|authorization|cookie|secret|apiKey/i;
const maximumDepth = 4;
const runtimeEnvironment = process.env.NODE_ENV;

const normalizeValue = (
  value: unknown,
  depth = 0,
  seen = new WeakSet<object>(),
): unknown => {
  if (depth > maximumDepth) return "[Max depth]";

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: runtimeEnvironment === "development" ? value.stack : undefined,
      cause:
        "cause" in value
          ? normalizeValue(value.cause, depth + 1, seen)
          : undefined,
    };
  }

  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item, depth + 1, seen));
  }

  if (value && typeof value === "object") {
    if (seen.has(value)) return "[Circular]";
    seen.add(value);

    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        sensitiveKeyPattern.test(key)
          ? "[REDACTED]"
          : normalizeValue(item, depth + 1, seen),
      ]),
    );
  }

  return value;
};

const shouldWrite = (level: LogLevel) =>
  runtimeEnvironment !== "production" || level === "warn" || level === "error";

const writeToConsole = (level: LogLevel, values: unknown[]) => {
  switch (level) {
    case "debug":
      console.debug(...values);
      break;
    case "info":
      console.info(...values);
      break;
    case "warn":
      console.warn(...values);
      break;
    case "error":
      console.error(...values);
      break;
  }
};

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
    writeToConsole(level, [prefix, message, normalizedMetadata]);
    return;
  }

  writeToConsole(level, [prefix, message]);
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
