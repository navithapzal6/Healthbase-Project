export interface LoaderProps {
  label?: string;
  fullScreen?: boolean;
  inline?: boolean;
  size?: "sm" | "md" | "lg";
  tone?: "primary" | "success" | "current";
  className?: string;
}

const sizes = { sm: 18, md: 34, lg: 52 };

const Loader = ({
  label = "Loading...",
  fullScreen = false,
  inline = false,
  size = "md",
  tone = "primary",
  className = "",
}: LoaderProps) => {
  const dimension = sizes[size];
  const barWidth = Math.max(2, Math.round(dimension * 0.12));
  const barHeight = Math.max(5, Math.round(dimension * 0.3));
  const radius = dimension * 0.31;

  const segmentColor =
    tone === "current"
      ? "bg-current"
      : tone === "success"
        ? "bg-success"
        : "bg-primary";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label || "Loading"}
      className={`flex items-center justify-center gap-3 ${
        fullScreen
          ? "fixed inset-0 z-[9999] min-h-screen w-screen bg-background/80 backdrop-blur-[1px]"
          : inline
            ? ""
            : "py-8"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="relative inline-block shrink-0"
        style={{ width: dimension, height: dimension }}
      >
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            className={`absolute left-1/2 top-1/2 rounded-full ${segmentColor}`}
            style={{
              width: barWidth,
              height: barHeight,
              marginLeft: -barWidth / 2,
              marginTop: -barHeight / 2,
              transform: `rotate(${index * 30}deg) translateY(-${radius}px)`,
              animation: "loader-segment-fade 1.2s linear infinite",
              animationDelay: `${index * 0.1 - 1.1}s`,
            }}
          />
        ))}
      </span>

      {label && !inline && (
        <span className="text-sm font-medium text-slate-600">{label}</span>
      )}
    </div>
  );
};

export default Loader;
