import { Activity } from "lucide-react";

interface LoadingStateProps {
  label?: string;
}

export default function LoadingState({
  label = "Synchronizing system data..."
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/40 px-6 py-10 text-center shadow-[0_20px_80px_rgba(15,23,42,0.35)]">
      
      {/* SPINNER + ICON */}
      <div className="relative flex items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />
        
        <div className="absolute flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70">
          <Activity className="h-5 w-5 text-blue-400" />
        </div>
      </div>

      {/* TEXT */}
      <p className="mt-6 font-display text-lg font-semibold tracking-tight text-white">
        {label}
      </p>

      <p className="mt-2 text-sm text-slate-400">
        Please wait while the system retrieves the latest data.
      </p>

      {/* STATUS LINE */}
      <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
        Processing
      </div>
    </div>
  );
}