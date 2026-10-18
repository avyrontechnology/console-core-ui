"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { TextField } from "@/components/ui/TextField";
import { ConfigFlagList } from "@/features/user-configs/components/ConfigFlagList";
import { useUserConfigs } from "@/features/user-configs/hooks";
import type { UserConfigFlags } from "@/types/user-config";

function UserConfigsContent() {
  const [userId, setUserId] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const { data, flags, isLoading, isSaving, error, save, refresh } = useUserConfigs(
    userId || undefined,
  );

  const apply = async (next: Partial<UserConfigFlags>) => {
    if (!partnerId || selectedUserIds.length === 0) return;
    await save(partnerId, selectedUserIds, next);
    await refresh();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">User configs</h1>

      <div className="flex items-end gap-3">
        <TextField
          id="user-config-user-id"
          label="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="UUID"
        />
        <button
          type="button"
          onClick={() => void refresh()}
          className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          Load
        </button>
      </div>

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-sm text-critical">{error}</p>}
      {!isLoading && data && <p className="text-sm text-slate-600">{data.length} config entries</p>}

      <div className="flex items-end gap-3">
        <TextField
          id="user-config-partner-id"
          label="Partner ID"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          placeholder="UUID"
        />
        <TextField
          id="user-config-target-ids"
          label="Target user IDs"
          value={selectedUserIds.join(",")}
          onChange={(e) =>
            setSelectedUserIds(
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          placeholder="uuid1,uuid2"
        />
      </div>

      <ConfigFlagList
        flags={flags}
        isSaving={isSaving}
        onToggle={(key, value) => void apply({ [key]: value })}
      />
    </div>
  );
}

export default function UserConfigsPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_user_configs_by_user_id">
      <UserConfigsContent />
    </ProtectedRoute>
  );
}
