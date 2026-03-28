import type { PropsWithChildren, ReactNode } from "react";

interface PanelCardProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PanelCard({
  title,
  subtitle,
  action,
  children,
}: PanelCardProps) {
  return (
    <section className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/40 shadow-[0_20px_80px_rgba(15,23,42,0.35)] transition">
      
      {/* subtle hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-transparent" />
      </div>

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 bg-slate-900/60 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Panel
          </p>

          <h3 className="font-display mt-1 text-lg font-semibold tracking-tight text-white">
            {title}
          </h3>

          {subtitle ? (
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          ) : null}
        </div>

        {action && (
          <div className="flex items-center gap-2">
            {action}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}