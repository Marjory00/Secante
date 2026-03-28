import PanelCard from "../components/ui/PanelCard";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PanelCard
        title="System Settings"
        subtitle="Basic frontend placeholders until backend integration is ready"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
            <h3 className="text-lg font-semibold text-white">Notification Rules</h3>
            <p className="mt-2 text-sm text-slate-400">
              Configure alert routing, email dispatch, SMS escalation, and incident thresholds.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
            <h3 className="text-lg font-semibold text-white">User Access</h3>
            <p className="mt-2 text-sm text-slate-400">
              Assign operators, admins, supervisors, and viewer-only accounts.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
            <h3 className="text-lg font-semibold text-white">Camera Integrations</h3>
            <p className="mt-2 text-sm text-slate-400">
              Connect RTSP sources, ONVIF-compatible devices, and site-specific endpoints.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
            <h3 className="text-lg font-semibold text-white">Audit Logs</h3>
            <p className="mt-2 text-sm text-slate-400">
              Review operator actions, alert acknowledgements, and configuration updates.
            </p>
          </div>
        </div>
      </PanelCard>
    </div>
  );
}