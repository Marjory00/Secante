import { Activity, AlertTriangle, Camera, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { useCameras } from "../hooks/useCameras";
import { useAlerts } from "../hooks/useAlerts";
import PanelCard from "../components/ui/PanelCard";
import StatusBadge from "../components/ui/StatusBadge";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";

function getOverlayStatusDot(status: string) {
  if (status === "maintenance" || status === "degraded") {
    return "warning";
  }

  if (status === "offline") {
    return "offline";
  }

  return "online";
}

export default function DashboardPage() {
  const {
    cameras,
    loading: camerasLoading,
    error: camerasError,
  } = useCameras();

  const {
    alerts,
    loading: alertsLoading,
    error: alertsError,
  } = useAlerts();

  const stats = useMemo(() => {
    const totalCameras = cameras.length;
    const onlineCameras = cameras.filter((camera) => camera.status === "online").length;
    const offlineCameras = cameras.filter((camera) => camera.status === "offline").length;
    const attentionCameras = cameras.filter(
      (camera) => camera.status === "maintenance" || camera.status === "degraded"
    ).length;

    const openAlerts = alerts.filter(
      (alert) => alert.status === "open" || alert.status === "investigating"
    ).length;

    const criticalAlerts = alerts.filter(
      (alert) => alert.severity === "critical" || alert.severity === "high"
    ).length;

    const systemHealth =
      totalCameras > 0
        ? Math.round((onlineCameras / totalCameras) * 100)
        : 0;

    return {
      totalCameras,
      onlineCameras,
      offlineCameras,
      attentionCameras,
      openAlerts,
      criticalAlerts,
      systemHealth,
    };
  }, [alerts, cameras]);

  const previewCameras = cameras.slice(0, 4);
  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="glass-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-2xl bg-blue-500/15 p-3 text-blue-400">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Alerts
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.openAlerts}</p>
          <p className="mt-2 text-sm text-slate-400">
            {stats.criticalAlerts} high-priority incidents
          </p>
        </article>

        <article className="glass-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-400">
              <Camera className="h-5 w-5" />
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Cameras
            </span>
          </div>
          <p className="text-3xl font-bold text-white">
            {stats.onlineCameras} / {stats.totalCameras || 0}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {stats.offlineCameras} offline · {stats.attentionCameras} need attention
          </p>
        </article>

        <article className="glass-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-2xl bg-amber-500/15 p-3 text-amber-400">
              <Activity className="h-5 w-5" />
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Health
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.systemHealth}%</p>
          <p className="mt-2 text-sm text-slate-400">
            Live network camera availability
          </p>
        </article>

        <article className="glass-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Coverage
            </span>
          </div>
          <p className="text-3xl font-bold text-white">
            {stats.totalCameras > 0 ? "Active" : "N/A"}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Monitoring perimeter and interior zones
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <PanelCard
          title="Camera Overview"
          subtitle="Priority camera feeds from monitored zones"
        >
          {camerasLoading ? (
            <LoadingState label="Loading dashboard cameras..." />
          ) : camerasError ? (
            <EmptyState title="Unable to load cameras" message={camerasError} />
          ) : previewCameras.length === 0 ? (
            <EmptyState
              title="No camera previews"
              message="Camera preview feeds are not available yet."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {previewCameras.map((camera) => (
                <article
                  key={camera.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/30"
                >
                  <div className="feed-frame relative aspect-video bg-slate-900">
                    <img
                      src={camera.image}
                      alt={`${camera.name} preview`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(event) => {
                        const target = event.currentTarget;
                        if (!target.dataset.fallbackApplied) {
                          target.dataset.fallbackApplied = "true";
                          target.src = "/favicon.svg";
                        }
                      }}
                    />

                    <div className="feed-overlay" />

                    <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-md">
                      <span
                        className={`status-dot ${getOverlayStatusDot(camera.status)}`}
                        aria-hidden="true"
                      />
                      <span className="capitalize">{camera.status}</span>
                    </div>

                    <div className="feed-label">{camera.streamLabel}</div>
                  </div>

                  <div className="flex items-start justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-white">
                        {camera.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">{camera.location}</p>
                    </div>
                    <StatusBadge value={camera.status} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </PanelCard>

        <PanelCard
          title="Recent Alerts"
          subtitle="Latest security events across monitored locations"
        >
          {alertsLoading ? (
            <LoadingState label="Loading recent alerts..." />
          ) : alertsError ? (
            <EmptyState title="Unable to load alerts" message={alertsError} />
          ) : recentAlerts.length === 0 ? (
            <EmptyState
              title="No alerts found"
              message="Recent incident activity will appear here."
            />
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <article
                  key={alert.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/30 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-white">
                        {alert.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {alert.location}
                      </p>
                    </div>
                    <StatusBadge value={alert.status} />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                    <span className="capitalize text-slate-300">
                      Severity: {alert.severity}
                    </span>
                    <span className="text-slate-500">{alert.time}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </PanelCard>
      </section>
    </div>
  );
}