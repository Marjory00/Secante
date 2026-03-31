import { Bell, Users, Camera, FileText } from "lucide-react";

const settingsSections = [
  {
    title: "Notification Rules",
    description:
      "Configure alert routing, email dispatch, SMS escalation, and incident thresholds.",
    icon: Bell,
  },
  {
    title: "User Access",
    description:
      "Assign operators, admins, supervisors, and viewer-only accounts.",
    icon: Users,
  },
  {
    title: "Camera Integrations",
    description:
      "Connect RTSP sources, ONVIF-compatible devices, and site-specific endpoints.",
    icon: Camera,
  },
  {
    title: "Audit Logs",
    description:
      "Review operator actions, alert acknowledgements, and configuration updates.",
    icon: FileText,
  },
];

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.35)]">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Configuration
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
            System Settings
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Basic frontend placeholders until backend integration is ready.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {settingsSections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.title}
                className="min-w-0 rounded-3xl border border-white/10 bg-slate-950/30 p-5 transition hover:border-white/15 hover:bg-slate-900/40"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/70">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-white">
                      {section.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {section.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}