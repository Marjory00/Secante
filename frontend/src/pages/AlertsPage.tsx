import { useMemo, useState } from "react";
import type { ElementType } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  Filter,
  Radar,
  RefreshCw,
  Search,
  ShieldAlert,
  Siren,
} from "lucide-react";
import { useAlerts } from "../hooks/useAlerts";
import PanelCard from "../components/ui/PanelCard";
import StatusBadge from "../components/ui/StatusBadge";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import type { AlertSeverity } from "../components/ui/StatusBadge";

type RawAlertItem = {
  id?: string | number;
  title?: string;
  severity?: string | AlertSeverity;
  status?: string;
  location?: string;
  time?: string;
  source?: string;
  assignee?: string;
  camera?: string;
  category?: string;
  description?: string;
};

type AlertItem = {
  id: string | number;
  title: string;
  severity: AlertSeverity;
  status: string;
  location: string;
  time: string;
  source: string;
  assignee: string;
  camera: string;
  category: string;
  description: string;
};

type StatCardProps = {
  label: string;
  value: number;
  icon: ElementType;
  tone?: "default" | "danger" | "warning" | "success";
};

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: StatCardProps) {
  const toneClasses = {
    default: "border-white/10 bg-slate-950/40 text-slate-200",
    danger: "border-red-500/20 bg-red-500/10 text-red-200",
    warning: "border-amber-500/20 bg-amber-500/10 text-amber-200",
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
  } as const;

  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm transition ${toneClasses[tone]}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function normalizeText(value?: string) {
  return String(value ?? "").trim().toLowerCase();
}

function toAlertSeverity(value?: string): AlertSeverity {
  const normalized = normalizeText(value);

  switch (normalized) {
    case "critical":
      return "critical";
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    default:
      return "low";
  }
}

function severityRank(severity: AlertSeverity) {
  if (severity === "critical") return 0;
  if (severity === "high") return 1;
  if (severity === "medium") return 2;
  return 3;
}

export default function AlertsPage() {
  const { alerts, loading, error } = useAlerts();

  const [query, setQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const errorMessage = error ? String(error) : "Something went wrong while loading alerts.";

  const safeAlerts = useMemo<AlertItem[]>(() => {
    if (!Array.isArray(alerts)) return [];

    return (alerts as RawAlertItem[]).map((alert, index) => ({
      id: alert?.id ?? `alert-${index}-${Math.random().toString(36).slice(2, 9)}`,
      title: alert?.title ?? "Untitled alert",
      severity: toAlertSeverity(alert?.severity),
      status: alert?.status ?? "pending",
      location: alert?.location ?? "Unknown location",
      time: alert?.time ?? "Unknown time",
      source: alert?.source ?? "System",
      assignee: alert?.assignee ?? "Unassigned",
      camera: alert?.camera ?? "N/A",
      category: alert?.category ?? "General",
      description:
        alert?.description ??
        "No additional incident description was provided by the backend.",
    }));
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...safeAlerts]
      .filter((alert) => {
        const matchesQuery =
          !normalizedQuery ||
          [
            alert.title,
            alert.location,
            alert.time,
            alert.status,
            alert.severity,
            alert.source,
            alert.assignee,
            alert.camera,
            alert.category,
            alert.description,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

        const matchesSeverity =
          severityFilter === "all" ||
          normalizeText(alert.severity) === severityFilter;

        const matchesStatus =
          statusFilter === "all" || normalizeText(alert.status) === statusFilter;

        return matchesQuery && matchesSeverity && matchesStatus;
      })
      .sort((a, b) => severityRank(a.severity) - severityRank(b.severity));
  }, [safeAlerts, query, severityFilter, statusFilter]);

  const metrics = useMemo(() => {
    const critical = safeAlerts.filter(
      (alert) => alert.severity === "critical",
    ).length;

    const high = safeAlerts.filter(
      (alert) => alert.severity === "high",
    ).length;

    const active = safeAlerts.filter((alert) => {
      const status = normalizeText(alert.status);
      return status === "open" || status === "active" || status === "pending";
    }).length;

    const resolved = safeAlerts.filter(
      (alert) => normalizeText(alert.status) === "resolved",
    ).length;

    return {
      total: safeAlerts.length,
      critical,
      high,
      active,
      resolved,
    };
  }, [safeAlerts]);

  const recentActivity = useMemo(() => {
    return filteredAlerts.slice(0, 5);
  }, [filteredAlerts]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Alerts"
          value={metrics.total}
          icon={Bell}
          tone="default"
        />
        <StatCard
          label="Critical"
          value={metrics.critical}
          icon={Siren}
          tone="danger"
        />
        <StatCard
          label="High Severity"
          value={metrics.high}
          icon={ShieldAlert}
          tone="warning"
        />
        <StatCard
          label="Resolved"
          value={metrics.resolved}
          icon={CheckCircle2}
          tone="success"
        />
      </section>

      <PanelCard
        title="Command Center"
        subtitle="Search, filter, and prioritize incident traffic"
      >
        <div className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[1.4fr,220px,220px,auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, location, source, assignee, camera..."
                className="w-full rounded-2xl border border-white/10 bg-slate-950/50 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
              />
            </label>

            <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/50 px-4">
              <Filter className="h-4 w-4 text-slate-500" />
              <select
                value={severityFilter}
                onChange={(event) => setSeverityFilter(event.target.value)}
                className="w-full bg-transparent py-3 text-sm text-slate-200 outline-none"
              >
                <option value="all" className="bg-slate-900">
                  All severities
                </option>
                <option value="critical" className="bg-slate-900">
                  Critical
                </option>
                <option value="high" className="bg-slate-900">
                  High
                </option>
                <option value="medium" className="bg-slate-900">
                  Medium
                </option>
                <option value="low" className="bg-slate-900">
                  Low
                </option>
              </select>
            </label>

            <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/50 px-4">
              <Clock3 className="h-4 w-4 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full bg-transparent py-3 text-sm text-slate-200 outline-none"
              >
                <option value="all" className="bg-slate-900">
                  All statuses
                </option>
                <option value="open" className="bg-slate-900">
                  Open
                </option>
                <option value="active" className="bg-slate-900">
                  Active
                </option>
                <option value="pending" className="bg-slate-900">
                  Pending
                </option>
                <option value="resolved" className="bg-slate-900">
                  Resolved
                </option>
                <option value="dismissed" className="bg-slate-900">
                  Dismissed
                </option>
              </select>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSeverityFilter("all");
                  setStatusFilter("all");
                }}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                Reset
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </PanelCard>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.7fr)_380px]">
        <PanelCard
          title="Alert Queue"
          subtitle="Prioritized system events and incident review"
        >
          {loading ? (
            <LoadingState label="Loading alerts..." />
          ) : error ? (
            <EmptyState title="Unable to load alerts" message={errorMessage} />
          ) : safeAlerts.length === 0 ? (
            <EmptyState
              title="No alerts available"
              message="No alerts were returned by the backend."
            />
          ) : filteredAlerts.length === 0 ? (
            <EmptyState
              title="No matching alerts"
              message="Try changing the search text or filter values."
            />
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <article
                  key={alert.id}
                  className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 transition hover:border-white/15 hover:bg-slate-900/50"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-lg font-semibold text-white">
                            {alert.title}
                          </h3>

                          <StatusBadge
                            value={alert.severity}
                            severity={alert.severity}
                          />

                          <StatusBadge value={alert.status} />
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {alert.description}
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                              Location
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-200">
                              {alert.location}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                              Time
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-200">
                              {alert.time}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                              Source
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-200">
                              {alert.source}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                              Assignee
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-200">
                              {alert.assignee}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                          <span>Camera: {alert.camera}</span>
                          <span className="text-slate-600">•</span>
                          <span>Category: {alert.category}</span>
                          <span className="text-slate-600">•</span>
                          <span>Alert ID #{alert.id}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 xl:w-[250px] xl:flex-col">
                        <button
                          type="button"
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                          aria-label={`Acknowledge alert ${alert.title}`}
                        >
                          Acknowledge
                        </button>

                        <button
                          type="button"
                          className="rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300/40"
                          aria-label={`Open incident for alert ${alert.title}`}
                        >
                          Open incident
                        </button>

                        <button
                          type="button"
                          className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-200 transition hover:bg-amber-500/15"
                          aria-label={`Escalate alert ${alert.title}`}
                        >
                          Escalate
                        </button>

                        <button
                          type="button"
                          className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/15"
                          aria-label={`Resolve alert ${alert.title}`}
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </PanelCard>

        <div className="space-y-6">
          <PanelCard
            title="Live Overview"
            subtitle="Operational pulse across active security events"
          >
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Active incidents
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {metrics.active}
                    </p>
                  </div>
                  <Radar className="h-5 w-5 text-blue-300" />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  System posture
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-2/3 rounded-full bg-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    Stable
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Recommended action
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Review unresolved critical and high-severity alerts, validate
                  camera feeds, and assign response ownership before escalation
                  windows expire.
                </p>
              </div>
            </div>
          </PanelCard>

          <PanelCard
            title="Recent Activity"
            subtitle="Most visible incidents in the current queue"
          >
            {recentActivity.length === 0 ? (
              <EmptyState
                title="No recent activity"
                message="Recent alert activity will appear here once alerts are available."
              />
            ) : (
              <div className="space-y-3">
                {recentActivity.map((alert) => (
                  <div
                    key={`recent-${alert.id}`}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-2xl border border-white/10 bg-white/5 p-2">
                        <AlertTriangle className="h-4 w-4 text-slate-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-white">
                            {alert.title}
                          </p>
                          <StatusBadge
                            value={alert.severity}
                            severity={alert.severity}
                          />
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          {alert.location} • {alert.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PanelCard>

          <PanelCard
            title="Escalation Checklist"
            subtitle="Recommended response workflow"
          >
            <div className="space-y-3">
              {[
                "Verify source integrity and replay event feed",
                "Confirm affected zone, device, or camera",
                "Assign operator or on-call responder",
                "Open incident ticket and log event timeline",
                "Escalate unresolved critical alerts to leadership",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}