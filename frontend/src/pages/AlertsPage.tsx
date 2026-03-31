import { useAlerts } from "../hooks/useAlerts";
import PanelCard from "../components/ui/PanelCard";
import StatusBadge from "../components/ui/StatusBadge";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";

export default function AlertsPage() {
  const { alerts, loading, error } = useAlerts();

  return (
    <div className="space-y-6">
      <PanelCard
        title="Alert Queue"
        subtitle="Prioritized system events and incident review"
      >
        {loading ? (
          <LoadingState label="Loading alerts..." />
        ) : error ? (
          <EmptyState title="Unable to load alerts" message={error} />
        ) : !alerts?.length ? (
          <EmptyState
            title="No alerts available"
            message="No alerts were returned by the backend."
          />
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <article
                key={alert.id}
                className="rounded-3xl border border-white/10 bg-slate-950/30 p-5 transition hover:border-white/15 hover:bg-slate-900/40"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">
                        {alert.title}
                      </h3>
                      <StatusBadge
                        value={alert.severity}
                        severity={alert.severity}
                      />
                      <StatusBadge value={alert.status} />
                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                      {alert.location} • {alert.time} • Alert ID #{alert.id}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:shrink-0">
                    <button
                      type="button"
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                    >
                      Acknowledge
                    </button>

                    <button
                      type="button"
                      className="rounded-2xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
                    >
                      Open incident
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