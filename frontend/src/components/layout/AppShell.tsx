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
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/cameras", label: "Cameras", icon: Camera },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white antialiased">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-800/80 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-600/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold tracking-tight text-white">
                  Secante
                </h1>
                <p className="text-sm text-slate-400">Security Control Panel</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Platform
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-200">
                    Monitor sites, alerts, and camera health in one place
                  </p>
                </div>
                <Activity className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              </div>
            </div>
          </div>

          <nav className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition",
                          isActive
                            ? "bg-white/10"
                            : "bg-slate-800/40 group-hover:bg-slate-700/70",
                        ].join(" ")}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="flex items-center justify-end border-b border-slate-800/80 bg-slate-950/70 px-6 py-4 backdrop-blur-xl lg:px-8">
            <div className="inline-flex w-fit items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
              System Online
            </div>
          </div>

          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}