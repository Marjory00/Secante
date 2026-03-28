import { Circle } from "lucide-react";
import type { AlertSeverity } from "../../types/auth";

interface StatusBadgeProps {
  value: string;
  severity?: AlertSeverity;
}

export default function StatusBadge({ value, severity }: StatusBadgeProps) {
  const styles =
    severity === "critical"
      ? "bg-red-500/10 text-red-300 ring-red-500/20"
      : severity === "high"
      ? "bg-orange-500/10 text-orange-300 ring-orange-500/20"
      : severity === "medium"
      ? "bg-yellow-500/10 text-yellow-300 ring-yellow-500/20"
      : severity === "low"
      ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20"
      : "bg-slate-500/10 text-slate-300 ring-slate-500/20";

  const dotColor =
    severity === "critical"
      ? "text-red-400"
      : severity === "high"
      ? "text-orange-400"
      : severity === "medium"
      ? "text-yellow-400"
      : severity === "low"
      ? "text-emerald-400"
      : "text-slate-400";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 backdrop-blur ${styles}`}
    >
      {/* STATUS DOT */}
      <Circle className={`h-2.5 w-2.5 fill-current ${dotColor}`} />

      {/* LABEL */}
      <span className="capitalize">{value}</span>
    </span>
  );
}