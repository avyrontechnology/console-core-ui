"use client";

import type { NotificationPreference } from "@/types/notification";

export function PreferenceEditor({
  preferences,
  onSave,
  isSaving,
  error,
}: {
  preferences: NotificationPreference[];
  onSave: (preferences: NotificationPreference[]) => Promise<void>;
  isSaving: boolean;
  error: string | null;
}) {
  const toggle = (index: number) => {
    const next: NotificationPreference[] = preferences.map((p, i) =>
      i === index ? { ...p, state: p.state === "enabled" ? "disabled" : "enabled" } : p,
    );
    void onSave(next);
  };

  if (preferences.length === 0) {
    return <p className="text-sm text-gray-500">No preferences configured</p>;
  }

  return (
    <div className="space-y-3">
      <ul className="divide-y rounded border">
        {preferences.map((pref, index) => (
          <li
            key={`${pref.source}-${pref.scope ?? "default"}`}
            className="flex items-center justify-between px-3 py-2"
          >
            <span className="text-sm">
              {pref.source}
              {pref.scope ? ` · ${pref.scope}` : ""}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={pref.state === "enabled"}
              aria-label={`${pref.source} ${pref.scope ?? "default"} notifications`}
              disabled={isSaving}
              onClick={() => toggle(index)}
              className={`rounded px-3 py-1 text-sm ${
                pref.state === "enabled" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              {pref.state === "enabled" ? "Enabled" : "Disabled"}
            </button>
          </li>
        ))}
      </ul>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
