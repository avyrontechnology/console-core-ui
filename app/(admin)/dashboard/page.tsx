"use client";

import { useSession } from "next-auth/react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { DashboardCards } from "@/features/dashboard/components/DashboardCards";
import { useDashboardCards } from "@/features/dashboard/hooks";

function DashboardContent() {
  const { data: session } = useSession();
  const { data: cards, isLoading, error } = useDashboardCards();
  const userName = session?.user?.name || "there";
  const partnerName = session?.partnerInfo?.partner_name;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Hello, {userName}
          {partnerName ? ` · ${partnerName}` : ""}
        </p>
      </div>
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!isLoading && !error && <DashboardCards cards={cards ?? []} />}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_partner_dashboard_cards">
      <DashboardContent />
    </ProtectedRoute>
  );
}
