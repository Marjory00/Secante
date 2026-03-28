import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  Shield,
  LayoutDashboard,
  Camera,
  Bell,
  Settings,
  Activity,
} from "lucide-react";

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cameras", label: "Cameras", icon: Camera },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white antialiased">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-slate-800/80 bg-slate-900/80 backdrop-blur-xl">
          <div className="border-b border-slate-800/80 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-600/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>

              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                  Secante
                </h1>
                <p className="text-sm text-slate-400">
                  Security Control Panel
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Platform
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-200">
                    Monitor sites, alerts, and camera health in one place
                  </p>
                </div>
                <Activity className="mt-0.5 h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </div>

          <nav className="space-y-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white",
                    ].join(" ")
                  }
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      "group-hover:bg-slate-700/70"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="border-b border-slate-800/80 bg-slate-950/70 px-8 py-5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-blue-400">
                  Development Environment
                </p>
                <h2 className="font-display mt-1 text-3xl font-semibold tracking-tight text-white">
                  Real-time Monitoring Workspace
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Login removed for local testing and interface development
                </p>
              </div>

              <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
                System Online
              </div>
            </div>
          </header>

          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}