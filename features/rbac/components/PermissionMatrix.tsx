"use client";

import type { PermissionMatrix } from "@/types/rbac";

/**
 * Single permission toggle-matrix for the whole app. Replaces the
 * copy-pasted Permission/Rbac matrices: one component, driven by data.
 *
 * `grants` maps slug -> granted. Entries missing from `grants` fall back
 * to the matrix's `is_default`. Every toggle reports up; saving is the
 * parent's job (it knows partner_id + role_id).
 */
export function PermissionMatrix({
  matrix,
  grants,
  onToggle,
  disabled = false,
}: {
  matrix: PermissionMatrix;
  grants: Record<string, boolean>;
  onToggle: (slug: string, granted: boolean) => void;
  disabled?: boolean;
}) {
  const roles = Object.keys(matrix);
  if (roles.length === 0) {
    return <p className="py-8 text-center text-gray-500">No permissions found</p>;
  }
  return (
    <div className="space-y-6">
      {roles.map((roleName) => (
        <section key={roleName} className="rounded border">
          <h3 className="border-b bg-gray-50 px-4 py-2 font-medium">{roleName}</h3>
          <div className="space-y-4 p-4">
            {Object.entries(matrix[roleName]).map(([category, perms]) => (
              <div key={category}>
                <h4 className="mb-2 text-sm font-medium text-gray-600">{category}</h4>
                <ul className="space-y-1">
                  {Object.entries(perms).map(([slug, perm]) => {
                    const granted = grants[slug] ?? perm.is_default;
                    return (
                      <li key={slug}>
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={granted}
                            disabled={disabled}
                            onChange={() => onToggle(slug, !granted)}
                          />
                          <span className="font-mono text-xs">{slug}</span>
                          {perm.display_text && (
                            <span className="text-gray-500">— {perm.display_text}</span>
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
