import { Bell, LogOut, Search, Shield, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

export default function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        
        {/* LEFT: TITLE */}
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-400/80">
            Secante Platform
          </p>

          <h1 className="font-display mt-1 flex items-center gap-3 text-3xl font-semibold tracking-tight text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-600/10">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            Security Control Panel
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Real-time monitoring for sites, cameras, and incident response
          </p>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

          {/* SEARCH */}
          <label className="group flex min-w-70 items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-slate-300 transition focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20">
            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400" />
            <input
              type="text"
              placeholder="Search cameras, alerts, incidents..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </label>

          {/* STATUS */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 sm:flex">
            <Activity className="h-3.5 w-3.5" />
            System Healthy
          </div>

          {/* NOTIFICATIONS */}
          <button className="relative inline-flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/70 p-3 transition hover:bg-slate-800">
            <Bell className="h-5 w-5 text-slate-200" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}