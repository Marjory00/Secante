export type AlertSeverity = "low" | "medium" | "high" | "critical";

type StatusBadgeProps = {
  value: string;
  severity?: AlertSeverity;
};

export default function StatusBadge({
  value,
  severity,
}: StatusBadgeProps) {
  const styles: Record<AlertSeverity, string> = {
    low: "bg-slate-500/10 text-slate-300 border border-slate-400/20",
    medium: "bg-blue-500/10 text-blue-300 border border-blue-400/20",
    high: "bg-amber-500/10 text-amber-300 border border-amber-400/20",
    critical: "bg-red-500/10 text-red-300 border border-red-400/20",
  };

  const tone = severity ? styles[severity] : "bg-white/5 text-slate-300 border border-white/10";

  return (
    <span className={`rounded-2xl px-3 py-1 text-xs font-medium ${tone}`}>
      {value}
    </span>
  );
}