import { useMemo, useState } from "react";
import {
  Play,
  Signal,
  Wrench,
  Search,
  RefreshCw,
  Filter,
  Shield,
  Video,
  AlertTriangle,
  Activity,
  MapPin,
  Eye,
} from "lucide-react";
import { useCameras } from "../hooks/useCameras";
import type { CameraStatus } from "../types/auth";
import PanelCard from "../components/ui/PanelCard";
import StatusBadge from "../components/ui/StatusBadge";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";

function getOverlayStatusDot(
  status: CameraStatus,
): "online" | "offline" | "warning" {
  if (status === "maintenance" || status === "degraded") {
    return "warning";
  }

  if (status === "offline") {
    return "offline";
  }

  return "online";
}

function getStatusLabel(status: CameraStatus) {
  switch (status) {
    case "online":
      return "Online";
    case "offline":
      return "Offline";
    case "maintenance":
      return "Maintenance";
    case "degraded":
      return "Degraded";
    default:
      return "Unknown";
  }
}

export default function CamerasPage() {
  const { cameras, loading, error, refetch } = useCameras();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CameraStatus>("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const hasCameras = (cameras?.length ?? 0) > 0;

  const locations = useMemo(() => {
    const uniqueLocations = Array.from(
      new Set((cameras ?? []).map((camera) => camera.location).filter(Boolean)),
    );
    return uniqueLocations.sort((a, b) => a.localeCompare(b));
  }, [cameras]);

  const filteredCameras = useMemo(() => {
    return (cameras ?? []).filter((camera) => {
      const matchesSearch =
        camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.streamLabel.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : camera.status === statusFilter;

      const matchesLocation =
        selectedLocation === "all"
          ? true
          : camera.location === selectedLocation;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [cameras, searchTerm, statusFilter, selectedLocation]);

  const summary = useMemo(() => {
    const source = cameras ?? [];

    return {
      total: source.length,
      online: source.filter((camera) => camera.status === "online").length,
      offline: source.filter((camera) => camera.status === "offline").length,
      maintenance: source.filter((camera) => camera.status === "maintenance")
        .length,
      degraded: source.filter((camera) => camera.status === "degraded").length,
    };
  }, [cameras]);

  const activeFiltersCount = [
    searchTerm.trim() !== "",
    statusFilter !== "all",
    selectedLocation !== "all",
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-[0_20px_50px_rgba(2,6,23,0.25)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Cameras</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {summary.total}
              </p>
            </div>
            <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-400">
              <Video className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-[0_20px_50px_rgba(2,6,23,0.25)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Online</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {summary.online}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
              <Shield className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-[0_20px_50px_rgba(2,6,23,0.25)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Offline</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {summary.offline}
              </p>
            </div>
            <div className="rounded-2xl bg-rose-500/10 p-3 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-[0_20px_50px_rgba(2,6,23,0.25)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Needs Attention</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {summary.maintenance + summary.degraded}
              </p>
            </div>
            <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      <PanelCard
        title="Camera Operations"
        subtitle="Search, filter, monitor, and inspect live camera endpoints"
      >
        <div className="space-y-5">
          <div className="grid gap-4 xl:grid-cols-[1.4fr_0.7fr_0.7fr_auto]">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by camera name, location, or stream label..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "all" | CameraStatus)
                }
                className="w-full bg-transparent text-sm text-white outline-none"
              >
                <option value="all" className="bg-slate-900">
                  All statuses
                </option>
                <option value="online" className="bg-slate-900">
                  Online
                </option>
                <option value="offline" className="bg-slate-900">
                  Offline
                </option>
                <option value="maintenance" className="bg-slate-900">
                  Maintenance
                </option>
                <option value="degraded" className="bg-slate-900">
                  Degraded
                </option>
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
              <MapPin className="h-4 w-4 text-slate-400" />
              <select
                value={selectedLocation}
                onChange={(event) => setSelectedLocation(event.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none"
              >
                <option value="all" className="bg-slate-900">
                  All locations
                </option>
                {locations.map((location) => (
                  <option
                    key={location}
                    value={location}
                    className="bg-slate-900"
                  >
                    {location}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm">
            <div className="flex flex-wrap items-center gap-2 text-slate-300">
              <span className="font-medium text-white">
                Showing {filteredCameras.length}
              </span>
              <span>of {summary.total} cameras</span>
              {activeFiltersCount > 0 ? (
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-300">
                  {activeFiltersCount} active filter
                  {activeFiltersCount > 1 ? "s" : ""}
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setSelectedLocation("all");
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
              >
                Clear filters
              </button>

              <button
                type="button"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
              >
                Export status
              </button>
            </div>
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Camera Grid"
        subtitle="Live camera endpoints and operational status"
      >
        {loading ? (
          <LoadingState label="Loading cameras..." />
        ) : error ? (
          <EmptyState title="Unable to load cameras" message={error} />
        ) : !hasCameras ? (
          <EmptyState
            title="No cameras available"
            message="No camera streams were returned by the backend."
          />
        ) : filteredCameras.length === 0 ? (
          <EmptyState
            title="No cameras match your filters"
            message="Try changing the search term, status filter, or selected location."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {filteredCameras.map((camera) => (
              <article
                key={camera.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/30 shadow-[0_20px_50px_rgba(2,6,23,0.35)] transition hover:border-white/15 hover:bg-slate-900/40"
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

                  <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-md">
                    <span
                      className={`status-dot ${getOverlayStatusDot(camera.status)}`}
                      aria-hidden="true"
                    />
                    <span className="capitalize">{camera.status}</span>
                  </div>

                  <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-md">
                    <Eye className="h-3.5 w-3.5 text-blue-300" />
                    Live view
                  </div>

                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <button
                      type="button"
                      className="rounded-full border border-white/10 bg-slate-950/70 p-4 text-slate-100 shadow-lg backdrop-blur-md transition hover:bg-slate-900/80"
                      aria-label={`Open feed for ${camera.name}`}
                    >
                      <Play className="h-8 w-8 text-blue-400" />
                    </button>
                  </div>

                  <div className="feed-label">{camera.streamLabel}</div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-white">
                        {camera.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {camera.location}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <StatusBadge value={camera.status} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/3 p-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Stream
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-slate-200">
                        {camera.streamLabel}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Status
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-200">
                        {getStatusLabel(camera.status)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
                      aria-label={`Open feed for ${camera.name}`}
                    >
                      <Signal className="h-4 w-4" />
                      Open feed
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                      aria-label={`Inspect ${camera.name}`}
                    >
                      <Wrench className="h-4 w-4" />
                      Inspect
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                      aria-label={`View analytics for ${camera.name}`}
                    >
                      <Activity className="h-4 w-4" />
                      Analytics
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </PanelCard>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <PanelCard
          title="Coverage by Status"
          subtitle="Operational distribution across the current fleet"
        >
          <div className="space-y-4">
            {[
              {
                label: "Online",
                value: summary.online,
                total: summary.total,
                barClass: "bg-emerald-400",
              },
              {
                label: "Offline",
                value: summary.offline,
                total: summary.total,
                barClass: "bg-rose-400",
              },
              {
                label: "Maintenance",
                value: summary.maintenance,
                total: summary.total,
                barClass: "bg-amber-400",
              },
              {
                label: "Degraded",
                value: summary.degraded,
                total: summary.total,
                barClass: "bg-yellow-300",
              },
            ].map((item) => {
              const percent =
                item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;

              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-medium text-white">
                      {item.value} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full ${item.barClass}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </PanelCard>

        <PanelCard
          title="Monitoring Notes"
          subtitle="Quick operational guidance for camera operators"
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <p className="text-sm font-medium text-white">
                Review offline units first
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Prioritize cameras marked offline before inspecting degraded or
                maintenance units.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <p className="text-sm font-medium text-white">
                Verify stream labeling
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Make sure stream labels match real installation zones to prevent
                dispatch confusion.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <p className="text-sm font-medium text-white">
                Refresh after maintenance
              </p>
              <p className="mt-1 text-sm text-slate-400">
                After any inspection or reset, refresh the view to confirm the
                camera returns to a healthy state.
              </p>
            </div>
          </div>
        </PanelCard>
      </section>

      {!loading && error ? (
        <div className="flex justify-start sm:justify-end">
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            Retry camera load
          </button>
        </div>
      ) : null}
    </div>
  );
}