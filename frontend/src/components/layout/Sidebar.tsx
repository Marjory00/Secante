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
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cameras", label: "Cameras", icon: Camera },
  { to: "/alerts", label: "Alerts", icon: Siren },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800/80 bg-slate-950/80 px-4 py-6 backdrop-blur-xl">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3 shadow-[0_0_30px_rgba(59,130,246,0.12)]">
            <ShieldCheck className="h-6 w-6 text-blue-400" />
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-white">
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

      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white",
              ].join(" ")
            }
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 transition group-hover:bg-white/10">
                <Icon className="h-5 w-5" />
              </div>
              <span>{label}</span>
            </div>

            <ChevronRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">
            System status
          </p>
        </div>

        <p className="mt-3 text-2xl font-semibold text-emerald-400">Secure</p>
        <p className="mt-1 text-sm leading-6 text-slate-300">
          Core services are online and event ingestion is healthy.
        </p>
      </div>

      <div className="mt-auto px-2 pt-6">
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