import type { AlertItem } from "../../types/auth";
import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";

interface RecentAlertsTableProps {
  alerts: AlertItem[];
}

export default function RecentAlertsTable({ alerts }: RecentAlertsTableProps) {
  if (!alerts.length) {
    return (
      <EmptyState
        title="No alerts found"
        message="There are no recent alerts to display right now."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Alert
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-slate-950/20">
            {alerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-white/3">
                <td className="px-4 py-4 text-sm font-medium text-white">{alert.title}</td>
                <td className="px-4 py-4 text-sm text-slate-300">{alert.location}</td>
                <td className="px-4 py-4 text-sm text-slate-400">{alert.time}</td>
                <td className="px-4 py-4 text-sm">
                  <StatusBadge value={alert.severity} severity={alert.severity} />
                </td>
                <td className="px-4 py-4 text-sm">
                  <StatusBadge value={alert.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}