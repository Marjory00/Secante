import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  message: string;
}

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/40 px-6 py-12 text-center shadow-[0_20px_80px_rgba(15,23,42,0.35)]">
      
      {/* ICON */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/70">
        <SearchX className="h-6 w-6 text-slate-400" />
      </div>

      {/* TEXT */}
      <h3 className="font-display mt-5 text-xl font-semibold tracking-tight text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
        {message}
      </p>

      {/* SUBTLE CONTEXT */}
      <p className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-500">
        No data available
      </p>
    </div>
  );
}