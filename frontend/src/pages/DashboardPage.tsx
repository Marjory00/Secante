import { Activity, ArrowUpRight, ShieldAlert, Video } from "lucide-react";
import { cameras, metrics } from "../data/mockData";
import RecentAlertsTable from "../components/tables/RecentAlertsTable";
import PanelCard from "../components/ui/PanelCard";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-linear-to-br from-blue-600/20 via-slate-900/40 to-slate-900/50 p-6 shadow-2xl shadow-blue-950/20">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300/80">
              Live overview
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Monitor sites, alerts, and camera health in one place
            </h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Real-time event monitoring for facilities, entrances, internal zones,
              and operational response teams.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-400">
            View incident queue
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            helper={item.helper}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <PanelCard
          title="Recent Alerts"
          subtitle="Most recent activity requiring review or follow-up"
          action={
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 ring-1 ring-red-400/20">
              <ShieldAlert className="h-3.5 w-3.5" />
              Priority queue
            </div>
          }
        >
          <RecentAlertsTable />
        </PanelCard>

        <PanelCard
          title="Camera Health"
          subtitle="Quick visibility into stream status"
          action={
            <div className="inline-flex items-center gap-2 text-sm text-slate-400">
              <Video className="h-4 w-4" />
              48 total feeds
            </div>
          }
        >
          <div className="space-y-3">
            {cameras.map((camera) => (
              <div
                key={camera.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/30 p-4"
              >
                <div>
                  <p className="font-medium text-white">{camera.name}</p>
                  <p className="text-sm text-slate-400">{camera.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <StatusBadge value={camera.status} />
                </div>
              </div>
            ))}
          </div>
        </PanelCard>
      </section>
    </div>
  );
}