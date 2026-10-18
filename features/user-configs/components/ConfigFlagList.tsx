"use client";

import { USER_CONFIG_KEYS, type UserConfigFlags } from "@/types/user-config";

function humanize(key: string): string {
  return key
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ConfigFlagList({
  flags,
  onToggle,
  isSaving,
}: {
  flags: Partial<UserConfigFlags>;
  onToggle: (key: keyof UserConfigFlags, value: boolean) => void;
  isSaving: boolean;
}) {
  return (
    <ul className="divide-y rounded border">
      {USER_CONFIG_KEYS.map((key) => (
        <li key={key} className="flex items-center justify-between px-3 py-2">
          <label className="text-sm" htmlFor={`flag-${key}`}>
            {humanize(key)}
          </label>
          <input
            id={`flag-${key}`}
            type="checkbox"
            checked={Boolean(flags[key])}
            disabled={isSaving}
            onChange={(e) => onToggle(key, e.target.checked)}
          />
        </li>
      ))}
    </ul>
  );
}
