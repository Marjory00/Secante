import { TriangleAlert } from "lucide-react";
import type { AlertItem } from "../../types/auth";
import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";

interface RecentAlertsTableProps {
  alerts: AlertItem[];
}

export default function RecentAlertsTable({
  alerts,
}: RecentAlertsTableProps) {
  if (!alerts?.length) {
    return (
      <EmptyState
        title="No alerts found"
        message="There are no recent alerts to display right now."
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/40 shadow-[0_20px_80px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-3 border-b border-slate-800 bg-slate-900/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Incident feed
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-white">
            Recent Alerts
          </h3>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300">
          <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
          <span>{alerts.length} active items</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-slate-900/40">
            <tr className="border-b border-slate-800">
              <th className="min-w-[240px] px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Alert
              </th>
              <th className="min-w-[160px] px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Location
              </th>
              <th className="min-w-[140px] px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Time
              </th>
              <th className="min-w-[130px] px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Severity
              </th>
              <th className="min-w-[130px] px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80">
            {alerts.map((alert, index) => (
              <tr
                key={alert.id}
                className="group bg-slate-950/20 transition hover:bg-slate-900/50"
              >
                <td className="px-5 py-4 align-top">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/10">
                      <TriangleAlert className="h-4 w-4 text-red-300" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {alert.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Alert ID: {alert.id} • Event #{index + 1}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 align-top text-sm text-slate-300">
                  {alert.location}
                </td>

                <td className="whitespace-nowrap px-5 py-4 align-top text-sm text-slate-400">
                  {alert.time}
                </td>

                <td className="px-5 py-4 align-top text-sm">
                  <StatusBadge
                    value={alert.severity}
                    severity={alert.severity}
                  />
                </td>

                <td className="px-5 py-4 align-top text-sm">
                  <StatusBadge value={alert.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}