import { Play, Signal, Wrench } from "lucide-react";
import { useCameras } from "../hooks/useCameras";
import PanelCard from "../components/ui/PanelCard";
import StatusBadge from "../components/ui/StatusBadge";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";

export default function CamerasPage() {
  const { cameras, loading, error } = useCameras();

  return (
    <div className="space-y-6">
      <PanelCard
        title="Camera Grid"
        subtitle="Live camera endpoints and operational status"
      >
        {loading ? (
          <LoadingState label="Loading cameras..." />
        ) : error ? (
          <EmptyState title="Unable to load cameras" message={error} />
        ) : !cameras.length ? (
          <EmptyState
            title="No cameras available"
            message="No camera streams were returned by the backend."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {cameras.map((camera) => (
              <article
                key={camera.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/30 shadow-[0_20px_50px_rgba(2,6,23,0.35)]"
              >
                <div className="feed-frame relative aspect-video bg-slate-900">
                  {camera.image ? (
                    <img
                      src={camera.image}
                      alt={`${camera.name} preview`}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : null}

                  <div className="feed-overlay" />

                  <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-md">
                    <span
                      className={`status-dot ${
                        camera.status === "maintenance" || camera.status === "degraded"
                          ? "warning"
                          : camera.status
                      }`}
                    />
                    <span className="capitalize">{camera.status}</span>
                  </div>

                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="rounded-full border border-white/10 bg-slate-950/70 p-4 text-slate-100 shadow-lg backdrop-blur-md">
                      <Play className="h-8 w-8 text-blue-400" />
                    </div>
                  </div>

                  <div className="feed-label">{camera.streamLabel}</div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-white">
                        {camera.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">{camera.location}</p>
                    </div>
                    <StatusBadge value={camera.status} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
                    >
                      <Signal className="h-4 w-4" />
                      Open feed
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                    >
                      <Wrench className="h-4 w-4" />
                      Inspect
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </PanelCard>
    </div>
  );
}