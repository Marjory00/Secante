import { Activity, AlertTriangle, Camera, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { useCameras } from "../hooks/useCameras";
import { useAlerts } from "../hooks/useAlerts";
import type { AlertSeverity, CameraStatus } from "../types/auth";
import PanelCard from "../components/ui/PanelCard";
import StatusBadge from "../components/ui/StatusBadge";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";

function getOverlayStatusDot(
  status: CameraStatus
): "online" | "offline" | "warning" {
  if (status === "maintenance" || status === "degraded") {
    return "warning";
  }

  if (status === "offline") {
    return "offline";
  }

  return "online";
}

function getSeverityClass(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "text-red-400";
    case "high":
      return "text-orange-400";
    case "medium":
      return "text-amber-400";
    case "low":
      return "text-emerald-400";
    default:
      return "text-slate-400";
  }
}

export default function DashboardPage() {
  const {
    cameras,
    loading: camLoading,
    error: camError,
    refetch: refetchCameras,
  } = useCameras();

  const {
    alerts,
    loading: alertLoading,
    error: alertError,
    refetch: refetchAlerts,
  } = useAlerts();

  const stats = useMemo(() => {
    const total = cameras.length;
    const online = cameras.filter((camera) => camera.status === "online").length;
    const offline = cameras.filter((camera) => camera.status === "offline").length;
    const attention = cameras.filter(
      (camera) =>
        camera.status === "maintenance" || camera.status === "degraded"
    ).length;

    const openAlerts = alerts.filter(
      (alert) => alert.status === "open" || alert.status === "investigating"
    ).length;

    const critical = alerts.filter(
      (alert) => alert.severity === "critical" || alert.severity === "high"
    ).length;

    const health = total > 0 ? Math.round((online / total) * 100) : 0;

    return {
      total,
      online,
      offline,
      attention,
      openAlerts,
      critical,
      health,
    };
  }, [cameras, alerts]);

  const previewCameras = cameras.slice(0, 4);
  const recentAlerts = alerts.slice(0, 4);
  const systemOnline = stats.health >= 80;
  const dashboardHasError = Boolean(camError || alertError);

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-blue-400">
            Development environment
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Real-time Monitoring Workspace
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Unified visibility for alerts, camera coverage, and system health.
          </p>
        </div>

        <div
          className={`rounded-full border px-4 py-2 text-sm font-medium ${
            systemOnline
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {systemOnline ? "System Online" : "System Degraded"}
        </div>
      </section>

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
            {stats.critical} high-priority incidents
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
            {stats.online} / {stats.total}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {stats.offline} offline · {stats.attention} need attention
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

          <p className="text-3xl font-bold text-white">{stats.health}%</p>
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
            {stats.total > 0 ? "Active" : "N/A"}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Monitoring perimeter and interior zones
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <PanelCard
          title="Camera Overview"
          subtitle="Priority camera feeds from monitored zones"
        >
          {camLoading ? (
            <LoadingState label="Loading cameras..." />
          ) : camError ? (
            <div className="space-y-4">
              <EmptyState title="Camera error" message={camError} />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => void refetchCameras()}
                  className="secondary-button"
                >
                  Retry cameras
                </button>
              </div>
            </div>
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
                  className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900"
                >
                  <div className="feed-frame relative aspect-video">
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

                    <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-slate-100">
                      <span
                        className={`status-dot ${getOverlayStatusDot(
                          camera.status
                        )}`}
                        aria-hidden="true"
                      />
                      <span className="capitalize">{camera.status}</span>
                    </div>

                    <div className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-full bg-red-500/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                      Live
                    </div>

                    <div className="feed-label">{camera.streamLabel}</div>
                  </div>

                  <div className="flex items-start justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-white">{camera.name}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {camera.location}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        Signal:{" "}
                        {camera.status === "online"
                          ? "Strong"
                          : camera.status === "offline"
                          ? "Lost"
                          : "Degraded"}
                      </p>
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
          {alertLoading ? (
            <LoadingState label="Loading alerts..." />
          ) : alertError ? (
            <div className="space-y-4">
              <EmptyState title="Alert error" message={alertError} />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => void refetchAlerts()}
                  className="secondary-button"
                >
                  Retry alerts
                </button>
              </div>
            </div>
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
                  className="rounded-xl border border-white/10 bg-slate-900 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-white">{alert.title}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {alert.location}
                      </p>
                    </div>

                    <StatusBadge value={alert.status} />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                    <span
                      className={`font-semibold uppercase tracking-[0.14em] ${getSeverityClass(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-slate-500">{alert.time}</span>
                  </div>

                  <div className="mt-3 flex gap-4 text-xs">
                    <button
                      type="button"
                      className="text-blue-400 transition hover:text-blue-300"
                    >
                      Acknowledge
                    </button>
                    <button
                      type="button"
                      className="text-slate-400 transition hover:text-slate-200"
                    >
                      Open incident
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </PanelCard>
      </section>

      {dashboardHasError ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              void refetchCameras();
              void refetchAlerts();
            }}
            className="secondary-button"
          >
            Retry dashboard data
          </button>
        </div>
      ) : null}
    </div>
  );
}