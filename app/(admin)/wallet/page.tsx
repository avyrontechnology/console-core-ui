"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import {
  WalletOverview,
  WalletTransactionTable,
} from "@/features/wallet/components/WalletComponents";
import { useWallet, useWalletTransactions } from "@/features/wallet/hooks";

function WalletContent() {
  const { data: wallet, isLoading: walletLoading, error: walletError } = useWallet();
  const {
    data: txns,
    isLoading: txnsLoading,
    error: txnsError,
  } = useWalletTransactions({ limit: 20, offset: 1 });

  const isLoading = walletLoading || txnsLoading;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Wallet</h1>
      {isLoading && <p>Loading…</p>}
      {walletError && <p className="text-sm text-red-600">{walletError}</p>}
      {txnsError && <p className="text-sm text-red-600">{txnsError}</p>}
      {!walletLoading && !walletError && wallet && <WalletOverview wallet={wallet} />}
      {!txnsLoading && !txnsError && (
        <WalletTransactionTable transactions={txns?.transactions ?? []} />
      )}
    </div>
  );
}

export default function WalletPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_wallet">
      <WalletContent />
    </ProtectedRoute>
  );
}
