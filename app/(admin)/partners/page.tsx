"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { PartnerTable } from "@/features/partners/components/PartnerTable";
import { usePartners } from "@/features/partners/hooks";

function PartnersContent() {
  const router = useRouter();
  const { partners, isLoading, error } = usePartners();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Partners</h1>
        <Link href="/partners/new" className="rounded bg-black px-4 py-2 text-white">
          New partner
        </Link>
      </div>
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-sm text-critical">{error}</p>}
      {!isLoading && !error && (
        <PartnerTable
          partners={partners}
          onSelect={(partner) => router.push(`/partners/${partner.id}`)}
        />
      )}
    </div>
  );
}

export default function PartnersPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_all_partners">
      <PartnersContent />
    </ProtectedRoute>
  );
}
