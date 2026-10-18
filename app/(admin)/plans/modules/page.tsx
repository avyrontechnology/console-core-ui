"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { usePlanModules } from "@/features/plans/hooks";

function ModulesContent() {
  const { data: modules, isLoading, error } = usePlanModules();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Modules</h1>
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-sm text-critical">{error}</p>}
      {!isLoading &&
        !error &&
        Object.entries(modules ?? {}).map(([service, mods]) => (
          <section key={service} className="rounded border">
            <h2 className="border-b bg-slate-50 px-4 py-2 font-medium">{service}</h2>
            <ul className="space-y-1 p-4 text-sm">
              {mods.map((mod) => (
                <li key={mod} className="font-mono text-xs">
                  {mod}
                </li>
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}

export default function ModulesPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_modules">
      <ModulesContent />
    </ProtectedRoute>
  );
}
