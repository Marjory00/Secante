interface LoadingStateProps {
  label?: string;
}

export default function LoadingState({
  label = "Loading data..."
}: LoadingStateProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400" />
      <p className="mt-4 text-sm text-slate-400">{label}</p>
    </div>
  );
}