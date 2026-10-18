"use client";

import type { HomepageDetails } from "@/types/dashboard";

function formatDate(value?: string | number | null): string {
  if (!value) return "—";
  const date = typeof value === "number" ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

export function PartnerOverview({ details }: { details: HomepageDetails }) {
  const { user_info: user, partner_info: partner, services_info: services } = details;
  const subscriptions = Object.entries(partner.subscription_status ?? {});

  return (
    <div className="space-y-4">
      <div className="rounded border p-4">
        <h2 className="font-medium">{partner.partner_name || "Partner"}</h2>
        <p className="text-sm text-slate-500">
          {user.name} {user.designation ? `· ${user.designation}` : ""} · {user.email}
        </p>
        {partner.subscription_mode && (
          <p className="mt-1 text-sm">Mode: {partner.subscription_mode}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded border p-4">
          <p className="text-sm text-slate-500">Talko</p>
          <p className="font-medium">{services.is_talko_enabled ? "Enabled" : "Disabled"}</p>
        </div>
        <div className="rounded border p-4">
          <p className="text-sm text-slate-500">ObotaAI</p>
          <p className="font-medium">{services.is_obotaai_enabled ? "Enabled" : "Disabled"}</p>
        </div>
        <div className="rounded border p-4">
          <p className="text-sm text-slate-500">Add number</p>
          <p className="font-medium">{services.is_add_number_enabled ? "Enabled" : "Disabled"}</p>
        </div>
      </div>

      {subscriptions.length > 0 && (
        <div className="rounded border p-4">
          <h3 className="mb-2 font-medium">Subscriptions</h3>
          <div className="space-y-1 text-sm">
            {subscriptions.map(([service, info]) => (
              <p key={service}>
                {service}: {info.status} ({formatDate(info.entitlement_start_date)} →{" "}
                {formatDate(info.entitlement_end_date)})
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
