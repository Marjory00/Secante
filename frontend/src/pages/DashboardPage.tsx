import { Activity, AlertTriangle, Camera, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { useCameras } from "../hooks/useCameras";
import { useAlerts } from "../hooks/useAlerts";
import PanelCard from "../components/ui/PanelCard";
import StatusBadge from "../components/ui/StatusBadge";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";

function getOverlayStatusDot(status: string) {
  if (status === "maintenance" || status === "degraded") return "warning";
  if (status === "offline") return "offline";
  return "online";
}

export default function DashboardPage() {
  const { cameras, loading: camLoading, error: camError } = useCameras();
  const { alerts, loading: alertLoading, error: alertError } = useAlerts();

  const stats = useMemo(() => {
    const total = cameras.length;
    const online = cameras.filter((c) => c.status === "online").length;
    const offline = cameras.filter((c) => c.status === "offline").length;
    const attention = cameras.filter(
      (c) => c.status === "maintenance" || c.status === "degraded"
    ).length;

    const openAlerts = alerts.filter(
      (a) => a.status === "open" || a.status === "investigating"
    ).length;

    const critical = alerts.filter(
      (a) => a.severity === "critical" || a.severity === "high"
    ).length;

    const health = total ? Math.round((online / total) * 100) : 0;

    return { total, online, offline, attention, openAlerts, critical, health };
  }, [cameras, alerts]);

  const previewCameras = cameras.slice(0, 4);
  const recentAlerts = alerts.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 🔥 METRICS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="glass-panel p-5">
          <AlertTriangle className="mb-3 text-blue-400" />
          <p className="text-3xl font-bold text-white">{stats.openAlerts}</p>
          <p className="text-sm text-slate-400">
            {stats.critical} high-priority incidents
          </p>
        </div>

        <div className="glass-panel p-5">
          <Camera className="mb-3 text-emerald-400" />
          <p className="text-3xl font-bold text-white">
            {stats.online} / {stats.total || 0}
          </p>
          <p className="text-sm text-slate-400">
            {stats.offline} offline · {stats.attention} issues
          </p>
        </div>

        <div className="glass-panel p-5">
          <Activity className="mb-3 text-amber-400" />
          <p className="text-3xl font-bold text-white">{stats.health}%</p>
          <p className="text-sm text-slate-400">System health</p>
        </div>

        <div className="glass-panel p-5">
          <ShieldCheck className="mb-3 text-cyan-400" />
          <p className="text-3xl font-bold text-white">Active</p>
          <p className="text-sm text-slate-400">Monitoring enabled</p>
        </div>
      </section>

      {/* 🔥 MAIN GRID */}
      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        
        {/* CAMERAS */}
        <PanelCard title="Camera Overview" subtitle="Live feeds">
          {camLoading ? (
            <LoadingState label="Loading cameras..." />
          ) : camError ? (
            <EmptyState title="Camera error" message={camError} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {previewCameras.map((camera) => (
                <article
                  key={camera.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900"
                >
                  <div className="relative aspect-video">
                    <img
                      src={camera.image}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/favicon.svg";
                      }}
                    />

                    {/* STATUS */}
                    <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs">
                      <span
                        className={`status-dot ${getOverlayStatusDot(camera.status)}`}
                      />
                      {camera.status}
                    </div>
                  </div>

                  <div className="flex justify-between p-3">
                    <div>
                      <p className="text-white">{camera.name}</p>
                      <p className="text-xs text-slate-400">
                        {camera.location}
                      </p>
                    </div>

                    <StatusBadge value={camera.status} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </PanelCard>

        {/* ALERTS */}
        <PanelCard title="Recent Alerts" subtitle="Latest incidents">
          {alertLoading ? (
            <LoadingState label="Loading alerts..." />
          ) : alertError ? (
            <EmptyState title="Alert error" message={alertError} />
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-xl border border-white/10 bg-slate-900 p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-white">{alert.title}</p>
                      <p className="text-xs text-slate-400">
                        {alert.location}
                      </p>
                    </div>

                    <StatusBadge value={alert.status} />
                  </div>

                  <div className="mt-2 flex justify-between text-xs text-slate-400">
                    <span>{alert.severity}</span>
                    <span>{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PanelCard>
      </section>
    </div>
  );
}