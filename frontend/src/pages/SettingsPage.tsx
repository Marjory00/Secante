import { useMemo, useState } from "react";
import {
  Bell,
  Users,
  Camera,
  FileText,
  ChevronDown,
  ChevronUp,
  Save,
  ShieldCheck,
  Mail,
  Smartphone,
  Radio,
} from "lucide-react";

type SettingsSectionKey =
  | "notifications"
  | "access"
  | "integrations"
  | "audit";

type NotificationSettings = {
  emailAlerts: boolean;
  smsEscalation: boolean;
  pushNotifications: boolean;
  criticalOnly: boolean;
  escalationDelay: string;
  incidentThreshold: string;
};

type AccessSettings = {
  defaultRole: string;
  mfaRequired: boolean;
  sessionTimeout: string;
  allowViewerExports: boolean;
};

type IntegrationSettings = {
  rtspEnabled: boolean;
  onvifEnabled: boolean;
  autoDiscovery: boolean;
  endpointUrl: string;
};

type AuditSettings = {
  retentionDays: string;
  logExportsEnabled: boolean;
  operatorTrackingEnabled: boolean;
};

const sectionMeta = [
  {
    key: "notifications" as const,
    title: "Notification Rules",
    description:
      "Configure alert routing, email dispatch, SMS escalation, and incident thresholds.",
    icon: Bell,
  },
  {
    key: "access" as const,
    title: "User Access",
    description:
      "Assign operators, admins, supervisors, and viewer-only permissions.",
    icon: Users,
  },
  {
    key: "integrations" as const,
    title: "Camera Integrations",
    description:
      "Connect RTSP sources, ONVIF-compatible devices, and site-specific endpoints.",
    icon: Camera,
  },
  {
    key: "audit" as const,
    title: "Audit Logs",
    description:
      "Review operator actions, alert acknowledgements, and configuration history.",
    icon: FileText,
  },
];

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/3 p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        {description ? (
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`relative mt-1 inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition ${
          checked
            ? "border-blue-400/50 bg-blue-500"
            : "border-slate-700 bg-slate-800"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-200">{label}</label>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [openSection, setOpenSection] =
    useState<SettingsSectionKey>("notifications");

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailAlerts: true,
      smsEscalation: true,
      pushNotifications: false,
      criticalOnly: false,
      escalationDelay: "5",
      incidentThreshold: "3",
    });

  const [accessSettings, setAccessSettings] = useState<AccessSettings>({
    defaultRole: "viewer",
    mfaRequired: true,
    sessionTimeout: "30",
    allowViewerExports: false,
  });

  const [integrationSettings, setIntegrationSettings] =
    useState<IntegrationSettings>({
      rtspEnabled: true,
      onvifEnabled: true,
      autoDiscovery: false,
      endpointUrl: "rtsp://security-gateway.local/stream",
    });

  const [auditSettings, setAuditSettings] = useState<AuditSettings>({
    retentionDays: "90",
    logExportsEnabled: true,
    operatorTrackingEnabled: true,
  });

  const statusText = useMemo(() => {
    switch (openSection) {
      case "notifications":
        return "Notification routing ready for review";
      case "access":
        return "Access controls ready for update";
      case "integrations":
        return "Device integration settings available";
      case "audit":
        return "Audit policies ready for adjustment";
      default:
        return "Settings ready";
    }
  }, [openSection]);

  function handleSave(section: SettingsSectionKey) {
    console.log("Saving section:", section, {
      notificationSettings,
      accessSettings,
      integrationSettings,
      auditSettings,
    });

    alert(`Saved ${section} settings`);
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/40 shadow-[0_20px_80px_rgba(15,23,42,0.35)]">
        <div className="border-b border-slate-800/80 px-6 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Configuration
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                System Settings
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Configure monitoring rules, permissions, integrations, and audit
                policies from one secure workspace.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              {statusText}
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-3">
            {sectionMeta.map((section) => {
              const Icon = section.icon;
              const isOpen = openSection === section.key;

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setOpenSection(section.key)}
                  className={`w-full rounded-3xl border p-5 text-left transition ${
                    isOpen
                      ? "border-blue-500/30 bg-blue-500/10 shadow-[0_10px_35px_rgba(37,99,235,0.18)]"
                      : "border-white/10 bg-slate-950/30 hover:border-white/15 hover:bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                        isOpen
                          ? "border-blue-500/30 bg-blue-500/10"
                          : "border-slate-800 bg-slate-900/70"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isOpen ? "text-blue-400" : "text-slate-300"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-base font-semibold text-white">
                            {section.title}
                          </h2>
                          <p className="mt-1 text-sm text-slate-400">
                            {section.description}
                          </p>
                        </div>

                        {isOpen ? (
                          <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                        ) : (
                          <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="min-w-0 rounded-3xl border border-white/10 bg-slate-950/30 p-6">
            {openSection === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Notification Rules
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Define how operators are notified and when incidents are escalated.
                  </p>
                </div>

                <div className="grid gap-4">
                  <Toggle
                    checked={notificationSettings.emailAlerts}
                    onChange={(value) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        emailAlerts: value,
                      }))
                    }
                    label="Email alerts"
                    description="Send event notifications to assigned operator inboxes."
                  />

                  <Toggle
                    checked={notificationSettings.smsEscalation}
                    onChange={(value) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        smsEscalation: value,
                      }))
                    }
                    label="SMS escalation"
                    description="Escalate unresolved alerts by text message."
                  />

                  <Toggle
                    checked={notificationSettings.pushNotifications}
                    onChange={(value) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        pushNotifications: value,
                      }))
                    }
                    label="Push notifications"
                    description="Deliver browser or device push alerts to active operators."
                  />

                  <Toggle
                    checked={notificationSettings.criticalOnly}
                    onChange={(value) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        criticalOnly: value,
                      }))
                    }
                    label="Critical alerts only"
                    description="Limit outbound escalation to critical events."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Escalation delay (minutes)">
                    <select
                      value={notificationSettings.escalationDelay}
                      onChange={(event) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          escalationDelay: event.target.value,
                        }))
                      }
                      className="w-full px-4 py-3"
                    >
                      <option value="1">1 minute</option>
                      <option value="5">5 minutes</option>
                      <option value="10">10 minutes</option>
                      <option value="15">15 minutes</option>
                    </select>
                  </Field>

                  <Field label="Incident threshold">
                    <select
                      value={notificationSettings.incidentThreshold}
                      onChange={(event) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          incidentThreshold: event.target.value,
                        }))
                      }
                      className="w-full px-4 py-3"
                    >
                      <option value="1">1 event</option>
                      <option value="3">3 events</option>
                      <option value="5">5 events</option>
                      <option value="10">10 events</option>
                    </select>
                  </Field>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleSave("notifications")}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
                  >
                    <Save className="h-4 w-4" />
                    Save notification rules
                  </button>

                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    <Mail className="h-4 w-4 text-slate-400" />
                    Email and SMS routing available
                  </div>
                </div>
              </div>
            )}

            {openSection === "access" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    User Access
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Control user roles, session policies, and security enforcement.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Default role">
                    <select
                      value={accessSettings.defaultRole}
                      onChange={(event) =>
                        setAccessSettings((prev) => ({
                          ...prev,
                          defaultRole: event.target.value,
                        }))
                      }
                      className="w-full px-4 py-3"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="operator">Operator</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </Field>

                  <Field label="Session timeout">
                    <select
                      value={accessSettings.sessionTimeout}
                      onChange={(event) =>
                        setAccessSettings((prev) => ({
                          ...prev,
                          sessionTimeout: event.target.value,
                        }))
                      }
                      className="w-full px-4 py-3"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </Field>
                </div>

                <div className="grid gap-4">
                  <Toggle
                    checked={accessSettings.mfaRequired}
                    onChange={(value) =>
                      setAccessSettings((prev) => ({
                        ...prev,
                        mfaRequired: value,
                      }))
                    }
                    label="Require MFA"
                    description="Enforce multi-factor authentication for all privileged users."
                  />

                  <Toggle
                    checked={accessSettings.allowViewerExports}
                    onChange={(value) =>
                      setAccessSettings((prev) => ({
                        ...prev,
                        allowViewerExports: value,
                      }))
                    }
                    label="Allow viewer exports"
                    description="Permit read-only users to export permitted logs and reports."
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleSave("access")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
                >
                  <Save className="h-4 w-4" />
                  Save access settings
                </button>
              </div>
            )}

            {openSection === "integrations" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Camera Integrations
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Configure source protocols, endpoint discovery, and stream connectivity.
                  </p>
                </div>

                <div className="grid gap-4">
                  <Toggle
                    checked={integrationSettings.rtspEnabled}
                    onChange={(value) =>
                      setIntegrationSettings((prev) => ({
                        ...prev,
                        rtspEnabled: value,
                      }))
                    }
                    label="Enable RTSP sources"
                    description="Allow direct RTSP stream registration for supported devices."
                  />

                  <Toggle
                    checked={integrationSettings.onvifEnabled}
                    onChange={(value) =>
                      setIntegrationSettings((prev) => ({
                        ...prev,
                        onvifEnabled: value,
                      }))
                    }
                    label="Enable ONVIF devices"
                    description="Detect and manage compatible cameras using ONVIF."
                  />

                  <Toggle
                    checked={integrationSettings.autoDiscovery}
                    onChange={(value) =>
                      setIntegrationSettings((prev) => ({
                        ...prev,
                        autoDiscovery: value,
                      }))
                    }
                    label="Auto discovery"
                    description="Automatically discover devices on approved network ranges."
                  />
                </div>

                <Field label="Primary endpoint URL">
                  <input
                    type="text"
                    value={integrationSettings.endpointUrl}
                    onChange={(event) =>
                      setIntegrationSettings((prev) => ({
                        ...prev,
                        endpointUrl: event.target.value,
                      }))
                    }
                    placeholder="rtsp://security-gateway.local/stream"
                    className="w-full px-4 py-3"
                  />
                </Field>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleSave("integrations")}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
                  >
                    <Save className="h-4 w-4" />
                    Save integrations
                  </button>

                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    <Radio className="h-4 w-4 text-slate-400" />
                    Endpoint connectivity configurable
                  </div>
                </div>
              </div>
            )}

            {openSection === "audit" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Audit Logs
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Set retention and visibility rules for system activity history.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Retention period">
                    <select
                      value={auditSettings.retentionDays}
                      onChange={(event) =>
                        setAuditSettings((prev) => ({
                          ...prev,
                          retentionDays: event.target.value,
                        }))
                      }
                      className="w-full px-4 py-3"
                    >
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="365">365 days</option>
                    </select>
                  </Field>
                </div>

                <div className="grid gap-4">
                  <Toggle
                    checked={auditSettings.logExportsEnabled}
                    onChange={(value) =>
                      setAuditSettings((prev) => ({
                        ...prev,
                        logExportsEnabled: value,
                      }))
                    }
                    label="Enable log exports"
                    description="Allow operators to export approved activity records."
                  />

                  <Toggle
                    checked={auditSettings.operatorTrackingEnabled}
                    onChange={(value) =>
                      setAuditSettings((prev) => ({
                        ...prev,
                        operatorTrackingEnabled: value,
                      }))
                    }
                    label="Track operator actions"
                    description="Maintain a detailed history of acknowledgements and updates."
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleSave("audit")}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
                  >
                    <Save className="h-4 w-4" />
                    Save audit settings
                  </button>

                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    <Smartphone className="h-4 w-4 text-slate-400" />
                    Retention policy ready
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}