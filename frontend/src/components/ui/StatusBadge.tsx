import { Circle } from "lucide-react";
import type { AlertSeverity } from "../../types/auth";

interface StatusBadgeProps {
  value: string;
  severity?: AlertSeverity;
}

export default function StatusBadge({ value, severity }: StatusBadgeProps) {
  const severityMap: Record<
    AlertSeverity | "default",
    { bg: string; text: string; ring: string; dot: string }
  > = {
    critical: {
      bg: "bg-red-500/10",
      text: "text-red-300",
      ring: "ring-red-500/20",
      dot: "text-red-400",
    },
    high: {
      bg: "bg-orange-500/10",
      text: "text-orange-300",
      ring: "ring-orange-500/20",
      dot: "text-orange-400",
    },
    medium: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-300",
      ring: "ring-yellow-500/20",
      dot: "text-yellow-400",
    },
    low: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
      ring: "ring-emerald-500/20",
      dot: "text-emerald-400",
    },
    default: {
      bg: "bg-slate-500/10",
      text: "text-slate-300",
      ring: "ring-slate-500/20",
      dot: "text-slate-400",
    },
  };

  const current = severityMap[severity ?? "default"];

  return (
    <span
      role="status"
      aria-label={`Status: ${value}`}
      className={`inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 backdrop-blur ${current.bg} ${current.text} ${current.ring}`}
    >
      {/* STATUS DOT */}
      <Circle
        className={`h-2.5 w-2.5 shrink-0 fill-current ${current.dot}`}
      />

      {/* LABEL */}
      <span className="truncate capitalize">{value ?? "unknown"}</span>
    </span>
  );
}