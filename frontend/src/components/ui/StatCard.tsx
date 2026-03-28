import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  helper: string;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({
  label,
  value,
  helper,
  trend = "neutral",
}: StatCardProps) {
  const trendStyles =
    trend === "up"
      ? "text-emerald-400"
      : trend === "down"
      ? "text-red-400"
      : "text-slate-400";

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/40 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.35)] transition">

      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-transparent" />
      </div>

      {/* LABEL */}
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>

      {/* VALUE */}
      <div className="mt-3 flex items-center justify-between">
        <p className="font-display text-3xl font-semibold tracking-tight text-white">
          {value}
        </p>

        {/* TREND ICON */}
        {trend !== "neutral" && (
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ${trendStyles}`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
          </div>
        )}
      </div>

      {/* HELPER */}
      <p className={`mt-3 text-sm ${trendStyles}`}>
        {helper}
      </p>
    </div>
  );
}