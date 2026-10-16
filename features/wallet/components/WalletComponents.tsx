"use client";

import type { Wallet, WalletTransaction } from "@/types/wallet";

export function WalletOverview({ wallet }: { wallet: Wallet }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded border p-4">
        <p className="text-sm text-gray-500">Balance</p>
        <p className="mt-1 text-2xl font-semibold">
          {wallet.balance} {wallet.currency}
        </p>
      </div>
      <div className="rounded border p-4">
        <p className="text-sm text-gray-500">Frozen</p>
        <p className="mt-1 text-2xl font-semibold">{wallet.frozen_balance}</p>
      </div>
      <div className="rounded border p-4">
        <p className="text-sm text-gray-500">Available</p>
        <p className="mt-1 text-2xl font-semibold">
          {Number(wallet.balance) - Number(wallet.frozen_balance)} {wallet.currency}
        </p>
      </div>
    </div>
  );
}

export function WalletTransactionTable({ transactions }: { transactions: WalletTransaction[] }) {
  if (transactions.length === 0) {
    return <p className="py-8 text-center text-gray-500">No transactions found</p>;
  }

  return (
    <div className="overflow-x-auto rounded border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-4 py-2 font-medium">Date</th>
            <th className="px-4 py-2 font-medium">Service</th>
            <th className="px-4 py-2 font-medium">Type</th>
            <th className="px-4 py-2 font-medium">Amount</th>
            <th className="px-4 py-2 font-medium">Balance</th>
            <th className="px-4 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-2">{new Date(t.created_at).toLocaleString()}</td>
              <td className="px-4 py-2">{t.service_name}</td>
              <td className="px-4 py-2">{t.transaction_type}</td>
              <td className="px-4 py-2">{t.amount}</td>
              <td className="px-4 py-2">{t.remaining_balance}</td>
              <td className="px-4 py-2">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
