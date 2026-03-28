import { Bell, LogOut, Search, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

export default function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-300/80">
            Secante
          </p>
          <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold text-white">
            <Shield className="h-6 w-6 text-blue-400" />
            Security Control Panel
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex min-w-65 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search cameras, alerts, incidents..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </label>

          <button className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
            <Bell className="h-5 w-5 text-slate-200" />
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}