import {
  Camera,
  LayoutDashboard,
  Settings,
  Siren,
  ShieldCheck,
  Activity,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/cameras", label: "Cameras", icon: Camera },
  { to: "/alerts", label: "Alerts", icon: Siren },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-slate-800/80 bg-slate-950/80 px-4 py-6 backdrop-blur-xl">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="flex shrink-0 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3 shadow-[0_0_30px_rgba(59,130,246,0.12)]">
            <ShieldCheck className="h-6 w-6 text-blue-400" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold tracking-tight text-white">
              Secante
            </h2>
            <p className="text-sm text-slate-400">Monitoring Suite</p>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Platform
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Monitor sites, alerts, and camera health in one place.
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <nav className="space-y-2">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition",
                        isActive
                          ? "bg-white/10"
                          : "bg-white/5 group-hover:bg-white/10",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="truncate">{label}</span>
                  </div>

                  <ChevronRight
                    className={[
                      "h-4 w-4 shrink-0 transition",
                      isActive
                        ? "translate-x-0 opacity-100"
                        : "translate-x-[-2px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                    ].join(" ")}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 shrink-0 text-emerald-400" />
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">
              System status
            </p>
          </div>

          <p className="mt-3 text-2xl font-semibold text-emerald-400">
            Secure
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-300">
            Core services are online and event ingestion is healthy.
          </p>
        </div>
      </div>

      <div className="px-2 pt-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Environment
          </p>
          <p className="mt-1 text-sm font-medium text-slate-200">
            Development Mode
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Login bypass enabled for local testing.
          </p>
        </div>
      </div>
    </aside>
  );
}