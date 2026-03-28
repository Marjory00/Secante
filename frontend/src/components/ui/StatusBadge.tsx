import type { AlertSeverity } from "../../types/auth";

interface StatusBadgeProps {
  value: string;
  severity?: AlertSeverity;
}

export default function StatusBadge({ value, severity }: StatusBadgeProps) {
  const styles =
    severity === "critical"
      ? "bg-red-500/15 text-red-300 ring-red-400/20"
      : severity === "high"
        ? "bg-orange-500/15 text-orange-300 ring-orange-400/20"
        : severity === "medium"
          ? "bg-yellow-500/15 text-yellow-300 ring-yellow-400/20"
          : severity === "low"
            ? "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20"
            : "bg-slate-500/15 text-slate-300 ring-slate-400/20";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles}`}>
      {value}
    </span>
  );
}