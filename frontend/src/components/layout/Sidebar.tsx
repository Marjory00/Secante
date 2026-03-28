import { Camera, LayoutDashboard, Settings, Siren, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cameras", label: "Cameras", icon: Camera },
  { to: "/alerts", label: "Alerts", icon: Siren },
  { to: "/settings", label: "Settings", icon: Settings }
];

export default function Sidebar() {
  return (
    <aside className="border-r border-white/10 bg-slate-950/60 px-4 py-6 backdrop-blur-xl">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="rounded-2xl bg-blue-500/15 p-3 ring-1 ring-blue-400/20">
          <ShieldCheck className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Secante</h2>
          <p className="text-sm text-slate-400">Monitoring Suite</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
          System status
        </p>
        <p className="mt-3 text-2xl font-semibold text-emerald-400">Secure</p>
        <p className="mt-1 text-sm text-slate-400">
          Core services are online and event ingestion is healthy.
        </p>
      </div>
    </aside>
  );
}