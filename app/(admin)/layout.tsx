import type { ReactNode } from "react";

import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-end gap-3 border-b border-line bg-surface px-6 py-3">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
          <span className="text-sm text-slate-500">Production</span>
          <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-200">
            Console
          </span>
        </div>
        <main className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
