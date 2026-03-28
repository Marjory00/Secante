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
                className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/30"
              >
                <div className="flex aspect-video items-center justify-center bg-linear-to-br from-slate-800 to-slate-900">
                  <div className="text-center">
                    <Play className="mx-auto h-10 w-10 text-blue-400" />
                    <p className="mt-2 text-sm text-slate-400">{camera.streamLabel}</p>
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white">{camera.name}</h3>
                      <p className="text-sm text-slate-400">{camera.location}</p>
                    </div>
                    <StatusBadge value={camera.status} />
                  </div>

                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400">
                      <Signal className="h-4 w-4" />
                      Open feed
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10">
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