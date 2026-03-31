import PanelCard from "../components/ui/PanelCard";

const settingsSections = [
  {
    title: "Notification Rules",
    description:
      "Configure alert routing, email dispatch, SMS escalation, and incident thresholds.",
  },
  {
    title: "User Access",
    description:
      "Assign operators, admins, supervisors, and viewer-only accounts.",
  },
  {
    title: "Camera Integrations",
    description:
      "Connect RTSP sources, ONVIF-compatible devices, and site-specific endpoints.",
  },
  {
    title: "Audit Logs",
    description:
      "Review operator actions, alert acknowledgements, and configuration updates.",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PanelCard
        title="System Settings"
        subtitle="Basic frontend placeholders until backend integration is ready"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {settingsSections.map((section) => (
            <article
              key={section.title}
              className="min-w-0 rounded-3xl border border-white/10 bg-slate-950/30 p-5 transition hover:border-white/15 hover:bg-slate-900/40"
            >
              <h3 className="text-lg font-semibold text-white">
                {section.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {section.description}
              </p>
            </article>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}