"use client";

import type { DashboardCard } from "@/types/dashboard";

export function DashboardCards({ cards }: { cards: DashboardCard[] }) {
  if (cards.length === 0) {
    return <p className="py-8 text-center text-gray-500">No dashboard data</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="rounded border p-4">
          <p className="text-sm text-gray-500">{card.title}</p>
          <p className="mt-1 text-3xl font-semibold">{card.count}</p>
        </div>
      ))}
    </div>
  );
}
