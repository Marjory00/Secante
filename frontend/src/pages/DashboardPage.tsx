import {
  Activity,
  AlertTriangle,
  Camera,
  ShieldCheck,
  RefreshCw,
  Siren,
  Radio,
  ShieldAlert,
  Eye,
  MapPin,
  Wrench,
  ChevronRight,
  CheckCircle2,
  MonitorPlay,
  XCircle,
  TimerReset,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCameras } from "../hooks/useCameras";
import { useAlerts } from "../hooks/useAlerts";
import type { AlertSeverity, CameraStatus } from "../types/auth";
import PanelCard from "../components/ui/PanelCard";
import StatusBadge from "../components/ui/StatusBadge";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";

type CameraFilter = "all" | "online" | "offline" | "attention";
type AlertFilter = "all" | "open" | "critical";

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

function getSeverityBadgeClass(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "border-red-500/30 bg-red-500/10 text-red-400";
    case "high":
      return "border-orange-500/30 bg-orange-500/10 text-orange-400";
    case "medium":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    case "low":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    default:
      return "border-white/10 bg-white/5 text-slate-400";
  }
}

function getSignalLabel(status: CameraStatus) {
  if (status === "online") return "Strong";
  if (status === "offline") return "Lost";
  if (status === "maintenance") return "Maintenance";
  return "Degraded";
}

function getCameraHealthTone(status: CameraStatus): string {
  if (status === "online") return "text-emerald-400";
  if (status === "offline") return "text-red-400";
  if (status === "maintenance") return "text-amber-400";
  return "text-orange-300";
}

export default function DashboardPage() {
  const {
    cameras = [],
    loading: camLoading,
    error: camError,
    refetch: refetchCameras,
  } = useCameras();

  const {
    alerts = [],
    loading: alertLoading,
    error: alertError,
    refetch: refetchAlerts,
  } = useAlerts();

  const [cameraFilter, setCameraFilter] = useState<CameraFilter>("all");
  const [alertFilter, setAlertFilter] = useState<AlertFilter>("all");
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [acknowledgedAlertIds, setAcknowledgedAlertIds] = useState<string[]>([]);
  const [inspectedCameraIds, setInspectedCameraIds] = useState<string[]>([]);

  const stats = useMemo(() => {
    const total = cameras.length;
    const online = cameras.filter((camera) => camera.status === "online").length;
    const offline = cameras.filter((camera) => camera.status === "offline").length;
    const attention = cameras.filter(
      (camera) =>
        camera.status === "maintenance" || camera.status === "degraded"
    ).length;

    const maintenance = cameras.filter(
      (camera) => camera.status === "maintenance"
    ).length;

    const degraded = cameras.filter(
      (camera) => camera.status === "degraded"
    ).length;

    const openAlerts = alerts.filter(
      (alert) => alert.status === "open" || alert.status === "investigating"
    ).length;

    const critical = alerts.filter(
      (alert) => alert.severity === "critical"
    ).length;

    const highPriority = alerts.filter(
      (alert) =>
        alert.severity === "critical" || alert.severity === "high"
    ).length;

    const health = total > 0 ? Math.round((online / total) * 100) : 0;

    return {
      total,
      online,
      offline,
      attention,
      maintenance,
      degraded,
      openAlerts,
      critical,
      highPriority,
      health,
    };
  }, [cameras, alerts]);

  const filteredCameras = useMemo(() => {
    switch (cameraFilter) {
      case "online":
        return cameras.filter((camera) => camera.status === "online");
      case "offline":
        return cameras.filter((camera) => camera.status === "offline");
      case "attention":
        return cameras.filter(
          (camera) =>
            camera.status === "maintenance" || camera.status === "degraded"
        );
      default:
        return cameras;
    }
  }, [cameraFilter, cameras]);

  const filteredAlerts = useMemo(() => {
    switch (alertFilter) {
      case "open":
        return alerts.filter(
          (alert) =>
            alert.status === "open" || alert.status === "investigating"
        );
      case "critical":
        return alerts.filter(
          (alert) =>
            alert.severity === "critical" || alert.severity === "high"
        );
      default:
        return alerts;
    }
  }, [alertFilter, alerts]);

  const previewCameras = filteredCameras.slice(0, 4);
  const recentAlerts = filteredAlerts.slice(0, 5);
  const systemOnline = stats.health >= 80;
  const dashboardHasError = Boolean(camError || alertError);

  const selectedCamera =
    cameras.find((camera) => camera.id === selectedCameraId) ??
    previewCameras[0] ??
    null;

  const selectedAlert =
    alerts.find((alert) => alert.id === selectedAlertId) ??
    recentAlerts[0] ??
    null;

  useEffect(() => {
    if (!selectedCameraId && previewCameras[0]) {
      setSelectedCameraId(previewCameras[0].id);
    }
  }, [previewCameras, selectedCameraId]);

  useEffect(() => {
    if (!selectedAlertId && recentAlerts[0]) {
      setSelectedAlertId(recentAlerts[0].id);
    }
  }, [recentAlerts, selectedAlertId]);

  async function handleRefreshWorkspace() {
    try {
      setIsRefreshing(true);
      await Promise.all([refetchCameras(), refetchAlerts()]);
    } finally {
      setIsRefreshing(false);
    }
  }

  function handleReviewIncidents() {
    setAlertFilter("open");
    if (recentAlerts[0]) {
      setSelectedAlertId(recentAlerts[0].id);
    }
  }

  function handleOpenFeed(cameraId: string) {
    setSelectedCameraId(cameraId);
  }

  function handleInspectCamera(cameraId: string) {
    setSelectedCameraId(cameraId);
    setInspectedCameraIds((current) =>
      current.includes(cameraId) ? current : [...current, cameraId]
    );
  }

  function handleAcknowledgeAlert(alertId: string) {
    setSelectedAlertId(alertId);
    setAcknowledgedAlertIds((current) =>
      current.includes(alertId) ? current : [...current, alertId]
    );
  }

  function handleOpenIncident(alertId: string) {
    setSelectedAlertId(alertId);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-[0_20px_50px_rgba(2,6,23,0.28)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
              <Radio className="h-3.5 w-3.5" />
              Development environment
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Real-time Monitoring Workspace
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Unified visibility for security alerts, camera coverage, operational
              health, and incident response readiness across monitored zones.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleRefreshWorkspace}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh workspace"}
              </button>

              <button
                type="button"
                onClick={handleReviewIncidents}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                <ShieldAlert className="h-4 w-4" />
                Review incidents
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[360px] xl:grid-cols-1">
            <button
              type="button"
              onClick={() => setCameraFilter(systemOnline ? "online" : "attention")}
              className={`rounded-2xl border px-4 py-4 text-left transition hover:border-white/20 ${
                systemOnline
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-red-500/30 bg-red-500/10"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    System status
                  </p>
                  <p
                    className={`mt-2 text-lg font-semibold ${
                      systemOnline ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {systemOnline ? "System Online" : "System Degraded"}
                  </p>
                </div>
                <div
                  className={`rounded-2xl p-3 ${
                    systemOnline
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCameraFilter("all")}
              className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-left transition hover:border-white/20 hover:bg-slate-950/60"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Network health
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {stats.health}%
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full ${
                    stats.health >= 80
                      ? "bg-emerald-400"
                      : stats.health >= 60
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                  style={{ width: `${stats.health}%` }}
                />
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => setAlertFilter("open")}
          className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 text-left shadow-[0_20px_50px_rgba(2,6,23,0.18)] transition hover:border-white/20 hover:bg-slate-900/80"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-2xl bg-red-500/15 p-3 text-red-400">
              <Siren className="h-5 w-5" />
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Open alerts
            </span>
          </div>

          <p className="text-3xl font-bold text-white">{stats.openAlerts}</p>
          <p className="mt-2 text-sm text-slate-400">
            {stats.highPriority} high-priority incidents
          </p>
        </button>

        <button
          type="button"
          onClick={() => setCameraFilter("online")}
          className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 text-left shadow-[0_20px_50px_rgba(2,6,23,0.18)] transition hover:border-white/20 hover:bg-slate-900/80"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-400">
              <Camera className="h-5 w-5" />
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Cameras online
            </span>
          </div>

          <p className="text-3xl font-bold text-white">
            {stats.online} / {stats.total}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {stats.offline} offline · {stats.attention} require attention
          </p>
        </button>

        <button
          type="button"
          onClick={() => setCameraFilter("all")}
          className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 text-left shadow-[0_20px_50px_rgba(2,6,23,0.18)] transition hover:border-white/20 hover:bg-slate-900/80"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-2xl bg-amber-500/15 p-3 text-amber-400">
              <Activity className="h-5 w-5" />
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Health score
            </span>
          </div>

          <p className="text-3xl font-bold text-white">{stats.health}%</p>
          <p className="mt-2 text-sm text-slate-400">
            Live network camera availability
          </p>
        </button>

        <button
          type="button"
          onClick={() => setCameraFilter("attention")}
          className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 text-left shadow-[0_20px_50px_rgba(2,6,23,0.18)] transition hover:border-white/20 hover:bg-slate-900/80"
        >
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
            Interior and perimeter surveillance zones
          </p>
        </button>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <PanelCard
          title="Camera Overview"
          subtitle="Priority camera feeds from monitored zones"
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCameraFilter("all")}
              className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                cameraFilter === "all"
                  ? "bg-blue-500 text-white"
                  : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              }`}
            >
              All cameras
            </button>
            <button
              type="button"
              onClick={() => setCameraFilter("online")}
              className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                cameraFilter === "online"
                  ? "bg-blue-500 text-white"
                  : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              }`}
            >
              Online
            </button>
            <button
              type="button"
              onClick={() => setCameraFilter("offline")}
              className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                cameraFilter === "offline"
                  ? "bg-blue-500 text-white"
                  : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              }`}
            >
              Offline
            </button>
            <button
              type="button"
              onClick={() => setCameraFilter("attention")}
              className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                cameraFilter === "attention"
                  ? "bg-blue-500 text-white"
                  : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              }`}
            >
              Needs attention
            </button>
          </div>

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
              message="Camera preview feeds are not available for the current filter."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {previewCameras.map((camera) => {
                const isSelected = selectedCamera?.id === camera.id;
                const isInspected = inspectedCameraIds.includes(camera.id);

                return (
                  <article
                    key={camera.id}
                    className={`overflow-hidden rounded-2xl border bg-slate-900/80 transition ${
                      isSelected
                        ? "border-blue-500/40 shadow-[0_0_0_1px_rgba(59,130,246,0.25)]"
                        : "border-white/10 hover:border-white/15"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenFeed(camera.id)}
                      className="block w-full text-left"
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
                    </button>

                    <div className="space-y-4 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {camera.name}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                            <MapPin className="h-3.5 w-3.5" />
                            {camera.location}
                          </p>
                        </div>

                        <StatusBadge value={camera.status} />
                      </div>

                      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                            Signal
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-200">
                            {getSignalLabel(camera.status)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                            Stream
                          </p>
                          <p className="mt-1 truncate text-sm font-medium text-slate-200">
                            {camera.streamLabel}
                          </p>
                        </div>
                      </div>

                      {isInspected ? (
                        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300">
                          Inspection added to operator queue
                        </div>
                      ) : null}

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenFeed(camera.id)}
                          className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
                        >
                          <Eye className="h-4 w-4" />
                          Open feed
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInspectCamera(camera.id)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                        >
                          <Wrench className="h-4 w-4" />
                          Inspect
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </PanelCard>

        <PanelCard
          title="Recent Alerts"
          subtitle="Latest security events across monitored locations"
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAlertFilter("all")}
              className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                alertFilter === "all"
                  ? "bg-blue-500 text-white"
                  : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              }`}
            >
              All alerts
            </button>
            <button
              type="button"
              onClick={() => setAlertFilter("open")}
              className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                alertFilter === "open"
                  ? "bg-blue-500 text-white"
                  : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              }`}
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => setAlertFilter("critical")}
              className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                alertFilter === "critical"
                  ? "bg-blue-500 text-white"
                  : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              }`}
            >
              Critical
            </button>
          </div>

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
              message="Recent incident activity will appear here for the current filter."
            />
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => {
                const isSelected = selectedAlert?.id === alert.id;
                const isAcknowledged = acknowledgedAlertIds.includes(alert.id);

                return (
                  <article
                    key={alert.id}
                    className={`rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-blue-500/40 bg-slate-900/85 shadow-[0_0_0_1px_rgba(59,130,246,0.25)]"
                        : "border-white/10 bg-slate-900/70 hover:border-white/15"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenIncident(alert.id)}
                      className="block w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {alert.title}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                            <MapPin className="h-3.5 w-3.5" />
                            {alert.location}
                          </p>
                        </div>

                        <StatusBadge value={alert.status} />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getSeverityBadgeClass(
                            alert.severity
                          )}`}
                        >
                          {alert.severity}
                        </span>

                        <span className="text-xs text-slate-500">{alert.time}</span>
                      </div>
                    </button>

                    {isAcknowledged ? (
                      <div className="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300">
                        Alert acknowledged by operator
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
                      >
                        Acknowledge
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenIncident(alert.id)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-slate-300 transition hover:text-white"
                      >
                        Open incident
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </PanelCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PanelCard
          title="Operational Health"
          subtitle="Current distribution of system readiness"
        >
          <div className="space-y-4">
            {[
              {
                label: "Online cameras",
                value: stats.online,
                total: stats.total,
                colorClass: "bg-emerald-400",
                onClick: () => setCameraFilter("online"),
              },
              {
                label: "Offline cameras",
                value: stats.offline,
                total: stats.total,
                colorClass: "bg-red-400",
                onClick: () => setCameraFilter("offline"),
              },
              {
                label: "Maintenance",
                value: stats.maintenance,
                total: stats.total,
                colorClass: "bg-amber-400",
                onClick: () => setCameraFilter("attention"),
              },
              {
                label: "Degraded",
                value: stats.degraded,
                total: stats.total,
                colorClass: "bg-orange-300",
                onClick: () => setCameraFilter("attention"),
              },
            ].map((item) => {
              const percent =
                item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className="block w-full space-y-2 rounded-2xl p-2 text-left transition hover:bg-white/[0.03]"
                >
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-medium text-white">
                      {item.value} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full ${item.colorClass}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </PanelCard>

        <PanelCard
          title="Response Priorities"
          subtitle="Selected camera and incident focus"
        >
          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Selected camera
                  </p>
                  {selectedCamera ? (
                    <>
                      <p className="mt-2 text-lg font-semibold text-slate-100">
                        {selectedCamera.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {selectedCamera.location}
                      </p>
                      <p
                        className={`mt-2 text-sm font-medium ${getCameraHealthTone(
                          selectedCamera.status
                        )}`}
                      >
                        {getSignalLabel(selectedCamera.status)} ·{" "}
                        {selectedCamera.streamLabel}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-slate-400">
                      No camera selected.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-400">
                  <MonitorPlay className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Selected alert
                  </p>
                  {selectedAlert ? (
                    <>
                      <p className="mt-2 text-lg font-semibold text-slate-100">
                        {selectedAlert.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {selectedAlert.location}
                      </p>
                      <p className={`mt-2 text-sm font-medium ${getSeverityClass(selectedAlert.severity)}`}>
                        {selectedAlert.severity} · {selectedAlert.time}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-slate-400">
                      No incident selected.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-red-500/10 p-3 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  if (selectedAlert) {
                    handleAcknowledgeAlert(selectedAlert.id);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-400"
              >
                <CheckCircle2 className="h-4 w-4" />
                Acknowledge selected
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedCamera) {
                    handleInspectCamera(selectedCamera.id);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                <Wrench className="h-4 w-4" />
                Inspect selected camera
              </button>

              <button
                type="button"
                onClick={() => setCameraFilter("offline")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                <XCircle className="h-4 w-4" />
                View offline cameras
              </button>

              <button
                type="button"
                onClick={handleRefreshWorkspace}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                <TimerReset className="h-4 w-4" />
                Refresh data
              </button>
            </div>
          </div>
        </PanelCard>
      </section>

      {dashboardHasError ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleRefreshWorkspace}
            className="secondary-button"
          >
            Retry dashboard data
          </button>
        </div>
      ) : null}
    </div>
  );
}