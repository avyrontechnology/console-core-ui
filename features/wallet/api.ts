import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type { Wallet, WalletTransactionList, WalletTransactionsParams } from "@/types/wallet";

/** All wallet HTTP calls, in one place. */
export const walletApi = {
  get(partnerId?: string): Promise<Wallet> {
    return consoleApi.get<Wallet>(ENDPOINTS.WALLET({ partner_id: partnerId }));
  },

  transactions(params: WalletTransactionsParams): Promise<WalletTransactionList> {
    return consoleApi.get<WalletTransactionList>(ENDPOINTS.WALLET_TRANSACTIONS(params));
  },
};
